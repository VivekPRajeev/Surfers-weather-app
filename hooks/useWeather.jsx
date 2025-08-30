import { useQuery } from "@tanstack/react-query";

const fetchWeather = async (location) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=auto`
  );
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
};

export const useWeather = (location) => {
    console.log(location)
  return useQuery({
    queryKey: ["weather", location],
    queryFn: () => fetchWeather(location),
    enabled: !!location.lon, // only run if location is set
    staleTime: 1000 * 60 , // 1 minute cache
  });
};
