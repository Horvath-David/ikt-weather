import { Component } from "solid-js";
import { cn } from "~/lib/utils";

export const Weather: Component<{ class?: string }> = (props) => {
  return <div class={cn("absolute inset-0", props.class)}></div>;
};
