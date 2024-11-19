import { fetchWeatherApi } from "openmeteo";
import { AiOutlineLoading } from "solid-icons/ai";
import { FaSolidLocationArrow } from "solid-icons/fa";
import { Component, createSignal } from "solid-js";
import { toast } from "solid-sonner";
import {
  TextFieldLabel,
  TextFieldInput,
  TextField,
} from "~/components/ui/text-field";
import { LocationData, WeatherData } from "~/lib/models";
import { useStatus } from "~/lib/statusContext";
import { cn } from "~/lib/utils";
import { useWeather } from "~/lib/weatherContext";

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export const Search: Component<{ class?: string }> = (props) => {
  const [_, setStatus] = useStatus();
  const [__, setWeather] = useWeather();
  const [loading, setLoading] = createSignal(false);

  const [locationInput, setLocationInput] = createSignal("");

  async function searchLocation(e: SubmitEvent) {
    e.preventDefault();

    setLoading(true);
    const locationRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput()}&count=1&language=en&format=json`,
    );
    if (locationRes.ok) {
      const location = (await locationRes.json())?.results?.at(0) as
        | LocationData
        | undefined;
      if (!location) {
        await new Promise((res) => setTimeout(res, 500));
        toast.error("No location found.");
        setLoading(false);
        return;
      }
      await new Promise((res) => setTimeout(res, 500));
      const weatherRes = (
        await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", {
          latitude: [location.latitude],
          longitude: [location.longitude],
          timezone: "auto",
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index",
          hourly:
            "temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
          daily:
            "temperature_2m_min,temperature_2m_max,sunrise,sunset,precipitation_probability_max,precipitation_sum,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max",
        })
      ).at(0);

      const utcOffsetSeconds = weatherRes?.utcOffsetSeconds() ?? 0;

      const current = weatherRes?.current();
      const hourly = weatherRes?.hourly();
      const daily = weatherRes?.daily();

      const weatherData: WeatherData = {
        location,
        weather: {
          current: {
            time: new Date((Number(current?.time()) + utcOffsetSeconds) * 1000),
            temperature: current?.variables(0)?.value(),
            humidity: current?.variables(1)?.value(),
            feels_like: current?.variables(2)?.value(),
            precipitation_chance: current?.variables(3)?.value(),
            precipitation_amount: current?.variables(4)?.value(),
            weather_code: current?.variables(5)?.value(),
            wind_speed: current?.variables(6)?.value(),
            wind_direction: current?.variables(7)?.value(),
            uv_index: current?.variables(8)?.value(),
          },
          hourly: {
            time: range(
              Number(hourly?.time()),
              Number(hourly?.timeEnd()),
              hourly?.interval() ?? 3_600_000,
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature: hourly?.variables(0)?.valuesArray() || undefined,
            feels_like: hourly?.variables(1)?.valuesArray() || undefined,
            precipitation_chance:
              hourly?.variables(2)?.valuesArray() || undefined,
            precipitation_amount:
              hourly?.variables(3)?.valuesArray() || undefined,
            weather_code: hourly?.variables(4)?.valuesArray() || undefined,
            wind_speed: hourly?.variables(5)?.valuesArray() || undefined,
            wind_direction: hourly?.variables(6)?.valuesArray() || undefined,
          },
          daily: {
            time: range(
              Number(daily?.time()),
              Number(daily?.timeEnd()),
              daily?.interval() ?? 86_400_000,
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            min_temperature: daily?.variables(0)?.valuesArray() || undefined,
            max_temperature: daily?.variables(1)?.valuesArray() || undefined,
            // sunrise: daily?.variables(2) || undefined,
            // sunset: daily?.variables(3)?.valuesArray() || undefined,
            precipitation_chance:
              daily?.variables(4)?.valuesArray() || undefined,
            precipitation_amount:
              daily?.variables(5)?.valuesArray() || undefined,
            weather_code: daily?.variables(6)?.valuesArray() || undefined,
            wind_speed: daily?.variables(7)?.valuesArray() || undefined,
            wind_direction: daily?.variables(8)?.valuesArray() || undefined,
            uv_index: daily?.variables(9)?.valuesArray() || undefined,
          },
        },
      };

      setWeather(weatherData);
      setStatus("selected");

      setLoading(false);

      await new Promise((res) => setTimeout(res, 500));
      setLocationInput("");
    }
  }

  return (
    <form
      onSubmit={searchLocation}
      class={cn(
        "absolute inset-0 flex h-screen w-full items-center justify-center p-4",
        props.class,
      )}
    >
      <div class="flex w-full items-center md:ml-2 md:max-w-sm">
        <TextField
          value={locationInput()}
          onChange={setLocationInput}
          class="min-w-0 flex-1 basis-0"
        >
          <TextFieldLabel class="flex items-center gap-4 rounded-2xl border border-white/35 bg-white/[.075] shadow-xl shadow-black/[.02] focus-within:border-2">
            <FaSolidLocationArrow class="ml-4 text-white/35" size={20} />
            <TextFieldInput
              type="text"
              autocomplete="off"
              autofocus={true}
              placeholder="Search for a place..."
              class="min-w-0 max-w-full border-none p-0 py-6 pr-4 text-xl placeholder:text-white/65 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </TextFieldLabel>
        </TextField>
        <div
          class="flex h-6 w-0 max-w-10 shrink-0 flex-grow-[.0001] basis-0 justify-end text-white/65 opacity-0 transition-[flex,_opacity] duration-700"
          classList={{
            "flex-grow-[1] !opacity-100": loading(),
          }}
        >
          <AiOutlineLoading class="h-6 w-6 animate-spin duration-1000" />
        </div>
      </div>
    </form>
  );
};
