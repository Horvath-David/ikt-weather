import { type ClassValue, clsx } from "clsx";
import { IconTypes } from "solid-icons";
import {
  BsCloudDrizzleFill,
  BsCloudFogFill,
  BsCloudLightningRainFill,
  BsCloudRainFill,
  BsCloudRainHeavyFill,
  BsCloudSnowFill,
  BsCloudSunFill,
} from "solid-icons/bs";
import { FaSolidQuestion } from "solid-icons/fa";
import { TbSunFilled } from "solid-icons/tb";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemp(temp: number | undefined | null) {
  const rounded = Math.round((temp ?? 0) * 10) / 10;
  return temp ? `${rounded}°C` : `-°C`;
}

export function weatherCodeToIcon(weatherCode: number | undefined): IconTypes {
  if (weatherCode === undefined) return FaSolidQuestion;

  if (weatherCode === 0) return TbSunFilled;
  if (weatherCode <= 3) return BsCloudSunFill;
  if (weatherCode <= 48) return BsCloudFogFill;
  if (weatherCode <= 55) return BsCloudDrizzleFill;
  if (weatherCode <= 65) return BsCloudRainFill;
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return BsCloudSnowFill;
  if (weatherCode <= 82) return BsCloudRainHeavyFill;
  if (weatherCode <= 99) return BsCloudLightningRainFill;

  return FaSolidQuestion;
}

export function degreesToCompass(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalizedDegrees / 22.5) % 16;

  return directions[index];
}
