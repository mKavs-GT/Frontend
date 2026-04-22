import { useEffect, useRef, useState, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  from: string;
  text: string;
}

interface Session {
  id: string;
  customer: { name: string };
  staff?: string | null;
  messages: Message[];
  _unread: number;
}

interface PendingRequest {
  customerId: string;
  customerName: string;
  timer: ReturnType<typeof setTimeout>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const WS_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'ws://localhost:3001'
    : 'wss://api.mkavs.com'; // update if you have a production WS url

const STAFF_NAME = 'Live Agent';

// ── Helpers ───────────────────────────────────────────────────────────────────

function playAlertChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    function beep(freq: number, start: number, end: number, gain: number) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(gain, start);
      g.gain.exponentialRampToValueAtTime(0.001, end);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(start);
      osc.stop(end);
    }
    const now = ctx.currentTime;
    beep(880, now, now + 0.18, 0.35);
    beep(1100, now + 0.2, now + 0.4, 0.3);
    setTimeout(() => ctx.close(), 600);
  } catch (e) {
    console.warn('[Kairon] AudioContext unavailable');
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LiveStaff() {
  const [isOnline, setIsOnline] = useState(false);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [toasts, setToasts] = useState<{ id: number; title: string; msg: string; type: string }[]>([]);
  const [popups, setPopups] = useState<{ customerId: string; customerName: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map());
  const sessionsRef = useRef<Record<string, Session>>({});
  const selectedRef = useRef<string | null>(null);
  const toastIdRef = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync with state
  useEffect(() => { sessionsRef.current = sessions; }, [sessions]);
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, selectedId]);

  // ── Toast ──────────────────────────────────────────────────────────────────

  const showToast = useCallback((title: string, msg = '', type = 'info', duration = 4000) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, title, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  // ── Session helpers ────────────────────────────────────────────────────────

  const upsertSession = useCallback((id: string, patch: Partial<Session>) => {
    setSessions(prev => {
      const existing = prev[id] || { id, customer: { name: 'Guest' }, messages: [], _unread: 0 };
      return { ...prev, [id]: { ...existing, ...patch } };
    });
  }, []);

  const addMessage = useCallback((sessionId: string, from: string, text: string) => {
    setSessions(prev => {
      const existing = prev[sessionId] || { id: sessionId, customer: { name: 'Guest' }, messages: [], _unread: 0 };
      const isSelected = selectedRef.current === sessionId;
      return {
        ...prev,
        [sessionId]: {
          ...existing,
          messages: [...existing.messages, { from, text }],
          _unread: isSelected ? 0 : existing._unread + 1,
        },
      };
    });
  }, []);

  // ── WebSocket ──────────────────────────────────────────────────────────────

  const dismissPopup = useCallback((customerId: string) => {
    const pending = pendingRef.current.get(customerId);
    if (pending) clearTimeout(pending.timer);
    pendingRef.current.delete(customerId);
    setPopups(prev => prev.filter(p => p.customerId !== customerId));
  }, []);

  const acceptRequest = useCallback((customerId: string, customerName: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      showToast('Not connected', 'Click Go Online to reconnect.', 'error');
      return;
    }
    ws.send(JSON.stringify({ type: 'accept_request', customerId, staffName: STAFF_NAME }));
    ws.send(JSON.stringify({ type: 'staff_message', customerId, staffName: STAFF_NAME, message: `Hello! I am ${STAFF_NAME}. How can I help you?` }));
    upsertSession(customerId, { customer: { name: customerName } });
    setSelectedId(customerId);
    showToast('Session accepted', `Now chatting with ${customerName}`, 'success', 3000);
    dismissPopup(customerId);
  }, [showToast, upsertSession, dismissPopup]);

  const declineRequest = useCallback((customerId: string, customerName: string) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'decline_request', customerId, staffName: STAFF_NAME }));
    }
    showToast('Request declined', `Session with ${customerName} was declined.`, 'warning', 3000);
    dismissPopup(customerId);
  }, [showToast, dismissPopup]);

  const showRequestPopup = useCallback((customerId: string, customerName: string, timeoutMs = 30000) => {
    if (pendingRef.current.has(customerId)) return;
    playAlertChime();
    setPopups(prev => [...prev, { customerId, customerName }]);
    const timer = setTimeout(() => {
      if (pendingRef.current.has(customerId)) acceptRequest(customerId, customerName);
    }, timeoutMs);
    pendingRef.current.set(customerId, { customerId, customerName, timer });
  }, [acceptRequest]);

  const startWs = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      showToast('Already online', 'You are already connected.', 'info', 2500);
      return;
    }
    const ws = new WebSocket(WS_BASE + '/staff');
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'staff_online', staffName: STAFF_NAME }));
      setIsOnline(true);
      showToast('🟢 You are now Online', 'Live agent requests will appear as pop-ups.', 'success', 5000);
    });

    ws.addEventListener('message', (ev) => {
      let d: any = {};
      try { d = JSON.parse(ev.data || '{}'); } catch { return; }

      if (d.type === 'request_staff') {
        const cid = d.customerId;
        const name = d.customerName || 'Guest';
        if (!cid) return;
        upsertSession(cid, { customer: { name } });
        showRequestPopup(cid, name, 30000);
      } else if (d.type === 'assigned') {
        const cid = d.customerId;
        const name = d.customerName || 'Guest';
        if (!cid) return;
        upsertSession(cid, { customer: { name } });
      } else if (d.type === 'queued_message' || d.type === 'customer_message') {
        const cid = d.customerId;
        if (!cid) return;
        addMessage(cid, d.customerName || 'Guest', d.message);
        if (selectedRef.current !== cid) {
          showToast(
            `${d.customerName || 'Guest'} says:`,
            d.message.slice(0, 80) + (d.message.length > 80 ? '…' : ''),
            'info',
            4000,
          );
        }
      } else if (d.type === 'transferred' || d.type === 'closed') {
        showToast(`Session ${d.type}`, '', 'warning', 3000);
      }
    });

    ws.addEventListener('close', () => {
      setIsOnline(false);
      showToast('Disconnected', 'You went offline. Click Go Online to reconnect.', 'warning', 6000);
    });

    ws.addEventListener('error', () => {
      showToast('Connection error', 'Could not reach the chat server.', 'error', 6000);
    });
  }, [showToast, showRequestPopup, upsertSession, addMessage]);

  const goOffline = useCallback(() => {
    const ws = wsRef.current;
    if (ws) {
      try { ws.send(JSON.stringify({ type: 'staff_offline', staffName: STAFF_NAME })); } catch { /* */ }
      ws.close();
      wsRef.current = null;
    }
    setIsOnline(false);
    pendingRef.current.forEach(r => clearTimeout(r.timer));
    pendingRef.current.clear();
    setPopups([]);
    showToast('You are now Offline', 'Incoming requests are paused.', 'warning', 4000);
  }, [showToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
      pendingRef.current.forEach(r => clearTimeout(r.timer));
    };
  }, []);

  // ── Send message ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    if (!selectedId) { showToast('No session', 'Select a session first.', 'error', 2500); return; }
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      showToast('Not connected', 'Click Go Online first.', 'error', 2500);
      return;
    }
    ws.send(JSON.stringify({ type: 'staff_message', customerId: selectedId, staffName: STAFF_NAME, message: text }));
    addMessage(selectedId, STAFF_NAME, text);
    setInputText('');
  }, [inputText, selectedId, showToast, addMessage]);

  const transferChat = useCallback(() => {
    if (!selectedId) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) { showToast('Not connected', '', 'error'); return; }
    ws.send(JSON.stringify({ type: 'transfer_chat', customerId: selectedId, fromStaff: STAFF_NAME, toStaff: 'Live Agent' }));
    setSessions(prev => { const n = { ...prev }; delete n[selectedId]; return n; });
    setSelectedId(null);
  }, [selectedId, showToast]);

  const closeChat = useCallback(() => {
    if (!selectedId) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) { showToast('Not connected', '', 'error'); return; }
    ws.send(JSON.stringify({ type: 'close_chat', customerId: selectedId, staffName: STAFF_NAME }));
    setSessions(prev => { const n = { ...prev }; delete n[selectedId]; return n; });
    setSelectedId(null);
  }, [selectedId, showToast]);

  // ── Derived state ──────────────────────────────────────────────────────────

  const sessionList = Object.values(sessions);
  const activeSession = selectedId ? sessions[selectedId] : null;

  const toastIcons: Record<string, string> = { success: '✅', warning: '⚠️', info: '💬', error: '🚫' };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        .ls-root { --dk-bg:#0d0a14; --dk-surface:#1a1526; --dk-surface2:#221c35;
          --dk-border:rgba(124,77,255,0.14); --dk-text:#e8e0ff; --dk-text-sub:#7c6fa0;
          --dk-accent:#7C4DFF; --kairon-purple:#4A148C; --kairon-accent:#7C4DFF;
          display:flex; flex-direction:column; height:100%; min-height:0;
          background:var(--dk-bg); color:var(--dk-text);
          font-family:system-ui,-apple-system,sans-serif; }

        /* Topbar */
        .ls-topbar { display:flex; align-items:center; justify-content:space-between;
          gap:16px; background:linear-gradient(135deg,var(--kairon-purple),var(--kairon-accent));
          color:#fff; padding:0 28px; height:64px; flex-shrink:0;
          box-shadow:0 4px 32px rgba(124,77,255,0.35); }
        .ls-brand { display:flex; align-items:center; gap:12px; }
        .ls-brand-title { font-size:18px; font-weight:700; }
        .ls-divider { width:1px; height:28px; background:rgba(255,255,255,0.25); margin:0 4px; }
        .ls-identity { display:flex; align-items:center; gap:10px; font-size:14px; font-weight:600; }
        .ls-status-dot { width:10px; height:10px; border-radius:50%; background:#9ca3af; flex-shrink:0; transition:background 0.4s; }
        .ls-status-dot.online { background:#10b981; animation:ls-pulse 1.8s infinite; }
        @keyframes ls-pulse { 0%{box-shadow:0 0 0 0 rgba(16,185,129,0.5)} 70%{box-shadow:0 0 0 7px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
        .ls-status-label { font-size:12px; font-weight:500; letter-spacing:0.3px; }
        .ls-actions { display:flex; align-items:center; gap:10px; }
        .ls-btn { padding:8px 18px; border-radius:20px; border:1.5px solid rgba(255,255,255,0.35);
          background:rgba(255,255,255,0.15); color:#fff; font-size:13px; font-weight:600;
          cursor:pointer; transition:all 0.25s; backdrop-filter:blur(4px); }
        .ls-btn:hover { background:rgba(255,255,255,0.28); border-color:rgba(255,255,255,0.6); transform:translateY(-1px); }
        .ls-btn.active { background:#fff; color:var(--kairon-purple); border-color:transparent; }

        /* Layout */
        .ls-body { display:flex; gap:20px; padding:24px 28px; flex:1; min-height:0; box-sizing:border-box; }

        /* Card */
        .ls-card { background:var(--dk-surface); border-radius:20px;
          box-shadow:0 12px 40px rgba(0,0,0,0.5),0 0 0 1px var(--dk-border);
          border:1px solid var(--dk-border); display:flex; flex-direction:column; overflow:hidden; }
        .ls-card-header { flex-shrink:0; padding:16px 20px; border-bottom:1px solid var(--dk-border);
          display:flex; align-items:center; justify-content:space-between;
          background:var(--dk-surface2); }
        .ls-card-title { font-size:14px; font-weight:700; color:var(--dk-accent); letter-spacing:0.4px; text-transform:uppercase; }

        /* Inbox */
        .ls-inbox { width:300px; flex-shrink:0; }
        .ls-inbox-list { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px;
          scrollbar-width:thin; scrollbar-color:rgba(124,77,255,0.2) transparent; }
        .ls-session-count { font-size:12px; font-weight:600; color:#fff; background:var(--kairon-accent);
          padding:2px 9px; border-radius:12px; min-width:20px; text-align:center; }
        .ls-inbox-empty { text-align:center; padding:40px 20px; color:var(--dk-text-sub); font-size:13px; }
        .ls-empty-icon { font-size:36px; margin-bottom:10px; opacity:0.4; }

        /* Session item */
        .ls-session-item { width:100%; text-align:left; padding:12px 16px; background:var(--dk-surface2);
          border:1px solid var(--dk-border); border-radius:14px; font-size:14px; color:var(--dk-text);
          font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center;
          justify-content:space-between; gap:8px; box-shadow:0 2px 8px rgba(0,0,0,0.2); }
        .ls-session-item:hover { background:rgba(124,77,255,0.1); border-color:var(--dk-accent); transform:translateX(4px); }
        .ls-session-item.active { background:var(--kairon-purple); color:#fff; border-color:transparent; transform:translateX(4px); }
        .ls-session-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ls-session-id { font-size:11px; font-weight:500; opacity:0.55; white-space:nowrap; }
        .ls-unread { background:var(--kairon-accent); color:#fff; font-size:11px; font-weight:700;
          border-radius:10px; padding:2px 8px; min-width:20px; text-align:center; flex-shrink:0; }

        /* Viewer */
        .ls-viewer { flex:1; min-width:0; }
        .ls-meta { padding:10px 20px; border-bottom:1px solid var(--dk-border); flex-shrink:0;
          display:flex; align-items:center; gap:8px; flex-wrap:wrap; background:var(--dk-surface2); }
        .ls-meta-chip { font-size:12px; font-weight:600; color:var(--dk-accent);
          background:rgba(124,77,255,0.12); border:1px solid rgba(124,77,255,0.2); padding:4px 12px; border-radius:12px; }
        .ls-meta-placeholder { font-size:13px; color:var(--dk-text-sub); font-style:italic; }
        .ls-chat { flex:1; overflow-y:auto; padding:16px 20px; display:flex; flex-direction:column;
          gap:12px; background:var(--dk-surface); scrollbar-width:thin; scrollbar-color:rgba(124,77,255,0.2) transparent; }
        .ls-viewer-empty { flex:1; display:flex; flex-direction:column; align-items:center;
          justify-content:center; color:var(--dk-text-sub); gap:12px; padding:40px; }
        .ls-viewer-empty-icon { font-size:48px; opacity:0.3; }

        /* Messages */
        .ls-msg { max-width:75%; padding:10px 14px; border-radius:14px; font-size:14px; line-height:1.5; }
        .ls-msg.user { align-self:flex-start; background:var(--dk-surface2); border:1px solid var(--dk-border); }
        .ls-msg.agent { align-self:flex-end; background:var(--dk-accent); color:#fff; }
        .ls-msg.system { align-self:center; font-size:12px; color:var(--dk-text-sub); font-style:italic; }

        /* Action row */
        .ls-action-row { flex-shrink:0; display:flex; align-items:center; gap:10px;
          padding:12px 20px; border-top:1px solid var(--dk-border); background:var(--dk-surface2); flex-wrap:wrap; }
        .ls-action-label { font-size:12px; font-weight:600; color:var(--dk-text-sub); }
        .ls-action-chip { white-space:nowrap; padding:8px 18px; background:var(--dk-surface);
          border:1px solid rgba(124,77,255,0.22); border-radius:20px; font-weight:600;
          font-size:13px; color:var(--dk-text); cursor:pointer; transition:all 0.2s; }
        .ls-action-chip:hover { background:var(--dk-accent); color:#fff; transform:translateY(-2px); border-color:transparent; }
        .ls-action-chip.danger:hover { background:#dc2626; }

        /* Composer */
        .ls-composer { flex-shrink:0; display:flex; gap:10px; padding:14px 20px;
          border-top:1px solid var(--dk-border); background:var(--dk-surface2); }
        .ls-composer-input { flex:1; padding:10px 16px; border-radius:20px;
          border:1px solid var(--dk-border); background:var(--dk-surface); color:var(--dk-text);
          font-size:14px; outline:none; transition:border-color 0.2s; }
        .ls-composer-input:focus { border-color:rgba(124,77,255,0.5); box-shadow:0 0 0 3px rgba(124,77,255,0.12); }
        .ls-composer-input::placeholder { color:var(--dk-text-sub); }
        .ls-send-btn { padding:10px 20px; border-radius:20px; border:none;
          background:var(--dk-accent); color:#fff; font-weight:700; font-size:14px;
          cursor:pointer; transition:all 0.2s; }
        .ls-send-btn:hover { background:#9c6fff; transform:translateY(-1px); }

        /* Toast */
        #ls-toast-area { position:fixed; top:80px; right:20px; z-index:9000;
          display:flex; flex-direction:column; gap:10px; pointer-events:none; }
        .ls-toast { pointer-events:auto; min-width:260px; max-width:340px; padding:14px 18px;
          border-radius:14px; font-size:13px; font-weight:600; color:#fff;
          display:flex; align-items:center; gap:10px;
          box-shadow:0 8px 30px rgba(0,0,0,0.45); backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,0.1);
          animation:ls-toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .ls-toast.success { background:linear-gradient(135deg,rgba(16,185,129,0.9),rgba(5,150,105,0.9)); }
        .ls-toast.warning { background:linear-gradient(135deg,rgba(245,158,11,0.9),rgba(217,119,6,0.9)); }
        .ls-toast.info    { background:linear-gradient(135deg,rgba(124,77,255,0.9),rgba(74,20,140,0.9)); }
        .ls-toast.error   { background:linear-gradient(135deg,rgba(220,38,38,0.9),rgba(185,28,28,0.9)); }
        .ls-toast-body { flex:1; line-height:1.4; }
        .ls-toast-title { font-weight:700; }
        .ls-toast-msg { font-weight:400; font-size:12px; opacity:0.85; margin-top:2px; }
        @keyframes ls-toast-in { from{opacity:0;transform:translateX(60px) scale(0.92)} to{opacity:1;transform:none} }

        /* Popup */
        #ls-popup-area { position:fixed; bottom:24px; right:24px; z-index:9100;
          display:flex; flex-direction:column-reverse; gap:12px; pointer-events:none; }
        .ls-popup { pointer-events:auto; width:320px; background:var(--dk-surface2);
          border:1px solid rgba(124,77,255,0.35); border-radius:18px;
          box-shadow:0 16px 48px rgba(0,0,0,0.55); overflow:hidden;
          animation:ls-popup-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .ls-popup-bar { height:4px; background:linear-gradient(90deg,var(--dk-accent),#a855f7);
          animation:ls-bar-pulse 1.8s ease-in-out infinite; }
        @keyframes ls-bar-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
        .ls-popup-body { padding:16px 18px 12px; }
        .ls-popup-header { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .ls-popup-avatar { width:38px; height:38px; border-radius:50%;
          background:linear-gradient(135deg,var(--dk-accent),#a855f7);
          display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
        .ls-popup-name { font-size:14px; font-weight:700; color:var(--dk-text); }
        .ls-popup-id { font-size:11px; color:var(--dk-text-sub); margin-top:2px; }
        .ls-popup-preview { font-size:13px; color:var(--dk-text-sub); line-height:1.5;
          padding:8px 12px; background:rgba(124,77,255,0.07); border:1px solid rgba(124,77,255,0.12);
          border-radius:10px; margin-bottom:12px; }
        .ls-popup-btns { display:flex; gap:8px; }
        .ls-popup-btn { flex:1; padding:9px 0; border-radius:10px; border:none;
          font-size:13px; font-weight:700; cursor:pointer; transition:all 0.2s; }
        .ls-popup-accept { background:linear-gradient(135deg,var(--dk-accent),#a855f7); color:#fff;
          box-shadow:0 4px 14px rgba(124,77,255,0.4); }
        .ls-popup-accept:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(124,77,255,0.55); }
        .ls-popup-decline { background:rgba(220,38,38,0.1); color:#f87171; border:1px solid rgba(220,38,38,0.25); }
        .ls-popup-decline:hover { background:rgba(220,38,38,0.22); transform:translateY(-2px); }
        @keyframes ls-popup-in { from{opacity:0;transform:translateY(30px) scale(0.9)} to{opacity:1;transform:none} }

        @media (max-width:700px) {
          .ls-body { flex-direction:column; padding:16px; }
          .ls-inbox { width:100%; }
        }
      `}</style>

      <div className="ls-root" style={{ height: '100%' }}>
        {/* ── Topbar ── */}
        <header className="ls-topbar">
          <div className="ls-brand">
            <div className="ls-brand-title">Kairon</div>
            <div className="ls-divider" />
            <div className="ls-identity">
              <div className={`ls-status-dot${isOnline ? ' online' : ''}`} />
              <span>{STAFF_NAME}</span>
              <span className="ls-status-label" style={{ opacity: isOnline ? 1 : 0.7 }}>
                {isOnline ? `● Online as ${STAFF_NAME}` : '● Offline'}
              </span>
            </div>
          </div>
          <div className="ls-actions">
            <button className={`ls-btn${isOnline ? ' active' : ''}`} onClick={startWs}>Go Online</button>
            <button className={`ls-btn${!isOnline ? ' active' : ''}`} onClick={goOffline}>Go Offline</button>
          </div>
        </header>

        {/* ── Main Layout ── */}
        <div className="ls-body">

          {/* Inbox */}
          <section className="ls-card ls-inbox">
            <div className="ls-card-header">
              <span className="ls-card-title">Inbox</span>
              <span className="ls-session-count">{sessionList.length}</span>
            </div>
            <div className="ls-inbox-list">
              {sessionList.length === 0 ? (
                <div className="ls-inbox-empty">
                  <div className="ls-empty-icon">📭</div>
                  <div>No active sessions</div>
                </div>
              ) : sessionList.map(s => {
                const shortId = s.id.length > 12 ? s.id.slice(0, 10) + '…' : s.id;
                return (
                  <button
                    key={s.id}
                    className={`ls-session-item${s.id === selectedId ? ' active' : ''}`}
                    onClick={() => { setSelectedId(s.id); setSessions(prev => ({ ...prev, [s.id]: { ...prev[s.id], _unread: 0 } })); }}
                  >
                    <div>
                      <div className="ls-session-name">{s.customer.name || 'Guest'}</div>
                      <div className="ls-session-id">{shortId}</div>
                    </div>
                    {s._unread > 0 && <span className="ls-unread">{s._unread}</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Viewer */}
          <section className="ls-card ls-viewer">
            <div className="ls-card-header">
              <span className="ls-card-title">Chat Viewer</span>
            </div>

            {/* Meta */}
            <div className="ls-meta">
              {activeSession ? (
                <>
                  <span className="ls-meta-chip">📋 {activeSession.id}</span>
                  <span className="ls-meta-chip">👤 {activeSession.customer.name || 'Guest'}</span>
                  <span className="ls-meta-chip">🎧 {activeSession.staff || 'Unassigned'}</span>
                </>
              ) : (
                <span className="ls-meta-placeholder">Select a session from the inbox</span>
              )}
            </div>

            {/* Messages */}
            <div className="ls-chat">
              {!activeSession ? (
                <div className="ls-viewer-empty">
                  <div className="ls-viewer-empty-icon">💬</div>
                  <div>No session selected</div>
                </div>
              ) : activeSession.messages.length === 0 ? (
                <div className="ls-viewer-empty">
                  <div className="ls-viewer-empty-icon">💬</div>
                  <div>No messages yet</div>
                </div>
              ) : activeSession.messages.map((m, i) => {
                const isStaff = m.from === STAFF_NAME || m.from === 'Live Agent';
                const isSystem = m.from === 'System' || m.from === 'system';
                const cls = `ls-msg ${isSystem ? 'system' : isStaff ? 'agent' : 'user'}`;
                return (
                  <div key={i} className={cls}>
                    {!isSystem && <strong style={{ fontSize: 11, opacity: 0.65, display: 'block', marginBottom: 4 }}>{m.from}</strong>}
                    {m.text}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Action row */}
            <div className="ls-action-row">
              <span className="ls-action-label">Transfer to</span>
              <select style={{ padding: '7px 12px', borderRadius: 20, border: '1px solid rgba(124,77,255,0.25)', background: 'var(--dk-surface)', color: 'var(--dk-text)', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
                <option value="Live Agent">Live Agent</option>
              </select>
              <button className="ls-action-chip" onClick={transferChat}>⇄ Transfer</button>
              <button className="ls-action-chip danger" onClick={closeChat}>✕ Close</button>
            </div>

            {/* Composer */}
            <div className="ls-composer">
              <input
                className="ls-composer-input"
                type="text"
                placeholder="Type a message…"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              <button className="ls-send-btn" onClick={sendMessage}>Send ➤</button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Toast Container (portal-style fixed position) ── */}
      <div id="ls-toast-area">
        {toasts.map(t => (
          <div key={t.id} className={`ls-toast ${t.type}`}>
            <span style={{ fontSize: 18 }}>{toastIcons[t.type] || 'ℹ️'}</span>
            <div className="ls-toast-body">
              <div className="ls-toast-title">{t.title}</div>
              {t.msg && <div className="ls-toast-msg">{t.msg}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Popup Container ── */}
      <div id="ls-popup-area">
        {popups.map(p => (
          <div key={p.customerId} className="ls-popup" role="dialog">
            <div className="ls-popup-bar" />
            <div className="ls-popup-body">
              <div className="ls-popup-header">
                <div className="ls-popup-avatar">👤</div>
                <div>
                  <div className="ls-popup-name">{p.customerName}</div>
                  <div className="ls-popup-id">{p.customerId.slice(0, 12)}…</div>
                </div>
              </div>
              <div className="ls-popup-preview">🎧 Requesting live agent support…</div>
              <div className="ls-popup-btns">
                <button className="ls-popup-btn ls-popup-accept" onClick={() => acceptRequest(p.customerId, p.customerName)}>✓ Accept</button>
                <button className="ls-popup-btn ls-popup-decline" onClick={() => declineRequest(p.customerId, p.customerName)}>✕ Decline</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
