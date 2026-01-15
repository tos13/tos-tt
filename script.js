/* =========================================
   Smash 26 - Global JavaScript
   ========================================= */

/* --- Constants & Config --- */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqGNDogxiRKAKIRCulNrpNqu3K0imQ7s0kmCXfEiYog6hRxEIx3940nbQ53RWUjVzg/exec";
const LEGEND_NAMES = ["Prex", "Prachi", "Kuldeep", "Bhagwati", "Divya", "Ketan"];
const COUNTDOWN_DATE = new Date("Jan 14, 2026 17:00:00").getTime();

/* --- Shared Utilities --- */
function showToast(message, type = "error") {
    const container = document.getElementById("notification-area");
    if (!container) return; // Guard clause

    const toast = document.createElement("div");
    toast.className = "toast " + (type === "error" ? "toast-error" : "");
    toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* --- Tournament Dashboard Logic (Tabs) --- */
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    if (tabs.length === 0) return;

    tabs.forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('tab-' + tabName);
    if (target) target.classList.remove('hidden');

    const buttons = ['schedule', 'bracket', 'rules', 'teams'];
    buttons.forEach(btn => {
        const el = document.getElementById('btn-' + btn);
        if (!el) return;

        if (btn === tabName) {
            el.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
            el.classList.add('active');
        } else {
            el.classList.remove('active');
            el.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
        }
    });
}

/* --- Index Page Logic --- */
document.addEventListener('DOMContentLoaded', () => {

    // 0. Intro Animation
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        setTimeout(() => {
            introOverlay.classList.add('intro-hidden');
            setTimeout(() => {
                introOverlay.remove();
            }, 1000); // Wait for transition opacity
        }, 2000); // Display time
    }

    // 1. Easter Egg Logic
    const logos = document.querySelectorAll(".easter-egg-logo");
    let clickTimer;
    let clickCount = 0;

    function activateCreatorMode() {
        document.body.classList.add("creator-mode");
        const subtitle = document.getElementById("tournament-subtitle");
        if (subtitle) {
            subtitle.innerHTML = "You Found The Easter Egg<br> DESIGNED BY ASHUTOSH RATHORE";
            subtitle.classList.add("text-gradient");
        }

        const modal = document.getElementById("egg-modal");
        if (modal) modal.classList.remove("hidden");

        if (window.confetti) {
            const duration = 3000;
            const end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ffd700", "#ffffff"] });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ffd700", "#ffffff"] });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    }

    if (logos.length > 0) {
        logos.forEach(logo => {
            logo.addEventListener("click", () => {
                clickCount++;
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
                if (clickCount >= 5) {
                    activateCreatorMode();
                    clickCount = 0;
                }
            });
        });
    }

    // Window global functions for HTML onclick attributes
    window.closeEggModal = function () {
        const modal = document.getElementById("egg-modal");
        if (modal) modal.classList.add("hidden");
    };

    window.submitEggName = async function () {
        const input = document.getElementById("egg-name-input");
        const btn = document.getElementById("egg-submit-btn");
        if (!input || !btn) return;

        const name = input.value.trim();
        if (name) {
            btn.disabled = true;
            btn.innerHTML = "Saving...";
            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "register_easter_egg", name: name, timestamp: new Date() })
                });
                showToast("Legendary status recorded! 🏆", "success");
                window.closeEggModal();
                if (window.confetti) {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#ffd700", "#ffffff"] });
                }
            } catch (e) {
                console.error(e);
                showToast("Error saving. But you're still a legend.");
            } finally {
                btn.disabled = false;
                btn.innerHTML = "Claim Glory";
            }
        } else {
            showToast("Please enter your name!");
        }
    };

    window.selectSkill = function (skill) {
        const input = document.getElementById("skill-input");
        if (input) input.value = skill;

        const btnPro = document.getElementById("btn-pro");
        const btnNoob = document.getElementById("btn-noob");

        if (btnPro && btnNoob) {
            if (skill === "Pro") {
                btnPro.classList.add("active");
                btnPro.querySelector("span:last-child").classList.remove("grayscale");
                btnNoob.classList.remove("active");
                btnNoob.querySelector("span:last-child").classList.add("grayscale");
            } else {
                btnNoob.classList.add("active");
                btnNoob.querySelector("span:last-child").classList.remove("grayscale");
                btnPro.classList.remove("active");
                btnPro.querySelector("span:last-child").classList.add("grayscale");
            }
        }
    };

    // 2. Countdown Timer
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        const updateCountdown = setInterval(function () {
            const now = new Date().getTime();
            const distance = COUNTDOWN_DATE - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const elDays = document.getElementById("days");
            const elHours = document.getElementById("hours");
            const elMinutes = document.getElementById("minutes");
            const elSeconds = document.getElementById("seconds");

            if (elDays) elDays.innerText = days < 10 ? "0" + days : days;
            if (elHours) elHours.innerText = hours < 10 ? "0" + hours : hours;
            if (elMinutes) elMinutes.innerText = minutes < 10 ? "0" + minutes : minutes;
            if (elSeconds) elSeconds.innerText = seconds < 10 ? "0" + seconds : seconds;

            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownEl.innerHTML = "<div class='text-xl text-primary font-bold'>REGISTRATION CLOSED</div>";
            }
        }, 1000);
    }

    // 3. Form Handling & Player Count
    const form = document.getElementById("signup-form");

    window.resetForm = function () {
        if (!form) return;
        form.reset();
        window.selectSkill("Dilettante");
        form.classList.remove("hidden");
        const successView = document.getElementById("success-view");
        if (successView) successView.classList.add("hidden");
    };

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    async function fetchPlayerCount() {
        // Just checking context, logic unchanged
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`);
            const text = await response.text();
            let count = 0;
            try {
                const json = JSON.parse(text);
                if (json.status === "success" || json.count !== undefined) {
                    count = json.count;
                }
            } catch (e) {
                const match = text.match(/\d+/);
                if (match) {
                    count = parseInt(match[0]);
                }
            }

            if (count > 0) {
                const countEl = document.getElementById("player-count-value");
                if (countEl) {
                    if (countEl.innerText === "--") {
                        countEl.innerText = count;
                    } else {
                        const current = parseInt(countEl.innerText);
                        if (!isNaN(current) && current !== count) {
                            animateValue(countEl, current, count, 1000);
                        } else if (isNaN(current)) {
                            countEl.innerText = count;
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Failed to fetch player count:", e);
        }
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const department = form.department.value;
            const name = form.name.value.trim();

            if (department === "The Legend Execs" && !LEGEND_NAMES.some(legend => name.toLowerCase().includes(legend.toLowerCase()))) {
                showToast("Only Legends allowed in this department!");
                return;
            }

            const btn = document.getElementById("submit-btn");
            const originalBtnContent = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>Processing...`;

            const data = {
                name: name,
                department: department,
                skill: form.skill.value
            };

            try {
                if (GOOGLE_SCRIPT_URL) {
                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                    });
                } else {
                    // Simulate delay if URL missing
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                form.classList.add("hidden");
                const successView = document.getElementById("success-view");
                if (successView) successView.classList.remove("hidden");

                if (window.confetti) {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#de424a", "#ffffff"] });
                }

            } catch (error) {
                console.error(error);
                alert("Something went wrong. Check console.");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalBtnContent;
            }
        });
    }

    // Initialize player count fetching globally (works even if form is hidden/removed)
    fetchPlayerCount();
    setInterval(fetchPlayerCount, 30000);

});
