//prettier-ignore
export const cities = [
  // United States (6 time zones)
  { city: "New York City", country: "United States", latitude: 40.730610, longitude: -73.935242 }, // Eastern
  { city: "Washington D.C.", country: "United States", latitude: 38.889805, longitude: -77.009056 }, // Eastern
  { city: "Miami", country: "United States", latitude: 25.7617, longitude: -80.1918 }, // Eastern
  { city: "Chicago", country: "United States", latitude: 41.881832, longitude: -87.623177 }, // Central
  { city: "Houston", country: "United States", latitude: 29.749907, longitude: -95.358421 }, // Central
  { city: "Denver", country: "United States", latitude: 39.742043, longitude: -104.991531 }, // Mountain
  { city: "Phoenix", country: "United States", latitude: 33.448376, longitude: -112.074036 }, // Mountain
  { city: "Los Angeles", country: "United States", latitude: 34.052235, longitude: -118.243683 }, // Pacific
  { city: "Seattle", country: "United States", latitude: 47.608013, longitude: -122.335167 }, // Pacific
  { city: "San Francisco", country: "United States", latitude: 37.774929, longitude: -122.419418 }, // Pacific
  { city: "Anchorage", country: "United States", latitude: 61.217381, longitude: -149.863129 }, // Alaska
  { city: "Fairbanks", country: "United States", latitude: 64.835365, longitude: -147.776749 }, // Alaska
  { city: "Honolulu", country: "United States", latitude: 21.315603, longitude: -157.858093 }, // Hawaii-Aleutian
  { city: "Hilo", country: "United States", latitude: 19.724112, longitude: -155.086823 }, // Hawaii-Aleutian


  // Canada (6 time zones)
  { city: "Vancouver", country: "Canada", latitude: 49.2827, longitude: -123.1207 },// Pacific
  { city: "Surrey", country: "Canada", latitude: 49.1045, longitude: -122.8472 },
  { city: "Whitehorse", country: "Canada", latitude: 60.7212, longitude: -135.0520}, // Yukon
  { city: "Edmonton", country: "Canada", latitude: 53.3204, longitude: -113.2925 }, // Mountain
  { city: "Calgary", country: "Canada", latitude: 51.049999, longitude: -114.066666 },
  { city: "Winnipeg", country: "Canada", latitude: 49.8951, longitude: -97.1384 }, // Central
  { city: "Regina", country: "Canada", latitude: 50.445210, longitude: -104.618896 },
  { city: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832 }, // Eastern
  { city: "Montreal", country: "Canada", latitude: 45.508888, longitude: -73.561668 }, 
  { city: "Halifax", country: "Canada", latitude: 44.651070, longitude: -63.582687 }, // Atlantic
  { city: "Moncton", country: "Canada", latitude: 46.099479, longitude: -64.799802 }, 
  { city: "St.John's", country: "Canada", latitude: 47.5604, longitude: -52.7126 }, // Newfoundland
  { city: "Corner Brook", country: "Canada", latitude: 48.950001, longitude: -57.950001 }, 

  // Russia (11 time zones),
  { city: "Kaliningrad", country: "Russia", latitude: 54.715424, longitude: 20.509207 }, //(UTC+2)
  { city: "Sovetsk", country: "Russia", latitude: 55.0788538, longitude: 21.8787067 }, // (UTC+2)
  { city: "Moscow", country: "Russia", latitude: 55.751244, longitude: 37.618423 }, //(UTC+3)
  { city: "Saint Petersburg", country: "Russia", latitude: 59.937500, longitude: 30.308611 }, //(UTC+3)
  { city: "Samara", country: "Russia", latitude: 53.241505, longitude: 50.221245 }, //(UTC+4)
  { city: "Tolyatti", country: "Russia", latitude: 53.5086002, longitude: 49.4198344 }, //(UTC+4)
  { city: "Yekaterinburg", country: "Russia", latitude: 56.833332, longitude: 60.583332 }, //(UTC+5)
  { city: "Chelyabinsk", country: "Russia", latitude: 55.164440, longitude: 61.436844 }, //(UTC+5)
  { city: "Omsk", country: "Russia", latitude: 54.983334, longitude: 73.366669 }, // (UTC+6)
  { city: "Krasnoyarsk", country: "Russia", latitude: 56.0089, longitude: 92.8719 }, // UTC+7
  { city: "Novosibirsk", country: "Russia", latitude: 55.018803, longitude: 82.933952 }, // UTC+7
  { city: "Irkutsk", country: "Russia", latitude: 52.2833, longitude: 104.2833 }, // UTC+8
  { city: "Ulan-Ude", country: "Russia", latitude: 51.8333, longitude: 107.6000 }, // UTC+8
  { city: "Yakutsk", country: "Russia", latitude: 62.035454, longitude: 129.675476 }, // UTC+9
  { city: "Chita", country: "Russia", latitude: 52.0500, longitude: 113.4667 }, // UTC+9
  { city: "Vladivostok", country: "Russia", latitude: 43.1333, longitude: 131.9000 }, // UTC+10
  { city: "Khabarovsk", country: "Russia", latitude: 48.4833, longitude: 135.0833 }, // UTC+10
  { city: "Magadan", country: "Russia", latitude: 59.560246, longitude: 150.798599 }, // UTC+11
  { city: "Yuzhno-Sakhalinsk", country: "Russia", latitude: 46.9592, longitude: 142.7326 }, // UTC+11
  { city: "Petropavlovsk-Kamchatsky", country: "Russia", latitude: 53.0452, longitude: 158.6486 }, // UTC+12
  { city: "Anadyr", country: "Russia", latitude: 64.736083, longitude: 177.480653 }, // UTC+12

  // Brazil (4 time zones)
  { city: "Fernando de Noronha", country: "Brasil", latitude: -3.85381, longitude: -32.4238 }, // UTC-2
  { city: "Atol das Rocas", country: "Brasil", latitude: -3.8700, longitude: -33.7300 }, // UTC-2
  { city: "São Paulo", country: "Brasil", latitude: -23.533773, longitude: -46.625290 }, // UTC-3
  { city: "Rio de Janeiro", country: "Brasil", latitude: -22.908333, longitude: -43.196388 }, // UTC-3
  { city: "Manaus", country: "Brasil", latitude: -3.117034, longitude: -60.025780 }, // UTC-4
  { city: "Cuiabá", country: "Brasil", latitude: -15.5958, longitude: -56.0969 }, // UTC-4
  { city: "Rio Branco", country: "Brasil", latitude: -9.97111, longitude: -67.8111 }, // UTC-5
  { city: "Porto Velho", country: "Brasil", latitude: -8.76194, longitude: -63.9039 }, // UTC-5

  // Australia (3–4 time zones)
  { city: "Perth", country: "Australia", latitude: -31.953512, longitude: 115.857048 }, // AWST (UTC+8)
  { city: "Carnarvon", country: "Australia", latitude: -24.8667, longitude: 113.6333}, // AWST (UTC+8)
  { city: "Bunbury", country: "Australia", latitude: -33.333332, longitude: 115.633331 }, // AWST (UTC+8)
  { city: "Adelaide", country: "Australia", latitude: -34.921230, longitude: 138.599503 }, // ACST (UTC+9:30)
  { city: "Darwin", country: "Australia", latitude: -12.462827, longitude: 130.841782 }, // ACST (UTC+9:30)
  { city: "Sydney", country: "Australia", latitude: -33.865143, longitude: 151.209900 }, // AEST (UTC+10)
  { city: "Melbourne", country: "Australia", latitude: -37.840935, longitude: 144.946457 }, // AEST (UTC+10)
  { city: "Brisbane", country: "Australia", latitude: -27.469770, longitude: 153.025124 }, // AEST (UTC+10)
  { city: "Lord Howe Island", country: "Australia", latitude: -31.62335, longitude: 159.16764 }, // LHST (UTC+10:30)
 

  // Mexico (4 time zones)
  { city: "Tijuana", country: "Mexico", latitude: 32.522499, longitude: -117.046623 }, // Northwest Time Zone (UTC-7)
  { city: "Mexicali", country: "Mexico", latitude: 32.663334, longitude: -115.467781 }, // Northwest Time Zone (UTC-7)
  { city: "Mazatlán", country: "Mexico", latitude: 23.249414, longitude: -106.411140 }, // Pacific Time Zone (UTC-7)
  { city: "La Paz", country: "Mexico", latitude: 24.142222, longitude: -110.310833 }, // Pacific Time Zone (UTC-7)
  { city: "Mexico City", country: "Mexico", latitude: 19.432608, longitude: -99.133209 }, // Central Time Zone (UTC-6)
  { city: "Ecatepec", country: "Mexico", latitude: 19.609722, longitude: -99.059998 }, // Central Time Zone (UTC-6)
  { city: "Cancún", country: "Mexico", latitude: 21.1606, longitude: -86.8475 }, // Southeast Time Zone (UTC-5)
  { city: "Chetumal", country: "Mexico", latitude: 18.5036, longitude: -88.3053 }, // Southeast Time Zone (UTC-5)

  // Indonesia (3 time zones)
  { city: "Medan", country: "Indonesia", latitude: 3.595196, longitude: 98.672223 }, // WIB (UTC+7)
  { city: "Jakarta", country: "Indonesia", latitude: -6.200000, longitude: 106.816666 }, // WIB (UTC+7)
  { city: "Surabaya", country: "Indonesia", latitude: -7.250445, longitude: 112.768845 }, // WIB (UTC+7)
  { city: "Makassar", country: "Indonesia", latitude: -5.135399, longitude: 119.423790 }, // WITA (UTC+8)
  { city: "Denpasar", country: "Indonesia", latitude: -8.650000, longitude: 115.216667 }, // WITA (UTC+8)
  { city: "Jayapura", country: "Indonesia", latitude: -2.5333, longitude: 140.717 }, // WIT (UTC+9)
  { city: "Sorong", country: "Indonesia", latitude: -0.866667, longitude: 131.25 }, // WIT (UTC+9)
  { city: "North Khalimantan", country: "Indonesia", latitude: 2.5, longitude: 117.5}, // WIT (UTC+9)

  // Kazakhstan (2 time zones)
  { city: "Almaty", country: "Kazakhstan", latitude: 43.222, longitude: 76.8512 },
  { city: "Astana", country: "Kazakhstan", latitude: 51.1605, longitude: 71.4704 },
  { city: "Oral", country: "Kazakhstan", latitude: 51.2488, longitude: 51.3682 },
  { city: "Atyrau", country: "Kazakhstan", latitude: 47.0945, longitude: 51.9238 },
];
