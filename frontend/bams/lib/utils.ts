import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { backEndErrors } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const compileFrontendErrors = (backendErrors: backEndErrors) => {
  let frontendErrors = {};
  for (const field in backendErrors) {
    if (backendErrors.hasOwnProperty(field)) {
      (frontendErrors as any)[field] = backendErrors[field].join(", ");
    }
  }
  return frontendErrors;
};
