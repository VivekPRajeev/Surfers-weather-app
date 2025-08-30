import { useLocation } from "../hooks/useLocation";
import { useWeather } from "../hooks/useWeather";
import { useEffect, useState } from "react";
const WeatherReport = () => {
  const [place, setPlace] = useState("");
  const [searchPlace, setSearchPlace] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
    const [surfCondition, setSurfCondition] = useState({});

  const { data: locations } = useLocation(searchPlace);
  const {
    data: weather,
    isLoading,
    error,
  } = useWeather(selectedLocation || {});
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") setSearchPlace(place);
  };

  const getSurfCondition = (weather) => {
    if (!weather) return { status: "Unknown", color: "gray" };

    const maxWind = weather.daily.windspeed_10m_max[0];

    if (maxWind < 15) {
      return { status: "Good to Surf", color: "green" };
    } else if (maxWind < 25) {
      return { status: "Be Cautious", color: "yellow" };
    } else {
      return { status: "Not Good to Surf", color: "red" };
    }
  };
  useEffect(() => {
    setSurfCondition(getSurfCondition(weather))
  }, [weather]);

  return (
    <div className="">
      <h1 className="">Surfer Weather Forecast</h1>

      <div className="">
        <div className="">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Type a German city..."
            className=""
          />
          <button
            onClick={() => setSearchPlace(place)}
            className=""
          >
            Search
          </button>
        </div>
      </div>
      {searchPlace && locations && locations.length > 0 && (
        <ul className="mb-4">
          {locations.map((loc) => (
            <li
              key={loc.id}
              className=""
              onClick={() => {
                setSelectedLocation({ lat: loc.latitude, lon: loc.longitude });
                setPlace(`${loc.name}, ${loc.country}`);
                setSearchPlace('');
              }}
            >
              {loc.name}, {loc.country}
            </li>
          ))}
        </ul>
      )}

      {weather && selectedLocation && (
        <div className="forcastCard card">
          <p className="text-lg font-semibold">Weather for {place}:</p>
          <p>Max Temp: {weather.daily.temperature_2m_max[0]}°C</p>
          <p>Min Temp: {weather.daily.temperature_2m_min[0]}°C</p>
          <p>Max Wind: {weather.daily.windspeed_10m_max[0]} km/h</p>

          {/* Surf indicator */}
          <div
            className={`mt-2 p-2 rounded-md text-white font-bold text-center
                     ${
                       surfCondition.color === "green"
                         ? "bg-green-500"
                         : surfCondition.color === "yellow"
                         ? "bg-yellow-400"
                         : "bg-red-500"
                     }`}
          >
            {surfCondition.status}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherReport;
