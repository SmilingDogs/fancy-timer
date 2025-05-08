const timeCache = new Map();

function getCachedTime(lat, lng) {
  const key = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const entry = timeCache.get(key);
  if (!entry || Date.now() > entry.expiry) return null;
  return entry.data;
}

function setCachedTime(lat, lng, data) {
  const key = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const expiry = Date.now() + (60 - new Date().getSeconds()) * 1000; // Cache until next minute
  timeCache.set(key, { data, expiry });
}

// This function fetches the current time for a given latitude and longitude using the GeoNames API.
export async function fetchAndFormatTime(lat, lng, label, isAmPm) {
  const cached = getCachedTime(lat, lng);
  //if the data is already cached and not expired, return it
  if (cached) return cached;

  try {
    //prettier-ignore
    const res = await fetch(`https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=j_sully`);
    const data = await res.json();

    let now = null;
    if (data.time) {
      now = new Date(data.time);
    } else if (data.gmtOffset) {
      //prettier-ignore
      now = new Date(Date.now() + (data.gmtOffset * 60 + new Date().getTimezoneOffset()) * 60000);
    }

    if (!now || isNaN(now.getTime())) {
      return `${label}\nTime unavailable`;
    }

    function getFormattedDateTime(format) {
      return `${now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}\n${now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: format,
      })}\n${now.toLocaleDateString("en-US", { weekday: "long" })}`;
    }

    let formatted = getFormattedDateTime(isAmPm);
    //save the time in cache for the next minute
    setCachedTime(lat, lng, [formatted, now]);

    return [formatted, now];
  } catch (err) {
    return [`${label}\nTime unavailable`, null];
  }
}
