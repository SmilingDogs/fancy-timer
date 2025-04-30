// Utility functions for fetching and caching local time info from GeoNames

const timeCache = new Map();

export function getCachedTime(lat, lng) {
  const key = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const entry = timeCache.get(key);
  if (!entry || Date.now() > entry.expiry) return null;
  return entry.data;
}

export function setCachedTime(lat, lng, data) {
  const key = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const expiry = Date.now() + (60 - new Date().getSeconds()) * 1000; // Cache until next minute
  timeCache.set(key, { data, expiry });
}

export function fetchAndFormatTime(
  lat,
  lng,
  label,
  isCountry = false,
  isAmPm = true,
  onResult
) {
  const cached = getCachedTime(lat, lng);
  if (cached) {
    onResult(cached);
    return;
  }

  fetch(
    `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=j_sully`
  )
    .then((res) => res.json())
    .then((data) => {
      let now;
      if (data.time) {
        now = new Date(data.time);
      } else if (data.gmtOffset !== undefined) {
        now = new Date(
          Date.now() +
            (data.gmtOffset * 60 + new Date().getTimezoneOffset()) * 60000
        );
      }

      if (!now || isNaN(now.getTime())) {
        onResult(`${label}\nTime unavailable`);
        return;
      }

      const formatted = isCountry
        ? `${now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}\n${now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: isAmPm,
          })}\n${now.toLocaleDateString("en-US", { weekday: "long" })}`
        : `${label}\n${now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}\n${now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`;

      setCachedTime(lat, lng, formatted);
      onResult(formatted);
    })
    .catch(() => onResult(`${label}\nTime unavailable`));
}
