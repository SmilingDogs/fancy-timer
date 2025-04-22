// Grab elements
const display = document.getElementById("display");
const laps = document.getElementById("laps");
const beep = document.getElementById("beep");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

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
  if (timer !== null) clearInterval(timer);
  timer = setInterval(stopwatch, 1000);
  playBeep();
}

function stopTime() {
  clearInterval(timer);
  playBeep();
}

function reset() {
  clearInterval(timer);
  [seconds, minutes, hours, lapsCount] = [0, 0, 0, 0];
  laps.innerHTML = "";
  updateDisplay();
  playBeep();
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
