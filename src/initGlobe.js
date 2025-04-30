// Global Times 2.0 - Rotating 3D Globe with Real-Time City Times
import { cities } from "./cities";
import { isAmPmOn } from "./main";

export let isGlobeInitialized = false; // Changed to export
//prettier-ignore
const multiZoneCountries = ["United States", "Canada", "Russia", "Brazil", "Australia", "Mexico", "Indonesia", "Kazakhstan"];
const recentTimesTitle = document.getElementById("recentTimesTitle");
const timeFormatElement = document.getElementById("timeFormat");
const removeBtn = document.getElementById("removeCardsBtn");

function initGlobe() {
  if (isGlobeInitialized) return;

  am5.ready(function () {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("globeDiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    var chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        wheelable: true, // ✅ allow mouse wheel zoom
        rotationX: 0,
        rotationY: 0,
      })
    );

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    var backgroundSeries = chart.series.push(
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

    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    var polygonSeries = chart.series.push(
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
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#60a5fa"),
    });

    //Get times on hover over countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Tooltips
    polygonSeries.mapPolygons.template.events.on("pointerover", (ev) => {
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

      fetch(
        `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=j_sully`
      )
        .then((res) => res.json())
        .then((data) => {
          const raw = data.time;
          let now;

          if (raw) {
            now = new Date(raw);
          } else if (data.gmtOffset !== undefined) {
            now = new Date(
              Date.now() +
                (data.gmtOffset * 60 + new Date().getTimezoneOffset()) * 60000
            );
          }

          if (!now || isNaN(now.getTime())) {
            console.warn("Invalid date from GeoNames:", data);
            polygon.set("tooltipText", `[bold]{name}[/]\nTime unavailable`);
            return;
          }
          const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
          const formatted = `${now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}\n${now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: isAmPmOn ? true : false,
          })}\n${weekday}`;
          polygon.set("tooltipText", `[bold]{name}[/]\n${formatted}`);
          polygon.showTooltip();
        })
        .catch((err) => {
          console.error("GeoNames error:", err);
          polygon.set("tooltipText", `[bold]{name}[/]\nTime unavailable`);
          polygon.showTooltip();
        });
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

      if (multiZoneCountries.includes(countryName)) {
        polygon.set("tooltipText", `[bold]{name}[/]`);
        return;
      }

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

    // Create polygon series for projected circles
    const circleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
        tooltipText: "{city}", // Set default tooltip
      })
    );

    // Set the data first
    circleSeries.data.setAll(cities);

    // BULLETS (CIRCLES)
    circleSeries.bullets.push((root, series, dataItem) => {
      // Added series parameter
      const circle = am5.Circle.new(root, {
        radius: 5,
        fill: am5.color("#ffcc00"),
        cursorOverStyle: "pointer",
        tooltipText: "Loading...",
        tooltipPosition: "pointer",
      });

      circle.events.on("pointerover", () => {
        const cityData = dataItem.dataContext;

        if (!cityData || !cityData.city) {
          console.warn("Invalid city data:", cityData);
          return;
        }

        const { city, latitude, longitude } = cityData;

        fetch(
          `https://secure.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=j_sully`
        )
          .then((res) => {
            if (!res.ok) throw new Error("GeoNames API error");
            return res.json();
          })
          .then((data) => {
            const now = new Date(data.time);
            const formatted = `${city}\n${now.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}\n${now.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: isAmPmOn ? true : false,
            })}`;
            circle.set("tooltipText", formatted);
            circle.showTooltip(); // ✅ force display
          })
          .catch((err) => {
            console.error("GeoNames error:", err);
            circle.set("tooltipText", `${city}\nTime unavailable`);
            circle.showTooltip();
          });
      });

      return am5.Bullet.new(root, { sprite: circle });
    });

    // Make sure to setAll data AFTER defining bullets
    circleSeries.data.setAll(cities);

    // Auto rotate the globe
    chart.animate({
      key: "rotationX",
      to: 360,
      duration: 50000,
      loops: Infinity,
    });

    // Zoom controls
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    // Make stuff animate on load
    chart.appear(1000, 100);
  });

  isGlobeInitialized = true; // Set the flag to true
}

export default initGlobe;
