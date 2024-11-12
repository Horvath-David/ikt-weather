import { Component } from "solid-js";

export const Backdrop: Component<{}> = () => {
  return (
    <div class="absolute inset-0 bg-gradient-to-b from-blue-500/75 to-orange-500"></div>
  );
};
