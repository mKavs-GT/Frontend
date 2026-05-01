// Frontend/frontend/admin/src/hooks/usePresence.js
import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../services/SocketService';
import { TEAM_MEMBERS } from '../constants/users';

export function usePresence(user, initialStatus = 'offline', roomId = 'global') {
    const [status, setStatus] = useState(initialStatus);
    const [teamPresence, setTeamPresence] = useState({}); // email -> { status, updatedAt, name }
    const [isSynced, setIsSynced] = useState(false);
    const [syncCount, setSyncCount] = useState(0);
    const [error, setError] = useState(null);
    const lastUpdateRef = useRef(0);

    // Initialize teamPresence with offline status from TEAM_MEMBERS
    useEffect(() => {
        const initial = {};
        TEAM_MEMBERS.forEach(m => {
            initial[m.email.toLowerCase().trim()] = {
                status: 'offline',
                name: m.name,
                updatedAt: new Date(0)
            };
        });
        setTeamPresence(initial);
    }, []);

    const handleMessage = useCallback((data) => {
        switch (data.type) {
            case 'socket:connected':
                setIsSynced(true);
                // Re-join room on reconnect
                socketService.send({
                    type: 'presence:join',
                    payload: { roomId, user: { id: user.uid, email: user.email, name: user.name } }
                });
                // Send current status
                socketService.send({
                    type: 'presence:update',
                    payload: { status, roomId }
                });
                break;

            case 'socket:disconnected':
                setIsSynced(false);
                break;

            case 'presence:snapshot':
                const { members } = data.payload;
                setTeamPresence(prev => {
                    const next = { ...prev };
                    members.forEach(m => {
                        next[m.email.toLowerCase().trim()] = {
                            status: m.status,
                            name: m.name,
                            updatedAt: new Date(m.updatedAt || m.lastSeen)
                        };
                    });
                    return next;
                });
                setSyncCount(members.length);
                break;

            case 'presence:update':
                const member = data.payload;
                setTeamPresence(prev => {
                    const email = member.email.toLowerCase().trim();
                    // Debounce or last-write-wins check (updatedAt)
                    const existing = prev[email];
                    const newTime = new Date(member.updatedAt).getTime();
                    if (existing && new Date(existing.updatedAt).getTime() > newTime) {
                        return prev;
                    }

                    return {
                        ...prev,
                        [email]: {
                            status: member.status,
                            name: member.name,
                            updatedAt: member.updatedAt
                        }
                    };
                });
                break;
        }
    }, [user, roomId, status]);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = socketService.subscribe(handleMessage);
        socketService.connect();

        // Join room immediately if already connected
        socketService.send({
            type: 'presence:join',
            payload: { roomId, user: { id: user.uid, email: user.email, name: user.name } }
        });

        return () => {
            unsubscribe();
            // We don't necessarily want to disconnect the singleton, 
            // but we could send a leave event if we wanted to be strict.
            // socketService.send({ type: 'presence:leave', payload: { roomId } });
        };
    }, [user, roomId, handleMessage]);

    const updateStatus = useCallback((newStatus) => {
        if (newStatus === status) return;

        // Debounce rapid switches
        const now = Date.now();
        if (now - lastUpdateRef.current < 500) return;
        lastUpdateRef.current = now;

        // Optimistic UI update
        setStatus(newStatus);
        
        // Broadcast to server
        socketService.send({
            type: 'presence:update',
            payload: { status: newStatus, roomId }
        });

        // Optional: Local storage sync
        localStorage.setItem('mkavs_staff_status', newStatus);
    }, [status, roomId]);

    return {
        status,
        teamPresence,
        isSynced,
        syncCount,
        error,
        updateStatus
    };
}
