export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  elevation: number;
}

export interface WeatherData {
  location: LocationData;
  weather: {
    current: {
      time: Date;
      temperature?: number;
      humidity?: number;
      feels_like?: number;
      precipitation_chance?: number;
      precipitation_amount?: number;
      weather_code?: number;
      wind_speed?: number;
      wind_direction?: number;
      uv_index?: number;
    };
    hourly: {
      time: Date[];
      temperature?: Float32Array;
      feels_like?: Float32Array;
      precipitation_chance?: Float32Array;
      precipitation_amount?: Float32Array;
      weather_code?: Float32Array;
      wind_speed?: Float32Array;
      wind_direction?: Float32Array;
    };
    daily: {
      time: Date[];
      min_temperature?: Float32Array;
      max_temperature?: Float32Array;
      sunrise?: Date[];
      sunset?: Date[];
      precipitation_chance?: Float32Array;
      precipitation_amount?: Float32Array;
      weather_code?: Float32Array;
      wind_speed?: Float32Array;
      wind_direction?: Float32Array;
      uv_index?: Float32Array;
    };
  };
}
