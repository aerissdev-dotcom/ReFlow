(function () {
    
    const STORAGE_KEY = 'chatHistory';
    const GREETING = "Hi, I'm here whenever you want to talk. What's on your mind?";
    const MAX_MESSAGE_LENGTH = 500;

    const messagesEl = document.getElementById('chat-messages');
    const typingEl = document.getElementById('chat-typing');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const clearBtn = document.getElementById('clear-btn');

    function sanitizeInput(text) {
        return text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .substring(0, MAX_MESSAGE_LENGTH);
    }

    function loadHistory() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : null;
            if (Array.isArray(parsed) && parsed.length) return parsed;
        } catch (e) {}
        return [{ role: 'ai', text: GREETING }];
    }

    let history = loadHistory();

    function saveHistory() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    function renderAll() {
        messagesEl.innerHTML = '';
        history.forEach((msg) => appendBubble(msg.role, msg.text, false));
        scrollToBottom();
    }

    function appendBubble(role, text, animate) {
        const bubble = document.createElement('div');
        bubble.className = 'msg ' + (role === 'user' ? 'msg-user' : 'msg-ai');
        if (animate) bubble.classList.add('msg-enter');
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function setTyping(on) {
        typingEl.hidden = !on;
        if (on) scrollToBottom();
    }

    async function generateReply(userText) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userText })
            });
            const data = await response.json();
            return data.reply;
        } catch (error) {
            return "I'm having trouble connecting right now. But I'm still here for you. Want to try again?";
        }
    }

    async function sendMessage(text) {
        const clean = sanitizeInput(text);
        history.push({ role: 'user', text: clean });
        appendBubble('user', clean, true);
        saveHistory();
        input.value = '';
        scrollToBottom();

        setTyping(true);
        const reply = await generateReply(clean);
        setTyping(false);
        history.push({ role: 'ai', text: reply });
        appendBubble('ai', reply, true);
        saveHistory();
        scrollToBottom();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        sendMessage(text);
    });

    clearBtn.addEventListener('click', () => {
        const confirmed = confirm('Clear this conversation? This cannot be undone.');
        if (!confirmed) return;
        history = [{ role: 'ai', text: GREETING }];
        saveHistory();
        renderAll();
    });

    renderAll();
})();