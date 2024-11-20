using Avalonia.Controls;
using Avalonia.Markup.Declarative;

namespace AvaWeather.components;

public class MainComponent : ComponentBase {
    protected override object Build() =>
        new TextBlock().Text("AvaWeather main component");
}