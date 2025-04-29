// Global Times 2.0 - Rotating 3D Globe with Real-Time City Times
import { cities } from "./cities";

export let isGlobeInitialized = false; // Changed to export

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

    // Create polygon series for projected circles
    const circleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
      })
    );

    // BULLETS (CIRCLES)
    circleSeries.bullets.push((root, dataItem) => {
      const circle = am5.Circle.new(root, {
        radius: 5, // Set default fixed radius instead of using dataItem
        fill: am5.color("#ffcc00"),
        tooltipText: "{city}",
        cursorOverStyle: "pointer",
      });
      return am5.Bullet.new(root, { sprite: circle });
    });

    // Add cities to the series
    cities.forEach((city) => {
      circleSeries.data.push(city);
    });

    // Auto rotate the globe
    chart.animate({
      key: "rotationX",
      to: 360,
      duration: 60000,
      loops: Infinity,
    });

    // Create circles when data for countries is fully loaded.
    // polygonSeries.events.on("datavalidated", function () {
    //   circleSeries.data.clear();

    //   for (var i = 0; i < data.length; i++) {
    //     var dataContext = data[i];
    //     var countryDataItem = polygonSeries.getDataItemById(dataContext.id);
    //     var countryPolygon = countryDataItem.get("mapPolygon");

    //     var value = dataContext.value;

    //     var radius =
    //       minRadius + (maxRadius * (value - valueLow)) / (valueHigh - valueLow);

    //     if (countryPolygon) {
    //       var geometry = am5map.getGeoCircle(
    //         countryPolygon.visualCentroid(),
    //         radius
    //       );
    //       circleSeries.data.push({
    //         name: dataContext.name,
    //         value: dataContext.value,
    //         polygonTemplate: dataContext.polygonTemplate,
    //         geometry: geometry,
    //       });
    //     }
    //   }
    // });
    // Zoom controls
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    // Make stuff animate on load
    chart.appear(1000, 100);
  });

  isGlobeInitialized = true; // Set the flag to true
}

export default initGlobe;
