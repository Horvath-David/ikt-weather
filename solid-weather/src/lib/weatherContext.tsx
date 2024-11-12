import {
  Accessor,
  Component,
  createContext,
  createSignal,
  ParentProps,
  Setter,
  useContext,
} from "solid-js";
import { WeatherData } from "./models";

type WeatherContextType = [
  stats: Accessor<WeatherData | undefined>,
  setStatus: Setter<WeatherData | undefined>,
];

const WeatherContext = createContext<WeatherContextType>();

export const WeatherProvider: Component<ParentProps> = (props) => {
  const ctxData = createSignal<WeatherData>();

  return (
    <WeatherContext.Provider value={ctxData}>
      {props.children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext)!;
