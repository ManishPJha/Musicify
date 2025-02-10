import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// converts the time to format 0:00
export const getTime = (time: number) =>
  `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;
