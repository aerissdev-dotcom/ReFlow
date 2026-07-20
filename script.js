document.addEventListener('DOMContentLoaded', () => {
    const storedAddiction = localStorage.getItem('addiction');
    const banner = document.getElementById('resume-banner');

    if (storedAddiction && banner) {
        banner.innerHTML = `Already tracking <strong>${storedAddiction}</strong> — <a href="track.html">go to your river &rarr;</a>`;
        banner.hidden = false;
    }

    const form = document.getElementById('start-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const addiction = document.getElementById('addiction-name-input').value.trim();
        const reason = document.getElementById('why-stop-input').value.trim();

        if (!addiction || !reason) {
            alert('Please fill in both fields before continuing.');
            return;
        }

        const existingAddiction = localStorage.getItem('addiction');
        const existingReason = localStorage.getItem('reason');

        if (existingAddiction && existingReason) {
            const change = confirm(
                `You're already tracking "${existingAddiction}" (${existingReason}). Starting over will reset your river. Continue?`
            );
            if (!change) return;
        }

        localStorage.setItem('addiction', addiction);
        localStorage.setItem('reason', reason);
        localStorage.setItem('startDate', Date.now().toString());
        window.location.href = 'track.html';
    });
});
