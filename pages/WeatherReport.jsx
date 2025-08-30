import { useLocation } from "../hooks/useLocation";
import { useWeather } from "../hooks/useWeather";
import { useEffect, useState } from "react";
const SURF_STATUS = {
  GOOD: "good",
  WINDY: "windy",
  DANGER: "danger",
};
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
    if (e.key === "Enter") {
      setSearchPlace(place);
      setSelectedLocation(null);
    }
  };

  const getSurfCondition = (weather) => {
    if (!weather) return { status: "Unknown", color: "gray" };

    const maxWind = weather.daily.windspeed_10m_max[0];

    if (maxWind < 15) {
      return { status: SURF_STATUS.GOOD, color: "green" };
    } else if (maxWind < 25) {
      return { status: SURF_STATUS.WINDY, color: "yellow" };
    } else {
      return { status: SURF_STATUS.DANGER, color: "red" };
    }
  };
  useEffect(() => {
    setSurfCondition(getSurfCondition(weather));
  }, [weather]);

  const GraphicRender = ({ status }) => {
    let data = { src: "/src/assets/danger.svg", alt: "unknown" };
    switch (status) {
      case SURF_STATUS.GOOD:
        data.src = "/src/assets/surfing.svg";
        data.alt = "Good to surf";
        break;
      case SURF_STATUS.WINDY:
        data.src = "/src/assets/windy.svg";
        data.alt = "Ok to surf but windy";
        break;
      case SURF_STATUS.DANGER:
        data.src = "/src/assets/danger.svg";
        data.alt = "Dangerous to surf";
        break;

      default:
        break;
    }
    return (
      <>
        <img src={data.src} alt={data.alt} />
        <p>{data.alt}</p>
      </>
    );
  };
  return (
    <div className="">
      <h1 className="">Surfer Weather Forecast</h1>

      <div className="">
        <div className="">
          <input
            type="text"
            value={place}
            onChange={(e) => {
              setPlace(e.target.value);
              setSelectedLocation(null);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Type a German city..."
            className=""
          />
          <button
            onClick={() => {
              setSearchPlace(place);
              setSelectedLocation(null);
            }}
            className=""
          >
            Search
          </button>
        </div>
      </div>
      {searchPlace && locations && locations.length > 0 && (
        <>
          <p>Please choose the correct location from the results below :</p>
          <ul className="mb-4">
            {locations.map((loc) => (
              <li
                key={loc.id}
                className=""
                onClick={() => {
                  setSelectedLocation({
                    lat: loc.latitude,
                    lon: loc.longitude,
                  });
                  setPlace(`${loc.name}, ${loc.country}`);
                  setSearchPlace("");
                }}
              >
                {loc.name}, {loc.country}
              </li>
            ))}
          </ul>
        </>
      )}
      {isLoading ? <span>Loading Data...Please wait</span> : <></>}
      {weather && selectedLocation && (
        <div className="forcastCard card">
          <p className="text-lg font-semibold">Weather for {place}:</p>
          <GraphicRender status={surfCondition.status} />
          <p>Max Temp: {weather.daily.temperature_2m_max[0]}°C</p>
          <p>Min Temp: {weather.daily.temperature_2m_min[0]}°C</p>
          <p>Max Wind: {weather.daily.windspeed_10m_max[0]} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherReport;
