using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Avalonia.Controls;
using Avalonia.Data.Converters;
using Avalonia.Layout;
using Avalonia.Markup.Declarative;
using AvaWeather.models;

namespace AvaWeather.components;

public record GeoRespose {
    public LocationData[]? results { get; set; }
}

public class MainComponent : ComponentBase {
    public bool IsSearching { get; set; } = true;
    public string LocationText { get; set; } = "";

    public WeatherData WeatherData { get; set; } = new WeatherData();

    protected override object Build() =>
        new ContentControl().Content(() => {
            if (IsSearching)
                return new Grid().Rows("*,*")
                    .Children(
                        new TextBox()
                            .Text(() => LocationText)
                            .OnTextChanged(args => LocationText = (args.Source as TextBox)?.Text ?? "")
                            .VerticalAlignment(VerticalAlignment.Center)
                            .HorizontalAlignment(HorizontalAlignment.Center)
                            .Row(0),
                        new Button()
                            .Content("Search")
                            .OnClick(_ => Task.Run(Search))
                            .VerticalAlignment(VerticalAlignment.Center)
                            .HorizontalAlignment(HorizontalAlignment.Center)
                            .Row(1)
                    );
            return new WeatherPage(WeatherData, () => IsSearching = false);
        });


    private async Task Search() {
        Console.WriteLine($"Search: {LocationText}");

        var geoRes = await API.Instance.MakeRequest<GeoRespose>(new APIRequest {
            Url = "https://geocoding-api.open-meteo.com/v1/search",
            Query = new Dictionary<string, string> {
                ["name"] = LocationText,
                ["count"] = "1",
                ["language"] = "en",
                ["format"] = "json"
            }
        });
        Console.WriteLine(geoRes.StatusCode);
        Console.WriteLine(geoRes.Data?.results?.Length);
        if (geoRes.StatusCode == HttpStatusCode.NotFound
            || (geoRes.Ok
                && !(geoRes.Data?.results?.Length > 0))
           ) {
            Console.WriteLine("Geocoding not found");
            return;
        }

        if (!geoRes.Ok) {
            Console.WriteLine("Geocoding error");
            return;
        }

        var location = geoRes.Data?.results?.First();
        Console.WriteLine($"Geocoding API result: {location}");

        var weatherRes = await API.Instance.MakeRequest<Weather>(new APIRequest {
            Url = "https://api.open-meteo.com/v1/forecast",
            Query = new Dictionary<string, string> {
                ["latitude"] = location?.latitude.ToString(CultureInfo.InvariantCulture) ?? "",
                ["longitude"] = location?.longitude.ToString(CultureInfo.InvariantCulture) ?? "",
                ["timezone"] = "auto",
                ["current"] =
                    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index",
                ["hourly"] =
                    "temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
                ["daily"] =
                    "temperature_2m_min,temperature_2m_max,sunrise,sunset,precipitation_probability_max,precipitation_sum,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max"
            }
        });
        if (!weatherRes.Ok) {
            Console.WriteLine("Weather error");
            return;
        }

        var weather = weatherRes.Data;
        Console.WriteLine($"Weather API result: {weather}");

        WeatherData = new WeatherData {
            location = location,
            weather = weather
        };
        IsSearching = false;
        StateHasChanged();
    }
}