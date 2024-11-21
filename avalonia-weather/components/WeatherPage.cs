using System;
using Avalonia.Controls;
using Avalonia.Markup.Declarative;
using AvaWeather.models;

namespace AvaWeather.components;

public class WeatherPage(WeatherData data, Action backToSearch) : ComponentBase {
    protected override object Build() =>
        new ScrollViewer().Content(
            new StackPanel().Children(
                new TextBlock().Text($"{data.location?.name}, {data.location?.country}")
            )
        );
}