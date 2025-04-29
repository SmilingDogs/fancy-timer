// Grab elements
import * as am5 from "@amcharts/amcharts5";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import * as am5map from "@amcharts/amcharts5/map";

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
const timeFormatToggle = document.getElementById("timeFormatToggle");
const timeFormatElement = document.getElementById("timeFormat");
// Variables
let [seconds, minutes, hours] = [0, 0, 0];
let timer = null;
let lapsCount = 0;
let isCountdown = false;
let rainyDay = null; // store rainyDay instance globally
let currentBackgroundUrl = "src/assets/desert.jpg"; // store current background globally
let worldMapRoot = null; //store world map root element globally
let isWorldMapInitialized = false; // flag to check if world map is initialized
let isAmPmOn = false; // flag to check if AM/PM format is on

// Functions
function initParticles() {
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
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
            enable: true,
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
    display.textContent = "Time is up!";
    display.classList.add("text-[48px]", "font-semibold");
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
  display.classList.remove("text-[48px]", "font-semibold");
  display.textContent = "00:00:00";
  startBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");
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

  // Restore the background image
  const background = document.getElementById("background");
  background.style.cssText = `
    background-image: url('${currentBackgroundUrl}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;
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

function initWorldMap() {
  if (isWorldMapInitialized) return;

  worldMapRoot = am5.Root.new("worldMap");

  worldMapRoot.setThemes([am5.Theme.new(worldMapRoot)]);

  let chart = worldMapRoot.container.children.push(
    am5map.MapChart.new(worldMapRoot, {
      panX: "rotateX",
      panY: "none",
      projection: am5map.geoMercator(),
      wheelable: true,
    })
  );

  let polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(worldMapRoot, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"], // Exclude Antarctica
    })
  );

  window.worldPolygonSeries = polygonSeries;

  polygonSeries.mapPolygons.template.setAll({
    tooltipText: "[bold]{name}[/]\n{localTime}",
    interactive: true,
    fill: am5.color(0x0f172a),
    tooltipPosition: "pointer", // Add this!
    hoverTooltipEnabled: false, // Add this!
  });

  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0x60a5fa),
  });

  // polygonSeries.mapPolygons.template.set(
  //   "tooltipText",
  //   "[bold]{name}[/]\n{localTime}"
  // );
  // Pointerover tooltip with live data
  polygonSeries.mapPolygons.template.events.on("pointerover", (ev) => {
    const polygon = ev.target;
    const countryName = polygon.dataItem.dataContext.name;
    const center = polygon.geoCentroid(); // 📍 Get country's center lat/lng

    if (center) {
      const lat = center.latitude;
      const lng = center.longitude;

      fetch(
        `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=YOUR_USERNAME`
      )
        .then((res) => res.json())
        .then((data) => {
          const serverNow = new Date(data.time);
          const localNow = new Date();
          serverNow.setSeconds(localNow.getSeconds()); // Inject real seconds into server time

          const weekday = serverNow.toLocaleDateString("en-US", {
            weekday: "long",
          });

          // Set formatted local time inside polygon data
          polygon.dataItem.set(
            "localTime",
            `
  ${weekday}
  ${serverNow.toLocaleDateString()}
  ${serverNow.toLocaleTimeString()}
            `
          );

          // 🧹 Properly show tooltip
          polygon.hideTooltip(); // Hide old tooltip if exists
          polygon.showTooltip(); // Show updated tooltip

          // 🎨 Force your custom tooltip styles every time!
          const tooltip = polygon.get("tooltip");
          if (tooltip) {
            tooltip.get("background").setAll({
              fill: am5.color(0x0f172a), // Dark navy background
              fillOpacity: 1,
              stroke: am5.color(0xffffff), // White border
              strokeOpacity: 1,
              cornerRadius: 8, // Rounded corners
            });
          }
        })
        .catch((err) => {
          console.error("GeoNames API error:", err);
          polygon.dataItem.set("localTime", "Time unavailable");

          polygon.hideTooltip();
          polygon.showTooltip();

          // Apply styles even in error case to avoid ugly default
          // const tooltip = polygon.get("tooltip");
          // if (tooltip) {
          //   tooltip.get("background").setAll({
          //     fill: am5.color(0x0f172a),
          //     fillOpacity: 1,
          //     stroke: am5.color(0xffffff),
          //     strokeOpacity: 1,
          //     cornerRadius: 8,
          //   });
          // }
        });
    }
  });

  // 🧹 Clean up tooltip when mouse leaves
  polygonSeries.mapPolygons.template.events.on("pointerout", (ev) => {
    const polygon = ev.target;
    if (polygon) {
      polygon.hideTooltip(); // 💥 Force tooltip to hide
    }
  });

  polygonSeries.mapPolygons.template.events.on("click", (ev) => {
    const polygon = ev.target;
    const countryName = polygon.dataItem.dataContext.name;
    const recentTimes = document.getElementById("recentTimes");
    const existingCards = Array.from(
      recentTimes.querySelectorAll(`[data-country]`)
    );
    const isSuchCard = existingCards.some(
      (card) => card.dataset.country === countryName
    );
    if (isSuchCard) return; // If such card exists, do nothing

    recentTimesTitle.classList.remove("hidden");
    removeBtn.classList.remove("hidden");
    timeFormatElement.classList.remove("hidden");
    timeFormatElement.classList.add("flex");

    const center = polygon.geoCentroid();

    if (center) {
      const lat = center.latitude;
      const lng = center.longitude;

      fetch(
        `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=j_sully`
      )
        .then((res) => res.json())
        .then((data) => {
          const serverNow = new Date(data.time);
          const localNow = new Date();
          serverNow.setSeconds(localNow.getSeconds()); // Inject real seconds

          //prettier-ignore
          const weekday = serverNow.toLocaleDateString("en-US", {weekday: "long"});
          const recentTimes = document.getElementById("recentTimes");
          const card = document.createElement("div");
          card.className =
            "bg-white bg-opacity-20 backdrop-blur-md rounded-md p-3 text-[#0f172a] shadow-lg xl:min-w-[190px] min-w-[160px] xl:max-w-[190px] max-w-[160px]";
          card.dataset.country = countryName;
          card.innerHTML = `
          <h3 class="font-bold text-lg mb-2">${data.countryName}</h3>
          <p class="text-sm">${serverNow.toLocaleDateString()}</p>
          <p class="text-sm live-clock">${serverNow.toLocaleTimeString()}</p>
          <p class="text-sm">${weekday}</p>
        `;

          recentTimes.appendChild(card);

          // Function to update the live clock every second
          const liveClock = card.querySelector(".live-clock");
          let currentTime = new Date(serverNow); // full time with fixed seconds
          const intervalId = setInterval(() => {
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            liveClock.textContent = isAmPmOn
              ? currentTime.toLocaleTimeString("en-US", { hour12: true })
              : currentTime.toLocaleTimeString();
          }, 1000);

          card.dataset.intervalId = intervalId; // 💥 Save interval ID inside the card
        })
        .catch((err) => {
          console.error("GeoNames API error:", err);
        });
    }
  });
  // Adding city markers
  const pointSeries = chart.series.push(
    am5map.MapPointSeries.new(worldMapRoot, {})
  );

  // ✅ Tell amCharts which data fields to use
  pointSeries.setAll({
    latitudeField: "latitude",
    longitudeField: "longitude",
  });

  pointSeries.bullets.push((root, dataItem) => {
    const marker = am5.Circle.new(root, {
      radius: 5,
      fill: am5.color(0xffcc00),
      tooltipText: "{city}",
      cursorOverStyle: "pointer",
    });

    marker.events.on("click", () => {
      const { city, country, latitude, longitude } = dataItem.dataContext;

      fetch(
        `https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=j_sully`
      )
        .then((res) => res.json())
        .then((data) => {
          const serverNow = new Date(data.time);
          const localNow = new Date();
          serverNow.setSeconds(localNow.getSeconds());

          const weekday = serverNow.toLocaleDateString("en-US", {
            weekday: "long",
          });

          const card = document.createElement("div");
          card.className =
            "bg-white bg-opacity-20 backdrop-blur-md rounded-md p-3 text-[#0f172a] shadow-lg xl:min-w-[190px] min-w-[160px] xl:max-w-[190px] max-w-[160px]";
          card.dataset.country = country;
          card.innerHTML = `
          <h3 class="font-bold text-lg mb-2">${country} - ${city}</h3>
          <p class="text-sm">${serverNow.toLocaleDateString()}</p>
          <p class="text-sm live-clock">${serverNow.toLocaleTimeString()}</p>
          <p class="text-sm">${weekday}</p>
          `;

          const recentTimes = document.getElementById("recentTimes");
          recentTimes.appendChild(card);

          const liveClock = card.querySelector(".live-clock");
          let currentTime = new Date(serverNow);
          const intervalId = setInterval(() => {
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            liveClock.textContent = isAmPmOn
              ? currentTime.toLocaleTimeString("en-US", { hour12: true })
              : currentTime.toLocaleTimeString();
          }, 1000);

          card.dataset.intervalId = intervalId;
        })
        .catch((err) => {
          console.error("GeoNames API error:", err);
        });
    });

    return am5.Bullet.new(root, { sprite: marker });
  });

  // Populate city points
  cityCoordinates.forEach(({ city, lat, lng, country }) => {
    pointSeries.data.push({
      latitude: lat,
      longitude: lng,
      city,
      country,
    });
  });

  chart.set("zoomControl", am5map.ZoomControl.new(worldMapRoot, {}));

  isWorldMapInitialized = true; // Set the flag to true
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
  initParticles(); // 💥 move here, initialize ONCE when page loads
  startRain(); // Start rain effect
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
      renderBullet: function (index, className) {
        const tooltips = ["Timer", "Global Time"];
        return `<span class="${className}" data-tooltip="${tooltips[index]}"></span>`;
      },
    },
    on: {
      slideChange: function () {
        if (this.activeIndex === 0) {
          setTimeout(() => {
            thumbnailsContainer.style.display = "flex";
          }, 800);
          document.getElementById("worldMap").style.display = "none";
        } else {
          thumbnailsContainer.style.display = "none";

          if (!isWorldMapInitialized) {
            initWorldMap();
          }
          document.getElementById("worldMap").style.display = "block";
        }

        // ✅ Always clean and restart particles AFTER
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
          startRain();
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
        "opacity-50",
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
  // Rain toggle logic
  rainToggle.addEventListener("change", () => {
    if (rainToggle.checked) {
      cleanupRainCanvases();
    } else {
      startRain();
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
  // Remove cards button
  removeBtn.addEventListener("click", () => {
    removeCards();
  });
  // AM/PM toggle button
  timeFormatToggle.addEventListener("change", () => {
    isAmPmOn = timeFormatToggle.checked;
  });
});
