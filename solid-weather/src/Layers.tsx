import { Component } from "solid-js";
import { Backdrop } from "./layers/Backdrop";
import { Search } from "./layers/Search";
import { Weather } from "./layers/Weather";
import { useStatus } from "./lib/statusContext";

export const Layers: Component<{}> = () => {
  const [status] = useStatus();

  return (
    <div class="relative h-screen w-full overflow-hidden">
      <Backdrop />
      <Search
        class={`transition-opacity duration-300 ${
          status() === "searching"
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
      <Weather
        class={`transition-opacity duration-300 ${
          status() === "selected"
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
    </div>
  );
};
