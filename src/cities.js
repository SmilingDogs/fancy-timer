export const cities = [
  // United States (6 time zones)
  { city: "New York", latitude: 40.7128, longitude: -74.006 }, // Eastern
  { city: "Miami", latitude: 25.7617, longitude: -80.1918 },
  { city: "Chicago", latitude: 41.8781, longitude: -87.6298 }, // Central
  { city: "Houston", latitude: 29.7604, longitude: -95.3698 },
  { city: "Denver", latitude: 39.7392, longitude: -104.9903 }, // Mountain
  { city: "Phoenix", latitude: 33.4484, longitude: -112.074 },
  { city: "Los Angeles", latitude: 34.0522, longitude: -118.2437 }, // Pacific
  { city: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
  { city: "Anchorage", latitude: 61.2181, longitude: -149.9003 }, // Alaska
  { city: "Fairbanks", latitude: 64.8378, longitude: -147.7164 },
  { city: "Honolulu", latitude: 21.3069, longitude: -157.8583 }, // Hawaii
  { city: "Hilo", latitude: 19.7077, longitude: -155.0885 },

  // Canada (6 time zones)
  { city: "Toronto", latitude: 43.65107, longitude: -79.347015 }, // Eastern
  { city: "Ottawa", latitude: 45.4215, longitude: -75.6972 },
  { city: "Winnipeg", latitude: 49.8951, longitude: -97.1384 }, // Central
  { city: "Regina", latitude: 50.4452, longitude: -104.6189 },
  { city: "Calgary", latitude: 51.0447, longitude: -114.0719 }, // Mountain
  { city: "Edmonton", latitude: 53.5461, longitude: -113.4938 },
  { city: "Vancouver", latitude: 49.2827, longitude: -123.1207 }, // Pacific
  { city: "Victoria", latitude: 48.4284, longitude: -123.3656 },
  { city: "Whitehorse", latitude: 60.7212, longitude: -135.0568 }, // Yukon
  { city: "Yellowknife", latitude: 62.454, longitude: -114.3718 },
  { city: "St. John's", latitude: 47.5615, longitude: -52.7126 }, // Newfoundland
  { city: "Corner Brook", latitude: 48.9455, longitude: -57.9469 },

  // Russia (11 time zones)
  { city: "Kaliningrad", latitude: 54.7104, longitude: 20.4522 },
  { city: "Pskov", latitude: 57.8193, longitude: 28.3318 },
  { city: "Moscow", latitude: 55.7558, longitude: 37.6173 },
  { city: "Volgograd", latitude: 48.708, longitude: 44.5133 },
  { city: "Yekaterinburg", latitude: 56.8389, longitude: 60.6057 },
  { city: "Chelyabinsk", latitude: 55.1644, longitude: 61.4368 },
  { city: "Omsk", latitude: 54.9885, longitude: 73.3242 },
  { city: "Novosibirsk", latitude: 55.0084, longitude: 82.9357 },
  { city: "Krasnoyarsk", latitude: 56.0153, longitude: 92.8932 },
  { city: "Irkutsk", latitude: 52.287, longitude: 104.305 },
  { city: "Yakutsk", latitude: 62.0355, longitude: 129.6755 },
  { city: "Magadan", latitude: 59.561, longitude: 150.8159 },
  { city: "Vladivostok", latitude: 43.1155, longitude: 131.8855 },
  { city: "Petropavlovsk-Kamchatsky", latitude: 53.0444, longitude: 158.65 },

  // Brazil (4 time zones)
  { city: "São Paulo", latitude: -23.5505, longitude: -46.6333 },
  { city: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729 },
  { city: "Cuiabá", latitude: -15.601, longitude: -56.0974 },
  { city: "Campo Grande", latitude: -20.4697, longitude: -54.6201 },
  { city: "Manaus", latitude: -3.119, longitude: -60.0217 },
  { city: "Porto Velho", latitude: -8.7608, longitude: -63.9039 },
  { city: "Rio Branco", latitude: -9.9747, longitude: -67.8249 },
  { city: "Cruzeiro do Sul", latitude: -7.6254, longitude: -72.6756 },

  // Australia (3–4 time zones)
  { city: "Sydney", latitude: -33.8688, longitude: 151.2093 },
  { city: "Melbourne", latitude: -37.8136, longitude: 144.9631 },
  { city: "Adelaide", latitude: -34.9285, longitude: 138.6007 },
  { city: "Darwin", latitude: -12.4634, longitude: 130.8456 },
  { city: "Brisbane", latitude: -27.4698, longitude: 153.0251 },
  { city: "Cairns", latitude: -16.9186, longitude: 145.7781 },
  { city: "Perth", latitude: -31.9505, longitude: 115.8605 },
  { city: "Broome", latitude: -17.9614, longitude: 122.2359 },

  // Mexico (4 time zones)
  { city: "Mexico City", latitude: 19.4326, longitude: -99.1332 },
  { city: "Guadalajara", latitude: 20.6597, longitude: -103.3496 },
  { city: "Chihuahua", latitude: 28.6353, longitude: -106.0889 },
  { city: "Hermosillo", latitude: 29.0729, longitude: -110.9559 },
  { city: "Tijuana", latitude: 32.5149, longitude: -117.0382 },
  { city: "Mexicali", latitude: 32.6245, longitude: -115.4523 },
  { city: "Cancún", latitude: 21.1619, longitude: -86.8515 },
  { city: "Chetumal", latitude: 18.5036, longitude: -88.2962 },

  // Indonesia (3 time zones)
  { city: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
  { city: "Bandung", latitude: -6.9175, longitude: 107.6191 },
  { city: "Makassar", latitude: -5.1477, longitude: 119.4327 },
  { city: "Manado", latitude: 1.4748, longitude: 124.8421 },
  { city: "Jayapura", latitude: -2.5916, longitude: 140.6689 },
  { city: "Timika", latitude: -4.532, longitude: 136.888 },

  // Kazakhstan (2 time zones)
  { city: "Almaty", latitude: 43.222, longitude: 76.8512 },
  { city: "Astana", latitude: 51.1605, longitude: 71.4704 },
  { city: "Oral", latitude: 51.2488, longitude: 51.3682 },
  { city: "Atyrau", latitude: 47.0945, longitude: 51.9238 },
];
