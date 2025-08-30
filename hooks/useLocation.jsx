import { useQuery } from "@tanstack/react-query";

const fetchLocation = async (query) => {
  if (!query) return [];
  
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&countryCode=DE&format=json`
  );

  if (!response.ok) throw new Error("Failed to fetch location");
  const data = await response.json();
  return data.results || [];
};

export const useLocation = (query) => {
  return useQuery({
    queryKey: ["locations", query],
    queryFn: () => fetchLocation(query),
    enabled: !!query, 
    staleTime: 1000 * 60 * 20, // 20 minutes cache
  });
};
