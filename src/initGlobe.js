// 🌍 Global Times 2.0 - Rotating 3D Globe with Real-Time City Times (async/await version)
import { cities } from "./cities";
import { isAmPmOn } from "./main";
import { fetchAndFormatTime } from "./timeUtils";
//prettier-ignore
const multiZoneCountries = ["United States", "Canada", "Russia", "Brazil", "Australia", "Mexico", "Indonesia", "Kazakhstan"];
const recentTimesTitle = document.getElementById("recentTimesTitle");
const timeFormatElement = document.getElementById("timeFormat");
const removeBtn = document.getElementById("removeCardsBtn");

export let isGlobeInitialized = false;
let hoverTimeout = null;

function initGlobe() {
  if (isGlobeInitialized) return;

  am5.ready(() => {
    const root = am5.Root.new("globeDiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        wheelable: true,
        rotationX: 0,
        rotationY: 0,
      })
    );

    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color("#293e70"),
      fillOpacity: 0.1,
      strokeOpacity: 0,
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color("#293e70"),
      stroke: am5.color("#ffffff"),
      strokeWidth: 0.5,
      tooltipPosition: "pointer",
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#60a5fa"),
    });

    polygonSeries.mapPolygons.template.events.on("pointerover", async (ev) => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(async () => {
        const polygon = ev.target;
        const countryName = polygon.dataItem.dataContext.name;

        if (multiZoneCountries.includes(countryName)) {
          polygon.set(
            "tooltipText",
            `[bold]{name}[/]\nMultiple time zones\nHover over a city to check the time`
          );
          return;
        }

        const center = polygon.geoCentroid();
        if (!center) return;

        const lat = center.latitude;
        const lng = center.longitude;

        const [formatted] = await fetchAndFormatTime(
          lat,
          lng,
          countryName,
          isAmPmOn
        );
        polygon.set("tooltipText", `[bold]{name}[/]\n${formatted}`);
        polygon.showTooltip();
      }, 150);
    });

    polygonSeries.mapPolygons.template.events.on("click", async (ev) => {
      const polygon = ev.target;
      const countryName = polygon.dataItem.dataContext.name;
      const recentTimes = document.getElementById("recentTimes");
      const existingCards = Array.from(
        recentTimes.querySelectorAll(`[data-country]`)
      );

      if (existingCards.some((card) => card.dataset.country === countryName))
        return;
      if (multiZoneCountries.includes(countryName)) return;

      recentTimesTitle.classList.remove("hidden");
      removeBtn.classList.remove("hidden");
      timeFormatElement.classList.remove("hidden");
      timeFormatElement.classList.add("flex");

      const center = polygon.geoCentroid();
      if (!center) return;

      const lat = center.latitude;
      const lng = center.longitude;
      const [formatted, rawDate] = await fetchAndFormatTime(
        lat,
        lng,
        countryName,
        isAmPmOn
      );

      const now = rawDate || new Date();
      const weekday = now.toLocaleDateString("en-US", { weekday: "long" });

      const card = document.createElement("div");
      card.className =
        "bg-opacity-20 backdrop-blur-md rounded-md p-3 text-[#ffffff] bg-[#293e70] border-2 border-white shadow-lg min-w-[160px] 3xl:min-w-[200px] max-w-[160px] 3xl:max-w-[200px]";
      card.dataset.country = countryName;
      card.innerHTML = `
        <h3 class="text-lg 3xl:text-2xl mb-2 font-bold text-[#ffcc00]">${countryName}</h3>
        <p class="text-sm 3xl:text-lg font-sans">${now.toLocaleDateString(
          "en-US",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )}</p>
        <p class="text-sm 3xl:text-lg live-clock font-sans">${now.toLocaleTimeString()}</p>
        <p class="text-sm 3xl:text-lg font-sans">${weekday}</p>
      `;

      recentTimes.appendChild(card);

      const liveClock = card.querySelector(".live-clock");
      let currentTime = new Date(now);
      let currentSeconds = new Date().getSeconds();
      currentTime.setSeconds(currentSeconds);
      const intervalId = setInterval(() => {
        currentTime.setSeconds(currentTime.getSeconds() + 1);
        liveClock.textContent = isAmPmOn
          ? currentTime.toLocaleTimeString("en-US", { hour12: true })
          : currentTime.toLocaleTimeString();
      }, 1000);

      card.dataset.intervalId = intervalId;
    });

    const circleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
        tooltipText: "{city}",
      })
    );

    circleSeries.bullets.push((root, series, dataItem) => {
      const circle = am5.Circle.new(root, {
        radius: 5,
        fill: am5.color("#ffcc00"),
        cursorOverStyle: "pointer",
        tooltipText: "Loading...",
        tooltipPosition: "pointer",
      });

      circle.events.on("pointerover", async () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(async () => {
          const { city, country, latitude, longitude } = dataItem.dataContext;
          const [formatted] = await fetchAndFormatTime(
            latitude,
            longitude,
            city,
            isAmPmOn
          );
          circle.set(
            "tooltipText",
            `[bold]${city}[/]\n(${country})[/]\n${formatted}`
          );
          circle.showTooltip();
        }, 200);
      });

      return am5.Bullet.new(root, { sprite: circle });
    });

    circleSeries.data.setAll(cities.slice(0, 100));

    const globeRotation = chart.animate({
      key: "rotationX",
      to: 360,
      duration: 50000,
      loops: Infinity,
    });
    setTimeout(() => globeRotation.stop(), 180000);

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    chart.appear(1000, 100);
  });

  isGlobeInitialized = true;
}

export default initGlobe;
