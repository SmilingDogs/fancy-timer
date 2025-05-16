// Grab elements
// import initWorldMap from "./initWorldMap";
import initGlobe, { isGlobeInitialized } from "./initGlobe"; // Add import
const timer = document.querySelector(".timer");
const wrapper = document.querySelector(".timer-wrapper");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const countdownPanel = document.getElementById("countdownPanel");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const setSecondsInput = document.getElementById("setSeconds");
const setMinutesInput = document.getElementById("setMinutes");
const setHoursInput = document.getElementById("setHours");
const setCountdownBtn = document.getElementById("setCountdownBtn");
const elements = {
  secL: document.getElementById("sec-left"),
  secR: document.getElementById("sec-right"),
  minL: document.getElementById("min-left"),
  minR: document.getElementById("min-right"),
  hrL: document.getElementById("hour-left"),
  hrR: document.getElementById("hour-right"),
};
const laps = document.getElementById("laps");
const beep = document.getElementById("beep");
const lapBtn = document.getElementById("lapBtn");
const removeBtn = document.getElementById("removeCardsBtn");
const thumbnailsContainer = document.getElementById("thumbnailsContainer");
const rainToggle = document.getElementById("rainToggle");
const recentTimesTitle = document.getElementById("recentTimesTitle");
const timeFormatElement = document.getElementById("timeFormat");
const timeFormatToggle = document.getElementById("timeFormatToggle");
const infoToggle = document.getElementById("infoToggle");
const timerElement = document.querySelector(".circular-timer");
const timerCircle = timerElement.querySelector("[data-circle]");
// Variables
let [seconds, minutes, hours] = [0, 0, 0];
let timerInterval = null;
let isCountdown = false;
let lapsCount = 0;
let rainyDay = null; // store rainyDay instance globally
let currentBackgroundUrl = null; // store current background globally
export let isAmPmOn = false; // flag to check if AM/PM format is on
let particleTimeout = null; // store timeout for particles
let COUNTDOWN_SECONDS = null; // Change this value to set desired countdown time
let storedProgress = null; // Add this with other variables at the top
let prevDigits = {
  secL: "0",
  secR: "0",
  minL: "0",
  minR: "0",
  hrL: "0",
  hrR: "0",
};

// Functions
function initParticles() {
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.7, random: false },
        size: { value: 2, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          width: 1,
          opacity: 0.2,
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
            mode: "grab",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 0.5,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });

    if (particleTimeout) clearTimeout(particleTimeout);
    particleTimeout = setTimeout(() => {
      destroyParticles();
    }, 180000); // Stop after 3 min
  }
}

function formatTime(value) {
  return value.toString().padStart(2, "0").split("");
}

function animateDigit(el, newVal, key) {
  if (prevDigits[key] === newVal) return;

  const oldSpan = el.cloneNode(true);
  oldSpan.classList.add("old-digit");
  el.textContent = "";

  const newSpan = document.createElement("span");
  newSpan.textContent = newVal;
  newSpan.classList.add("new-digit");

  el.appendChild(oldSpan);
  el.appendChild(newSpan);

  setTimeout(() => {
    el.textContent = newVal;
  }, 400);

  prevDigits[key] = newVal;
}

function drawCurrentDisplay() {
  let formattedSeconds = seconds % 60;
  let formattedMinutes = minutes % 60;
  let formattedHours = hours % 60;

  const [sL, sR] = formatTime(formattedSeconds);
  const [mL, mR] = formatTime(formattedMinutes);
  const [hL, hR] = formatTime(formattedHours);

  elements.secL.textContent = sL;
  elements.secR.textContent = sR;
  elements.minL.textContent = mL;
  elements.minR.textContent = mR;
  elements.hrL.textContent = hL;
  elements.hrR.textContent = hR;
}

function runTimer() {
  if (hours === 99) {
    stopTimer();
    rockAndRoll();
    return;
  }
  seconds++;
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes === 60) {
    minutes = 0;
    hours++;
  }
  updateDigits();
}

function runCountdown() {
  if (seconds === 0 && minutes === 0 && hours === 0) {
    stopTimer();
    rockAndRoll();
    return;
  }

  if (seconds > 0) {
    seconds--;
  } else if (minutes > 0) {
    minutes--;
    seconds = 59;
  } else if (hours > 0) {
    hours--;
    minutes = 59;
    seconds = 59;
  }
  updateDigits();
}

function updateDigits() {
  const [sL, sR] = formatTime(seconds % 60);
  const [mL, mR] = formatTime(minutes % 60);
  const [hL, hR] = formatTime(hours % 60);

  animateDigit(elements.secR, sR, "secR");
  animateDigit(elements.secL, sL, "secL");
  animateDigit(elements.minR, mR, "minR");
  animateDigit(elements.minL, mL, "minL");
  animateDigit(elements.hrR, hR, "hrR");
  animateDigit(elements.hrL, hL, "hrL");
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    isCountdown ? runCountdown() : runTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function clearInputFields() {
  setSecondsInput.value = "";
  setMinutesInput.value = "";
  setHoursInput.value = "";
}

function resetTimer() {
  stopTimer();
  [seconds, minutes, hours] = [0, 0, 0];
  prevDigits = {
    secL: "0",
    secR: "0",
    minL: "0",
    minR: "0",
    hrL: "0",
    hrR: "0",
  };
  laps.innerHTML = "";
  lapsCount = 0;
  clearInputFields();
  drawCurrentDisplay();
}

function toggleCountdown() {
  isCountdown = !isCountdown;
  toggleModeBtn.textContent = isCountdown ? "Timer mode" : "Countdown mode";
  countdownPanel.classList.toggle("show", isCountdown);
  resetTimer();
}

function rockAndRoll() {
  // Restart both animations
  timer.classList.remove("flash-end");
  wrapper.classList.remove("shake");
  void timer.offsetWidth;
  timer.classList.add("flash-end");
  wrapper.classList.add("shake");
}

function applyCountdownSettings() {
  const h = parseInt(setHoursInput.value) || 0;
  const m = parseInt(setMinutesInput.value) || 0;
  const s = parseInt(setSecondsInput.value) || 0;

  hours = Math.min(h, 99);
  minutes = Math.min(m, 59);
  seconds = Math.min(s, 59);

  const [secL, secR] = formatTime(seconds);
  const [minL, minR] = formatTime(minutes);
  const [hrL, hrR] = formatTime(hours);

  prevDigits.secL = secL;
  prevDigits.secR = secR;
  prevDigits.minL = minL;
  prevDigits.minR = minR;
  prevDigits.hrL = hrL;
  prevDigits.hrR = hrR;

  drawCurrentDisplay();
}

function lap() {
  if (seconds !== 0 || minutes !== 0 || hours !== 0) {
    const lapTime = timer.textContent;
    const li = document.createElement("li");
    li.textContent = `Lap ${++lapsCount}: ${lapTime}`;
    li.className = "opacity-0 translate-y-2 transition-all duration-500";

    laps.appendChild(li);

    setTimeout(() => {
      li.className = "opacity-100 translate-y-0 transition-all duration-500";
    }, 10);

    playBeep();
  }
}

function playBeep() {
  beep.currentTime = 0;
  beep.play();
}

function rain() {
  rainyDay = new RainyDay({ image: "background" });
}

function cleanupRainCanvases() {
  if (rainyDay) {
    rainyDay.destroy();
    rainyDay = null;
  }
  const rainCanvas =
    document.getElementById("background").previousElementSibling;
  if (rainCanvas) {
    rainCanvas.remove(); // Remove the canvas element
  }

  setBackground();
}

function setBackground() {
  const background = document.getElementById("background");
  if (currentBackgroundUrl) {
    background.style.cssText = `
      background-image: url('${currentBackgroundUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `;
  } else {
    background.style.cssText = `
      background-color: #0f172a;
    `;
  }
}

function runCircularTimer(timerElement, resumeProgress = null) {
  let timeLeft = COUNTDOWN_SECONDS;
  // Initialize timer state
  initCircularTimer();

  if (resumeProgress !== null) {
    // Resume from stored progress
    timerCircle.style.strokeDashoffset = resumeProgress;
    // Adjust timeLeft based on progress
    timeLeft = Math.round(COUNTDOWN_SECONDS * (1 - resumeProgress));
  } else {
    // Start fresh
    const initialProgress = 1 / COUNTDOWN_SECONDS;
    timerCircle.style.strokeDashoffset = initialProgress;
  }

  countdownTimer = setInterval(() => {
    timeLeft--;
    const progress = (COUNTDOWN_SECONDS - timeLeft) / COUNTDOWN_SECONDS;
    timerCircle.style.strokeDashoffset = progress;

    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      timerElement.classList.remove("animatable");
    }
  }, 1000);
}

function getCircularTimerColor(tailwindColor) {
  const colorMap = {
    "text-white": "white",
    "text-yellow-500": "#EAB308",
    "text-blue-500": "rgba(59, 130, 246, 1)",
    "text-red-500": "#EF4444",
  };
  return colorMap[tailwindColor] || "rgba(59, 130, 246, 1)";
}

function initCircularTimer() {
  timerCircle.style.strokeDashoffset = 0;
  timerElement.classList.add("animatable");
}

function toggleElementClasses(element, isAdd) {
  const showClasses = ["opacity-100", "pointer-events-auto", "translate-y-0"];
  const hideClasses = ["opacity-0", "pointer-events-none", "translate-y-4"];

  element.classList[isAdd ? "remove" : "add"](...hideClasses);
  element.classList[isAdd ? "add" : "remove"](...showClasses);
}

function startRain() {
  cleanupRainCanvases();
  setTimeout(() => rain(), 100);
}

function destroyParticles() {
  const particlesContainer = document.getElementById("particles-js");
  if (particlesContainer) {
    particlesContainer.innerHTML = ""; // Clear old particles canvas
  }
}

function removeCards() {
  const recentTimes = document.getElementById("recentTimes");
  const existingCards = Array.from(
    recentTimes.querySelectorAll(`[data-country]`)
  );

  existingCards.forEach((card) => {
    const intervalId = card.dataset.intervalId;
    if (intervalId) {
      clearInterval(intervalId); // 💥 Clear the clock interval
    }
    card.remove();
  });

  recentTimesTitle.classList.add("hidden");
  removeBtn.classList.add("hidden");
  timeFormatElement.classList.remove("flex");
  timeFormatElement.classList.add("hidden"); // Hide time format element
}

// Event Listeners
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);
toggleModeBtn.addEventListener("click", toggleCountdown);
setCountdownBtn.addEventListener("click", applyCountdownSettings);

lapBtn.addEventListener("click", lap);

// Init after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set initial background color
  setBackground();
  drawCurrentDisplay();

  if (currentBackgroundUrl) {
    startRain();
  }
  // Swiper init
  const swiper = new Swiper(".swiper", {
    direction: "vertical",
    mousewheel: false,
    keyboard: {
      enabled: true,
    },
    speed: 800,
    effect: "slide",
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      bulletClass: "swiper-pagination-bullet",
      bulletActiveClass: "swiper-pagination-bullet-active",
      renderBullet: function (index, className) {
        const tooltips = ["Timer", "World Times"];
        return `<span class="${className}" data-tooltip="${tooltips[index]}"></span>`;
      },
    },
    on: {
      slideChange: function () {
        if (this.activeIndex === 0) {
          document.getElementById("globeDiv").style.display = "none";
        } else {
          if (!isGlobeInitialized) {
            // initWorldMap();
            initGlobe(); // Initialize the globe
          }
          document.getElementById("globeDiv").style.display = "block";
        }

        // ✅ Always clean and restart particles
        destroyParticles();
        initParticles();
      },
    },
  });

  // Thumbnail Gallery  init
  thumbnailsContainer.addEventListener("click", (e) => {
    const target = e.target;

    if (target.tagName === "IMG" && target.dataset.bg) {
      const newBg = target.dataset.bg;
      currentBackgroundUrl = newBg; // Store the new background URL
      const background = document.getElementById("background");

      const testImage = new Image();
      testImage.onload = () => {
        background.className = "fixed inset-0 bg-no-repeat bg-cover";
        if (!rainToggle.checked) {
          if (currentBackgroundUrl) {
            startRain();
          }
        } else {
          cleanupRainCanvases();
        }
      };
      testImage.src = `${newBg}?t=${Date.now()}`;
    }
  });

  // Rain toggle logic
  rainToggle.addEventListener("change", () => {
    if (rainToggle.checked) {
      cleanupRainCanvases();
    } else {
      if (currentBackgroundUrl) {
        startRain();
      }
    }
  });

  // Remove cards button
  removeBtn.addEventListener("click", () => {
    removeCards();
  });
  // AM/PM toggle button
  timeFormatToggle.addEventListener("change", () => {
    isAmPmOn = timeFormatToggle.checked;
  });

  infoToggle.addEventListener("click", () => {
    const info = document.getElementById("infoTooltip");
    info.classList.toggle("hidden");
    infoToggle.classList.toggle("info-active");
  });
});
