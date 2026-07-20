(function () {
    const addiction = localStorage.getItem('addiction');
    const reason = localStorage.getItem('reason');
    let startDate = localStorage.getItem('startDate');

    if (!addiction) {
        window.location.href = 'index.html';
        return;
    }

    if (!startDate) {
        startDate = Date.now().toString();
        localStorage.setItem('startDate', startDate);
    }
    startDate = parseInt(startDate, 10);

    document.getElementById('addiction-name').textContent = addiction;
    const reasonLine = document.getElementById('reason-line');
    reasonLine.textContent = reason ? `Your reason: ${reason}` : '';

    const daysEl = document.querySelector('.days-number');
    const hoursEl = document.querySelector('.hours-number');
    const minutesEl = document.querySelector('.minutes-number');
    const secondsEl = document.querySelector('.seconds-number');
    const riverPath = document.getElementById('riverPath');
    const riverGlow = document.getElementById('riverGlow');
    const riverMessage = document.getElementById('river-message');
    const milestones = {
        2: document.getElementById('algae-1'),
        5: document.getElementById('algae-2'),
        8: document.getElementById('fish-1'),
        15: document.getElementById('fish-2'),
        25: document.getElementById('fish-3'),
    };

    const MIN_WIDTH = 40;
    const MAX_WIDTH = 170;
    const GOAL_DAYS = 20;

    function messageFor(days) {
        if (days < 1) return 'Seen from above - a trickle so far.';
        if (days < 2) return 'A thin blue line is forming.';
        if (days < 8) return 'The channel is widening.';
        if (days < 15) return 'Algae is taking hold along the banks.';
        if (days < 30) return 'Fish are moving in. Life is returning.';
        return 'A wide, living river. This is what recovery looks like from above.';
    }

    function update() {
        const elapsedMs = Date.now() - startDate;
        const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.textContent = days;
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        const exactDays = elapsedMs / 86400000;
        const growth = Math.min(Math.sqrt(exactDays / GOAL_DAYS), 1);
        const width = MIN_WIDTH + growth * (MAX_WIDTH - MIN_WIDTH);

        riverPath.setAttribute('stroke-width', width.toFixed(1));
        riverGlow.setAttribute('stroke-width', (width + 130).toFixed(1));

        riverMessage.textContent = messageFor(exactDays);

        Object.keys(milestones).forEach((day) => {
            if (exactDays >= parseInt(day, 10)) {
                milestones[day].setAttribute('opacity', '1');
            }
        });
    }

    update();
    setInterval(update, 1000);

    const slipBtn = document.getElementById('slip-btn');
    if (slipBtn) {
        slipBtn.addEventListener('click', () => {
            const confirmed = confirm(
                'Logging a slip resets your river back to zero, but keeps your addiction and reason saved. Continue?'
            );
            if (!confirmed) return;
            startDate = Date.now();
            localStorage.setItem('startDate', startDate.toString());
            Object.values(milestones).forEach((el) => el.setAttribute('opacity', '0'));
            update();
        });
    }
})();
