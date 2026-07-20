(function () {
    
    const STORAGE_KEY = 'chatHistory';
    const GREETING = "Hi, I'm here whenever you want to talk. What's on your mind?";

    const messagesEl = document.getElementById('chat-messages');
    const typingEl = document.getElementById('chat-typing');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const clearBtn = document.getElementById('clear-btn');

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
        history.push({ role: 'user', text });
        appendBubble('user', text, true);
        saveHistory();
        input.value = '';
        scrollToBottom();

        setTyping(true);
        const reply = await generateReply(text);
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