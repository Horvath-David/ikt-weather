import { Component, createEffect } from "solid-js";
import { cn } from "~/lib/utils";
import { useWeather } from "~/lib/weatherContext";

export const Weather: Component<{ class?: string }> = (props) => {
  const [weather] = useWeather();

  createEffect(() => console.log(weather()));

  return <div class={cn("absolute inset-0", props.class)}></div>;
};
