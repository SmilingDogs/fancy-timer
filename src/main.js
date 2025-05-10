// Grab elements
// import initWorldMap from "./initWorldMap";
import initGlobe, { isGlobeInitialized } from "./initGlobe"; // Add import
const display = document.getElementById("display");
const colorSelector = document.getElementById("colorSelector");
const laps = document.getElementById("laps");
const beep = document.getElementById("beep");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const removeBtn = document.getElementById("removeCardsBtn");
const thumbnailsContainer = document.getElementById("thumbnailsContainer");
const timerControls = document.querySelector(".timer-controls");
const modeToggle = document.getElementById("modeToggle");
const rainToggle = document.getElementById("rainToggle");
const countdownPanel = document.getElementById("countdownPanel");
const hourSlider = document.getElementById("hourSlider");
const minuteSlider = document.getElementById("minuteSlider");
const secondSlider = document.getElementById("secondSlider");
const recentTimesTitle = document.getElementById("recentTimesTitle");
const timeFormatElement = document.getElementById("timeFormat");
const timeFormatToggle = document.getElementById("timeFormatToggle");
const infoToggle = document.getElementById("infoToggle");
const timerElement = document.querySelector(".circular-timer");
const timerCircle = timerElement.querySelector("[data-circle]");
// Variables
let [seconds, minutes, hours] = [0, 0, 0];
let timer = null;
let countdownTimer = null;
let lapsCount = 0;
let isCountdown = false;
let rainyDay = null; // store rainyDay instance globally
let currentBackgroundUrl = null; // store current background globally
export let isAmPmOn = false; // flag to check if AM/PM format is on
let particleTimeout = null; // store timeout for particles
let COUNTDOWN_SECONDS = null; // Change this value to set desired countdown time
let storedProgress = null; // Add this with other variables at the top

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
function updateDisplay() {
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  const s = seconds.toString().padStart(2, "0");
  display.textContent = `${h}:${m}:${s}`;
}

function stopwatch() {
  seconds++;
  if (seconds === 60) {
    seconds = 0;
    minutes++;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }
  updateDisplay();
}

function countdown() {
  if (hours === 0 && minutes === 0 && seconds === 0) {
    clearInterval(timer);
    // display.textContent = "Time is up!";
    // display.classList.add("text-[50px]", "3xl:text-[70px]", "font-semibold");
    const no = document.getElementById("no");
    no.classList.remove("hidden");
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
    );
    audio.play();
    startBtn.classList.add("hidden");
    stopBtn.classList.add("hidden");
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
  updateDisplay();
}

function start() {
  playBeep();
  startBtn.classList.add("hidden");
  if (timer !== null) clearInterval(timer);
  if (countdownTimer !== null) clearInterval(countdownTimer);
  if (isCountdown) {
    disableCountdownPanel();
    toggleElementClasses(countdownPanel, false);
    // Pass stored progress when resuming
    runCircularTimer(timerElement, storedProgress);
    timer = setInterval(countdown, 1000);
  } else {
    timer = setInterval(stopwatch, 1000);
  }
}

function stopTime() {
  playBeep();
  clearInterval(timer);
  clearInterval(countdownTimer);
  // Store current progress when stopping
  if (isCountdown) {
    storedProgress = timerCircle.style.strokeDashoffset;
  }
  startBtn.classList.remove("hidden");
}

function reset() {
  playBeep();
  clearInterval(timer);
  clearInterval(countdownTimer);
  storedProgress = null; // Reset stored progress
  COUNTDOWN_SECONDS = null;
  timerCircle.style.strokeDashoffset = 1;
  [seconds, minutes, hours, lapsCount] = [0, 0, 0, 0];
  const no = document.getElementById("no");
  no.classList.add("hidden");
  laps.innerHTML = "";
  display.classList.remove("text-[50px]", "3xl:text-[70px]", "font-semibold");
  display.textContent = "00:00:00";
  startBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");
  updateDisplay();
  if (isCountdown) {
    enableCountdownPanel();
    toggleElementClasses(countdownPanel, true);
  }
}

function lap() {
  if (seconds !== 0 || minutes !== 0 || hours !== 0) {
    const lapTime = display.textContent;
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

function animateBorder() {
  const card = document.querySelector(".timer-container");
  let angle = 0;
  let animationId = null;
  // Add speed control - smaller number = slower rotation
  const rotationSpeed = 0.25; // Change this value to adjust speed (default was 1)

  function updateGradient() {
    const gradientStyle = `conic-gradient(from ${angle}deg, blue, red, blue)`;
    card.style.setProperty("--gradient", gradientStyle);
    // Use rotationSpeed to increment angle more slowly
    angle = (angle + rotationSpeed) % 360;
    animationId = requestAnimationFrame(updateGradient);
  }

  return {
    start: () => {
      if (!animationId) {
        updateGradient();
      }
    },
    stop: () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
  };
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

function disableCountdownPanel() {
  countdownPanel.classList.add("pointer-events-none");
  hourSlider.disabled = true;
  minuteSlider.disabled = true;
  secondSlider.disabled = true;
}

function enableCountdownPanel() {
  countdownPanel.classList.remove("pointer-events-none");
  hourSlider.disabled = false;
  minuteSlider.disabled = false;
  secondSlider.disabled = false;
  hourSlider.value = 1;
  minuteSlider.value = 1;
  secondSlider.value = 1;
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
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stopTime);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);

// Init after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set initial background color
  setBackground();
  const borderAnimation = animateBorder();
  borderAnimation.start();

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
  // Colors selector init
  colorSelector.addEventListener("change", (e) => {
    //prettier-ignore
    const colorClasses = ["text-black", "text-white", "text-yellow-500", "text-blue-500", "text-red-500"];
    let activeColor = e.target.value;

    display.classList.remove(...colorClasses);
    display.classList.add(activeColor);

    laps.classList.remove(...colorClasses);
    laps.classList.add(activeColor);

    timerCircle.style.stroke = getCircularTimerColor(activeColor);

    Array.from(timerControls.querySelectorAll("button")).forEach((b) => {
      b.classList.remove(...colorClasses);
      b.classList.add(activeColor);
    });
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

  // Mode toggle logic
  modeToggle.addEventListener("change", () => {
    isCountdown = modeToggle.checked;
    toggleElementClasses(timerElement, isCountdown);
    toggleElementClasses(countdownPanel, isCountdown);

    if (isCountdown) {
      lapBtn.classList.add("hidden");
    } else {
      countdownPanel.classList.remove("opacity-50");
      lapBtn.classList.remove("hidden");
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

  // Slider bindings
  hourSlider.addEventListener("input", () => {
    hours = parseInt(hourSlider.value);
    updateDisplay();
    COUNTDOWN_SECONDS = seconds + minutes * 60 + hours * 3600;
    initCircularTimer();
  });

  minuteSlider.addEventListener("input", () => {
    minutes = parseInt(minuteSlider.value);
    updateDisplay();
    COUNTDOWN_SECONDS = seconds + minutes * 60;
    initCircularTimer();
  });

  secondSlider.addEventListener("input", () => {
    seconds = parseInt(secondSlider.value);
    updateDisplay();
    COUNTDOWN_SECONDS = seconds;
    initCircularTimer();
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
