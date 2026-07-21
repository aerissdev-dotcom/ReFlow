document.addEventListener('DOMContentLoaded', () => {
    const impulse = document.querySelector(".impulse-btn");
    const mainContent = document.querySelector("body");
    
    if (impulse) {
        impulse.addEventListener("click", function() {
            const originalContent = mainContent.innerHTML;
            mainContent.innerHTML = `
                <div class="breathe-overlay">
                    <span class="breathe-text">Breathe.</span>
                </div>
            `;
            setTimeout(() => {
                mainContent.innerHTML = originalContent;
                location.reload();
            }, 60000);
        });
    }

    const slipBtn = document.querySelector('.slip-btn');
    
    if (slipBtn) {
        slipBtn.addEventListener('click', () => {
            localStorage.setItem('slipTime', new Date().toISOString());
            location.reload();
        });
    }

    const slipTime = localStorage.getItem('slipTime');
    const startDate = slipTime ? new Date(slipTime) : new Date();
    const counterDivs = document.querySelectorAll('.counter div');
    const circles = document.querySelectorAll('.week-circles .circle');
    const streakCountEl = document.querySelector('.streak-count');
    const streakTotalEl = document.querySelector('.streak-total');
    
    function updateAll() {
        const now = new Date();
        const elapsedMs = now - startDate;
        const totalDays = Math.floor(elapsedMs / 86400000);
        const hours = Math.floor((elapsedMs % 86400000) / 3600000);
        const minutes = Math.floor((elapsedMs % 3600000) / 60000);

        if (counterDivs.length === 3) {
            counterDivs[0].innerHTML = `${totalDays} <span>DAYS</span>`;
            counterDivs[1].innerHTML = `${hours} <span>HOURS</span>`;
            counterDivs[2].innerHTML = `${minutes} <span>MINUTES</span>`;
        }

        const filledCount = Math.min(totalDays, 7);
        circles.forEach((circle, i) => {
            circle.classList.toggle('filled', i < filledCount);
        });

        if (streakCountEl) {
            streakCountEl.textContent = `${totalDays} day${totalDays !== 1 ? 's' : ''} clean`;
        }
        if (streakTotalEl) {
            streakTotalEl.textContent = `${totalDays} total clean days`;
        }
    }

    updateAll();
    setInterval(updateAll, 30000);
});