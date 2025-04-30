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

// ✅ ASYNC VERSION
//prettier-ignore
// This function fetches the current time for a given latitude and longitude using the GeoNames API.
export async function fetchAndFormatTime(lat, lng, label, isCountry, isAmPm) {
  const cached = getCachedTime(lat, lng);
  //if the data is already cached and not expired, return it
  if (cached) return cached;

  try {
    //prettier-ignore
    const res = await fetch(`https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=j_sully`);
    const data = await res.json();

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
      return `${label}\nTime unavailable`;
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
          hour12: isAmPm,
        })}`;

    setCachedTime(lat, lng, [formatted, now]);
    return [formatted, now];
  } catch (err) {
    return [`${label}\nTime unavailable`, null];
  }
}
