// Grab elements
const display = document.getElementById("display");
const colorSelector = document.getElementById("colorSelector");
const laps = document.getElementById("laps");
const beep = document.getElementById("beep");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const buttons = document.querySelectorAll("button");
const modeToggle = document.getElementById("modeToggle");
const countdownPanel = document.getElementById("countdownPanel");
const hourSlider = document.getElementById("hourSlider");
const minuteSlider = document.getElementById("minuteSlider");
const secondSlider = document.getElementById("secondSlider");

// Variables
let [seconds, minutes, hours] = [0, 0, 0];
let timer = null;
let lapsCount = 0;
let isCountdown = false;

// Functions
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
    stopTime();
    display.textContent = "Time is up!";
    display.style.fontSize = "48px";
    display.style.fontWeight = "600";
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
    );
    audio.play();
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
  if (timer !== null) clearInterval(timer);
  if (isCountdown) {
    disableCountdownPanel();
    timer = setInterval(countdown, 1000);
  } else {
    timer = setInterval(stopwatch, 1000);
  }
}

function stopTime() {
  playBeep();
  clearInterval(timer);
}

function reset() {
  playBeep();
  clearInterval(timer);
  [seconds, minutes, hours, lapsCount] = [0, 0, 0, 0];
  laps.innerHTML = "";
  updateDisplay();
  if (isCountdown) enableCountdownPanel();
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
  var rainyDay = new RainyDay({ image: "background" });
}

function cleanupRainCanvases() {
  const rainCanvases = document.querySelectorAll("canvas");
  rainCanvases.forEach((canvas) => canvas.remove());
}

function startRain() {
  cleanupRainCanvases();
  setTimeout(() => rain(), 100);
}

function disableCountdownPanel() {
  countdownPanel.classList.add("opacity-50", "pointer-events-none");
  hourSlider.disabled = true;
  minuteSlider.disabled = true;
  secondSlider.disabled = true;
}

function enableCountdownPanel() {
  countdownPanel.classList.remove("opacity-50", "pointer-events-none");
  hourSlider.disabled = false;
  minuteSlider.disabled = false;
  secondSlider.disabled = false;
  hourSlider.value = 1;
  minuteSlider.value = 1;
  secondSlider.value = 1;
}

// Event Listeners
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stopTime);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);

// Init after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  colorSelector.addEventListener("change", (e) => {
    const colorClasses = [
      "text-black",
      "text-white",
      "text-yellow-500",
      "text-blue-500",
      "text-red-500",
    ];
    let activeColor = e.target.value;

    display.classList.remove(...colorClasses);
    display.classList.add(activeColor);

    laps.classList.remove(...colorClasses);
    laps.classList.add(activeColor);

    buttons.forEach((b) => {
      b.classList.remove(...colorClasses);
      b.classList.add(activeColor);
    });
  });

  const thumbnailsContainer = document.querySelector(".fixed.bottom-4.left-4");
  if (thumbnailsContainer) {
    thumbnailsContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.tagName === "IMG" && target.dataset.bg) {
        const newBg = target.dataset.bg;
        const background = document.getElementById("background");

        const testImage = new Image();
        testImage.onload = () => {
          background.className = "fixed inset-0 bg-no-repeat bg-cover";
          background.style.cssText = `
            background-image: url('${newBg}');
            z-index: 100;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
          `;
          startRain();
        };
        testImage.src = `${newBg}?t=${Date.now()}`;
      }
    });
  }
  startRain();

  // Mode toggle logic
  modeToggle.addEventListener("change", () => {
    isCountdown = modeToggle.checked;
    if (isCountdown) {
      countdownPanel.classList.remove(
        "opacity-0",
        "pointer-events-none",
        "translate-y-4"
      );
      countdownPanel.classList.add(
        "opacity-100",
        "pointer-events-auto",
        "translate-y-0"
      );
      lapBtn.classList.add("hidden");
    } else {
      countdownPanel.classList.remove(
        "opacity-100",
        "pointer-events-auto",
        "translate-y-0"
      );
      countdownPanel.classList.add(
        "opacity-0",
        "pointer-events-none",
        "translate-y-4"
      );
      lapBtn.classList.remove("hidden");
    }
  });

  // Slider bindings
  hourSlider.addEventListener("input", () => {
    hours = parseInt(hourSlider.value);
    updateDisplay();
  });

  minuteSlider.addEventListener("input", () => {
    minutes = parseInt(minuteSlider.value);
    updateDisplay();
  });

  secondSlider.addEventListener("input", () => {
    seconds = parseInt(secondSlider.value);
    updateDisplay();
  });
});
