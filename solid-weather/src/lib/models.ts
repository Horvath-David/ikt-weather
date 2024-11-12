export interface LocationData {
  name: string;
  latitude: number;
  longtitude: number;
  country: string;
  country_code: string;
  elevation: number;
}

export interface WeatherData {
  location: LocationData;
  weather: {};
}
