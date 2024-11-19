import { BsCloudRainFill } from "solid-icons/bs";
import { FaSolidCalendarDay, FaSolidLocationArrow } from "solid-icons/fa";
import { TbWind } from "solid-icons/tb";
import { Component, For, Show } from "solid-js";
import { useStatus } from "~/lib/statusContext";
import {
  cn,
  degreesToCompass,
  formatTemp,
  weatherCodeToIcon,
} from "~/lib/utils";
import { useWeather } from "~/lib/weatherContext";

export const Weather: Component<{ class?: string }> = (props) => {
  const [weather] = useWeather();
  const [_, setStatus] = useStatus();

  function toSearch() {
    setStatus("searching");
  }

  return (
    <div class={cn("absolute inset-0", props.class)}>
      <div class="mx-auto flex h-full w-full max-w-screen-2xl gap-8 p-8 max-md:flex-col-reverse max-md:overflow-y-auto max-md:overflow-x-hidden max-md:p-4 max-md:pr-1">
        <aside class="flex shrink-0 flex-col gap-4 border border-white/35 bg-white/10 p-4 max-md:contents max-md:h-fit md:h-full md:max-w-72 md:flex-grow md:rounded-2xl">
          <div
            class="flex cursor-pointer items-center gap-3 rounded-xl border border-white/35 bg-white/[.075] transition-colors hover:border-white/50 hover:bg-white/15 max-md:hidden"
            onClick={toSearch}
          >
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

          <div class="relative h-full w-full max-md:contents">
            <div class="-mr-3 flex flex-col gap-4 pr-1 md:absolute md:inset-0 md:overflow-y-auto md:overflow-x-hidden">
              <div class="mt-2 flex items-center gap-2 font-semibold">
                <FaSolidCalendarDay />
                Today
              </div>
              <For each={weather()?.weather.hourly.time ?? []}>
                {(time, i) => {
                  const now = new Date();
                  return (
                    <Show when={time > now}>
                      <Show
                        when={
                          time.getDate() !== now.getDate() &&
                          time.getHours() === 0
                        }
                      >
                        <div class="mt-2 flex items-center gap-2 font-semibold">
                          <FaSolidCalendarDay />
                          {time.getDate() === now.getDate() + 1 ||
                          (time.getDate() === 1 && now.getDate() !== 1)
                            ? "Tomorrow"
                            : time.toLocaleString("en-us", { weekday: "long" })}
                        </div>
                      </Show>
                      <div
                        class="grid w-full grid-cols-[2fr,2fr,2fr] items-center gap-2 border-b border-white/35 pb-3 md:text-sm"
                        classList={{
                          "!border-none":
                            i() ===
                              (weather()?.weather.hourly?.time?.length ?? 0) -
                                1 || time.getHours() === 23,
                        }}
                      >
                        <span>
                          {time.toLocaleString("en-us", { timeStyle: "short" })}
                        </span>
                        <div class="flex items-center gap-2">
                          {weatherCodeToIcon(
                            weather()?.weather.hourly.weather_code?.at(i()),
                          )({
                            size: 16,
                          })}
                          <span class="font-semibold">
                            {formatTemp(
                              weather()?.weather.hourly.temperature?.at(i()),
                            )}
                          </span>
                        </div>
                        <div class="ml-auto flex items-center gap-2 font-semibold">
                          <BsCloudRainFill size={20} />
                          <span class="min-w-10">
                            {Math.round(
                              (weather()?.weather.hourly.precipitation_chance?.at(
                                i(),
                              ) ?? 0) * 10,
                            ) / 10}
                            %
                          </span>
                        </div>
                      </div>
                    </Show>
                  );
                }}
              </For>
            </div>
          </div>
        </aside>

        <main class="flex h-full flex-1 flex-col justify-end gap-1">
          <div
            class="flex cursor-pointer items-center gap-3 rounded-xl border border-white/35 bg-white/[.075] transition-colors hover:border-white/50 hover:bg-white/15 md:hidden"
            onClick={toSearch}
          >
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

          <div class="flex w-full flex-1 justify-end max-md:justify-center">
            {weatherCodeToIcon(weather()?.weather.current.weather_code)({
              size: "16em",
              class:
                "text-white/35 max-md:text-[10px] max-md:mt-8 max-md:mb-4 max-md:text-white",
            })}
          </div>
          <div class="mb-4 flex items-center gap-6 max-md:mb-10 max-md:justify-center">
            <span class="text-8xl font-semibold max-md:text-6xl">
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
              {formatTemp(weather()?.weather.daily.min_temperature?.at(0))}{" "}
            </span>
            low,{" "}
            <span class="font-semibold">
              {formatTemp(weather()?.weather.daily.max_temperature?.at(0))}{" "}
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
          <div class="relative mt-8 h-48 w-full">
            <div class="absolute inset-0 flex gap-4 overflow-x-auto overflow-y-hidden pb-2 max-md:gap-2">
              <For each={weather()?.weather.daily.time ?? []}>
                {(time, i) => (
                  <div
                    class="flex h-full w-32 shrink-0 flex-col items-center gap-4 rounded-xl border border-white/35 bg-white/10 p-2"
                    classList={{
                      "!bg-white/20 !border-white/50": i() === 0,
                    }}
                  >
                    <span class="text-sm font-semibold">
                      {i() === 0
                        ? "Today"
                        : i() === 1
                          ? "Tomorrow"
                          : time.toLocaleString("en-us", { weekday: "long" })}
                    </span>
                    {weatherCodeToIcon(
                      weather()?.weather.daily.weather_code?.at(i()),
                    )({
                      size: 36,
                    })}
                    <div class="flex gap-1 text-sm">
                      <span class="font-semibold">
                        {formatTemp(
                          weather()?.weather.daily.min_temperature?.at(i()),
                        )}{" "}
                      </span>
                      /
                      <span class="font-semibold">
                        {formatTemp(
                          weather()?.weather.daily.max_temperature?.at(i()),
                        )}
                      </span>
                    </div>
                    <div class="mt-auto flex items-center gap-2 font-semibold">
                      <BsCloudRainFill size={20} />
                      {Math.round(
                        (weather()?.weather.daily.precipitation_chance?.at(
                          i(),
                        ) ?? 0) * 10,
                      ) / 10}
                      %
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
