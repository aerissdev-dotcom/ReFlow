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
        } catch (e) {
            /* ignore corrupt storage */
        }
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

    /*
     * Placeholder reply generator — entirely local, no network calls.
     * Swap the body of this function for a real API/backend call later;
     * everything above and below it (rendering, storage, UI state) will
     * keep working unchanged as long as it still returns a string.
     */
    function generateReply(userText) {
        const text = userText.toLowerCase();

        const bank = {
            craving: [
                "Cravings usually peak and pass within about 20 minutes — can you ride out the next few with me?",
                "That urge is real, but it's not an order you have to follow. What's one small thing you could do right now instead?",
            ],
            slip: [
                "One slip doesn't erase your progress. What happened right before it — was there a trigger we can plan around?",
                "Thank you for telling me instead of hiding it. That honesty is exactly what keeps this useful. How are you feeling now?",
            ],
            good: [
                "That's genuinely great to hear. What's been helping the most lately?",
                "Love that. Worth pausing on for a second — what does today feel like compared to when you started?",
            ],
            bad: [
                "That sounds heavy. You don't have to have it figured out right now — just tell me more about what's going on.",
                "I'm glad you said something instead of sitting with it alone. What's weighing on you most?",
            ],
            default: [
                "I hear you. Tell me a bit more about what's going on?",
                "Thanks for sharing that. How long has this been on your mind?",
                "That makes sense. What would help most right now — talking it through, or a distraction?",
                "I'm listening. What's the hardest part about today?",
            ],
        };

        let pool = bank.default;
        if (text.includes('crav') || text.includes('urge') || text.includes('tempt')) pool = bank.craving;
        else if (text.includes('slip') || text.includes('relaps')) pool = bank.slip;
        else if (text.includes('good') || text.includes('great') || text.includes('proud') || text.includes('win')) pool = bank.good;
        else if (text.includes('bad') || text.includes('hard') || text.includes('struggl') || text.includes('sad')) pool = bank.bad;

        return pool[Math.floor(Math.random() * pool.length)];
    }

    function sendMessage(text) {
        history.push({ role: 'user', text });
        appendBubble('user', text, true);
        saveHistory();
        input.value = '';
        scrollToBottom();

        setTyping(true);
        const delay = 600 + Math.random() * 700;
        setTimeout(() => {
            setTyping(false);
            const reply = generateReply(text);
            history.push({ role: 'ai', text: reply });
            appendBubble('ai', reply, true);
            saveHistory();
            scrollToBottom();
        }, delay);
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