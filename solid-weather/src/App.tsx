import { StatusProvider } from "./lib/statusContext";
import { WeatherProvider } from "./lib/weatherContext";
import { Layers } from "./Layers";
import { Toaster } from "./components/ui/sonner";

export function App() {
  return (
    <>
      <Toaster />
      <StatusProvider initial="searching">
        <WeatherProvider>
          <Layers />
        </WeatherProvider>
      </StatusProvider>
    </>
  );
}
