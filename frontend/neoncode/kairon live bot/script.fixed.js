document.addEventListener('DOMContentLoaded', () => {
    console.log('Kairon script loaded');

    // --- DOM Elements ---
    const root = document.getElementById('kairon');
    const btn = document.getElementById('kairon-button');
    const panel = document.getElementById('kairon-panel');
    const closeBtn = document.getElementById('kairon-close');
    const form = document.getElementById('kairon-form');
    const input = document.getElementById('kairon-input');
    const messages = document.getElementById('kairon-messages');
    const faqPane = document.getElementById('kairon-faq-pane');
    const categoriesEl = document.getElementById('kairon-categories');
    const agentSelector = document.getElementById('agent-selector');

    // --- State ---
    window.onlineAgents = []; // Global for priority logic
    let ws = null;
    let currentAgent = null;
    let allFaqs = [];
    let currentCategory = 'Pricing';

    // --- KEYWORD MAPPING LOGIC ---
    const categoryKeywords = {
        'Pricing': ['cost', 'price', 'quote', 'billing', 'payment', 'rate', 'money', 'charge', 'fee', 'afford', 'budget'],
        'Features': ['design', 'mobile', 'seo', 'cms', 'blog', 'analytics', 'speed', 'responsive', 'platform', 'custom', 'widget', 'plugin'],
        'Account': ['login', 'password', 'sign up', 'access', 'email', 'register', 'account', 'profile', 'user'],
        'Support': ['support', 'help', 'maintenance', 'training', 'documentation', 'tutorial', 'issue', 'problem'],
        'General': [] // Fallback
    };

    // --- WebSocket Connection ---
    function connectWebSocket() {
        console.log('Attempting WS connection...');
        ws = new WebSocket('ws://localhost:3000/customer');

        ws.onopen = () => {
            console.log('Connected to Live Chat Server');
            const title = document.querySelector('.panel-header .title');
            if (title) title.textContent = 'Kairon (Connected)';
            // Send initial handshake to register customer and get staff list
            ws.send(JSON.stringify({}));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WS Message:', data); // Debug log
                window.handleServerMessage(data);
            } catch (e) {
                console.error('WS Parse Error', e);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from Live Chat Server');
            const title = document.querySelector('.panel-header .title');
            if (title) title.textContent = 'Kairon (Disconnected)';
            setTimeout(connectWebSocket, 3000); // Reconnect
        };

        ws.onerror = (err) => {
            console.error('WS Error:', err);
        };
    }

    window.handleServerMessage = function (data) {
        switch (data.type) {
            case 'staff_list':
                // Server sends [{name, status, ...}], we need just names of ONLINE agents
                window.onlineAgents = (data.staff || [])
                    .filter(s => s.status === 'online')
                    .map(s => s.name);
                console.log('Online agents updated:', window.onlineAgents);
                break;
            case 'staff_message':
                appendMessage(data.message, 'agent');
                break;
            case 'request_failed':
                appendMessage('Agent unavailable at the moment. Please try again later.', 'system');
                currentAgent = null;
                break;
            case 'request_accepted':
                currentAgent = data.staff;
                appendMessage(`You are now connected with ${data.staff}.`, 'system');
                break;
            case 'chat_closed':
                appendMessage('Chat ended by agent.', 'system');
                currentAgent = null;
                break;
        }
    }

    connectWebSocket();

    // --- UI Functions ---

    function setOpen(open) {
        if (open) {
            panel.style.display = 'flex';
            root.classList.add('open');
            panel.setAttribute('aria-hidden', 'false');
            input.focus();
        } else {
            root.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
            panel.style.display = 'none';
        }
    }

    function appendMessage(text, type) {
        const el = document.createElement('div');
        el.className = `msg ${type}`;
        el.textContent = text;
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
    }

    // --- Logic Functions ---

    window.requestStaff = function (name) {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            appendMessage("Connection to server lost. Reconnecting...", 'system');
            return;
        }

        const priority = ['Mr.K', 'Mr.A', 'Mr.S', 'Mr.V', 'Mr.M'];

        if (name && window.onlineAgents.includes(name)) {
            ws.send(JSON.stringify({ type: 'request_staff', requestedStaff: name }));
            appendMessage(`Connecting to ${name}...`, 'system');
            return;
        }

        let target = priority.find(p => window.onlineAgents.includes(p));

        if (target) {
            ws.send(JSON.stringify({ type: 'request_staff', requestedStaff: target }));
            appendMessage(`Connecting to ${target}...`, 'system');
        } else {
            appendMessage("No live agents are currently available. Please leave a message or try again later.", 'bot');
            appendMessage("You can email us at support@kairon.com", 'bot');
        }
    };

    function botReplyFor(text) {
        const t = text.trim().toLowerCase();
        if (/\b(hi|hello|hey)\b/.test(t)) return "Hello! How can I assist you?";

        // Search in loaded FAQs
        const match = allFaqs.find(f => f.question.toLowerCase().includes(t));
        if (match) return match.answer;

        return null;
    }

    // --- FAQ LOADING & RENDERING ---

    async function loadFaqData() {
        try {
            const response = await fetch('kairon-faqs.json');
            if (!response.ok) throw new Error("JSON file not found");
            allFaqs = await response.json();
            console.log("Loaded FAQs:", allFaqs.length);
            renderCategories();
            filterAndRenderFaqs('Pricing'); // Default view
        } catch (error) {
            console.error("Error loading FAQs:", error);
            appendMessage("System: Could not load FAQ data. Please ensure server is running.", 'system');
        }
    }

    function renderCategories() {
        if (!categoriesEl) return;
        categoriesEl.innerHTML = '';

        Object.keys(categoryKeywords).forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-chip';
            btn.textContent = cat;
            btn.onclick = () => filterAndRenderFaqs(cat);
            if (cat === currentCategory) btn.classList.add('active');
            categoriesEl.appendChild(btn);
        });
    }

    function filterAndRenderFaqs(categoryName) {
        if (!faqPane) return;
        faqPane.innerHTML = '';
        currentCategory = categoryName;

        // Update active chip styling
        document.querySelectorAll('.category-chip').forEach(b => {
            b.classList.remove('active');
            if (b.textContent === categoryName) b.classList.add('active');
        });

        // Filter Logic
        const keywords = categoryKeywords[categoryName];
        let filtered = [];

        if (categoryName === 'Support') {
            // Support category: Add "Contact support" button first
            const contactBtn = document.createElement('button');
            contactBtn.className = 'suggestion-btn';
            contactBtn.textContent = 'Contact support';
            contactBtn.onclick = () => {
                appendMessage('Contact support', 'user');
                setTimeout(() => window.requestStaff(), 500);
            };
            faqPane.appendChild(contactBtn);

            // Then add support-related FAQs
            filtered = allFaqs.filter(item => {
                const q = item.question.toLowerCase();
                return keywords.some(k => q.includes(k));
            });
        } else if (keywords && keywords.length > 0) {
            filtered = allFaqs.filter(item => {
                const q = item.question.toLowerCase();
                return keywords.some(k => q.includes(k));
            });
        } else {
            // General category - random selection
            filtered = allFaqs;
        }

        // Show top 5 results to keep UI clean
        filtered.slice(0, 5).forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = item.question;
            btn.onclick = () => handleUserSelection(item);
            faqPane.appendChild(btn);
        });
    }

    function handleUserSelection(item) {
        appendMessage(item.question, 'user');
        setTimeout(() => {
            appendMessage(item.answer, 'bot');
        }, 500);
    }

    // --- Initialization ---

    loadFaqData(); // Load FAQs from JSON
    renderCategories();

    // Initial Messages
    setTimeout(() => {
        if (messages.children.length === 0) {
            appendMessage("Hi! I'm Kairon. How can I help you today?", 'bot');
            setTimeout(() => {
                appendMessage("I'm looking for information about your services.", 'user');
                setTimeout(() => {
                    appendMessage("Sure! I can help with that. What specifically are you interested in?", 'bot');
                }, 500);
            }, 500);
        }
    }, 100);

    // --- Event Listeners ---

    if (btn) btn.addEventListener('click', () => setOpen(true));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = input.value.trim();
            if (!val) return;

            appendMessage(val, 'user');
            input.value = '';

            if (currentAgent) {
                if (ws) ws.send(JSON.stringify({ type: 'customer_message', message: val }));
                return;
            }

            setTimeout(() => {
                const reply = botReplyFor(val);
                if (reply) {
                    appendMessage(reply, 'bot');
                } else {
                    appendMessage("I'm not sure about that. Checking for available agents...", 'bot');
                    window.requestStaff();
                }
            }, 500);
        });
    }

    if (agentSelector) {
        agentSelector.addEventListener('change', (e) => {
            const agent = e.target.value;
            if (agent) window.requestStaff(agent);
            e.target.value = "";
        });
    }
});
