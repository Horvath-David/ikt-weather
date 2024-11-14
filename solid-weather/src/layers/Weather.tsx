import { FaSolidLocationArrow } from "solid-icons/fa";
import { TbWind } from "solid-icons/tb";
import { Component, createEffect, For, Show } from "solid-js";
import {
  cn,
  degreesToCompass,
  formatTemp,
  weatherCodeToIcon,
} from "~/lib/utils";
import { useWeather } from "~/lib/weatherContext";

export const Weather: Component<{ class?: string }> = (props) => {
  const [weather] = useWeather();

  createEffect(() => console.log(weather()));

  return (
    <div class={cn("absolute inset-0 flex gap-8 p-8", props.class)}>
      <aside class="h-full max-w-64 shrink-0 flex-grow rounded-2xl border border-white/35 bg-white/10 p-4">
        <div class="flex items-center gap-3 rounded-xl border border-white/35 bg-white/[.075]">
          <FaSolidLocationArrow class="ml-3 text-white/35" size={18} />
          <div class="w-full break-all border-none p-0 py-2 pr-3">
            <Show when={weather()?.location} fallback="Click to search">
              <span class="line-clamp-1">
                {weather()?.location.name}
                {weather()?.location.country &&
                  ", " + weather()?.location.country}
              </span>
            </Show>
          </div>
        </div>
      </aside>
      <main class="flex h-full flex-1 flex-col justify-end gap-1">
        <div class="mb-4 flex items-center gap-6">
          {weatherCodeToIcon(weather()?.weather.current.weather_code)({
            size: 64,
          })}
          <span class="text-5xl font-semibold">
            {formatTemp(weather()?.weather.current.temperature)}
          </span>
        </div>
        <span class="text-xl leading-none">
          Feels like{" "}
          <span class="font-semibold">
            {formatTemp(weather()?.weather.current.feels_like)}
          </span>
        </span>
        <span class="text-xl leading-none">
          <span class="font-semibold">
            {formatTemp(weather()?.weather.current.temperature)}{" "}
          </span>
          low,{" "}
          <span class="font-semibold">
            {formatTemp(weather()?.weather.current.temperature)}{" "}
          </span>
          high
        </span>

        <div class="mt-4 flex items-center gap-2">
          <TbWind size={28} />
          <span class="text-xl">
            {degreesToCompass(weather()?.weather.current.wind_direction ?? 0)}{" "}
            <span class="font-semibold">
              {Math.round((weather()?.weather.current.wind_speed ?? 0) * 10) /
                10}
              km/h
            </span>
          </span>
        </div>

        <div class="mt-8 flex h-48 w-full max-w-full gap-4 overflow-y-hidden overflow-x-scroll">
          <For each={weather()?.weather.daily.time ?? []}>
            {(time, i) => (
              <div class="flex h-full w-32 flex-col items-center gap-4 rounded-xl border border-white/35 bg-white/10 p-2">
                <span class="text-sm font-semibold">
                  {time.toLocaleString("en-us", { weekday: "long" })}
                </span>
                {weatherCodeToIcon(
                  weather()?.weather.daily.weather_code?.at(i()),
                )({
                  size: 48,
                })}
              </div>
            )}
          </For>
        </div>
      </main>
    </div>
  );
};
