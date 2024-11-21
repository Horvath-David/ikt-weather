using System.Collections.Generic;

namespace AvaWeather.models;

public record LocationData {
    public string name { get; set; } = "";
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string country { get; set; } = "";
    public string country_code { get; set; } = "";
    public double elevation { get; set; }
}

public record Weather {
    public double latitude { get; set; }
    public double longitude { get; set; }
    public double generationtime_ms { get; set; }
    public int utc_offset_seconds { get; set; }
    public string timezone { get; set; }
    public string timezone_abbreviation { get; set; }
    public double elevation { get; set; }
    public CurrentUnits current_units { get; set; }
    public Current current { get; set; }
    public HourlyUnits hourly_units { get; set; }
    public Hourly hourly { get; set; }
    public DailyUnits daily_units { get; set; }
    public Daily daily { get; set; }
}

public record CurrentUnits {
    public string time { get; set; }
    public string interval { get; set; }
    public string temperature_2m { get; set; }
    public string relative_humidity_2m { get; set; }
    public string apparent_temperature { get; set; }
    public string precipitation_probability { get; set; }
    public string precipitation { get; set; }
    public string weather_code { get; set; }
    public string wind_speed_10m { get; set; }
    public string wind_direction_10m { get; set; }
    public string uv_index { get; set; }
}

public record Current {
    public string time { get; set; }
    public int interval { get; set; }
    public double temperature_2m { get; set; }
    public int relative_humidity_2m { get; set; }
    public double apparent_temperature { get; set; }
    public int precipitation_probability { get; set; }
    public double precipitation { get; set; }
    public int weather_code { get; set; }
    public double wind_speed_10m { get; set; }
    public int wind_direction_10m { get; set; }
    public double uv_index { get; set; }
}

public record HourlyUnits {
    public string time { get; set; }
    public string temperature_2m { get; set; }
    public string apparent_temperature { get; set; }
    public string precipitation_probability { get; set; }
    public string precipitation { get; set; }
    public string weather_code { get; set; }
    public string wind_speed_10m { get; set; }
    public string wind_direction_10m { get; set; }
}

public record Hourly {
    public List<string> time { get; set; }
    public List<double> temperature_2m { get; set; }
    public List<double> apparent_temperature { get; set; }
    public List<int> precipitation_probability { get; set; }
    public List<double> precipitation { get; set; }
    public List<int> weather_code { get; set; }
    public List<double> wind_speed_10m { get; set; }
    public List<int> wind_direction_10m { get; set; }
}

public record DailyUnits {
    public string time { get; set; }
    public string temperature_2m_min { get; set; }
    public string temperature_2m_max { get; set; }
    public string sunrise { get; set; }
    public string sunset { get; set; }
    public string precipitation_probability_max { get; set; }
    public string precipitation_sum { get; set; }
    public string weather_code { get; set; }
    public string wind_speed_10m_max { get; set; }
    public string wind_direction_10m_dominant { get; set; }
    public string uv_index_max { get; set; }
}

public record Daily {
    public List<string> time { get; set; }
    public List<double> temperature_2m_min { get; set; }
    public List<double> temperature_2m_max { get; set; }
    public List<string> sunrise { get; set; }
    public List<string> sunset { get; set; }
    public List<int> precipitation_probability_max { get; set; }
    public List<double> precipitation_sum { get; set; }
    public List<int> weather_code { get; set; }
    public List<double> wind_speed_10m_max { get; set; }
    public List<int> wind_direction_10m_dominant { get; set; }
    public List<double> uv_index_max { get; set; }
}

public record WeatherData {
    public LocationData? location { get; set; }
    public Weather? weather { get; set; }
}