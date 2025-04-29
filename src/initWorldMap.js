import * as am5 from "@amcharts/amcharts5";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import * as am5map from "@amcharts/amcharts5/map";

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

export default initWorldMap;
