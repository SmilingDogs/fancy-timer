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

// Variables
let [seconds, minutes, hours] = [0, 0, 0];
let timer = null;

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

function start() {
  playBeep();
  if (timer !== null) clearInterval(timer);
  timer = setInterval(stopwatch, 1000);
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
}

let lapsCount = 0;

function lap() {
  if (seconds !== 0 || minutes !== 0 || hours !== 0) {
    const lapTime = display.textContent;
    const li = document.createElement("li");
    li.textContent = `Lap ${++lapsCount}: ${lapTime}`;
    li.className = "opacity-0 translate-y-2 transition-all duration-500";

    laps.appendChild(li);

    // Animate in
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

// Event Listeners
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stopTime);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);

function rain() {
  var rainyDay = new RainyDay({
    image: "background",
  });
}

function cleanupRainCanvases() {
  const rainCanvases = document.querySelectorAll("canvas");
  rainCanvases.forEach((canvas) => canvas.remove());
}

function startRain() {
  cleanupRainCanvases();

  setTimeout(() => {
    rain();
  }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
  colorSelector.addEventListener("change", (e) => {
    //prettier-ignore
    const colorClasses = ["text-black", "text-white", "text-yellow-500", "text-blue-500", "text-red-500"]

    display.classList.remove(...colorClasses);
    display.classList.add(e.target.value);
    laps.classList.remove(...colorClasses);
    laps.classList.add(e.target.value);

    buttons.forEach((b) => {
      b.classList.remove(...colorClasses);
    });
    buttons.forEach((b) => {
      b.classList.add(e.target.value);
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
});
