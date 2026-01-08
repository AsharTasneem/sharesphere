import { type ClassValue, clsx } from "clsx";
import { Item, PricingBreakdown } from "./types";
import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return clsx(inputs);
// }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePricing(
  pricePerDay: number,
  deposit: number,
  startDate: Date,
  endDate: Date
): PricingBreakdown {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const rentalFee = pricePerDay * days;
  const serviceFee = rentalFee * 0.15; // 15%
  const total = rentalFee + serviceFee + deposit;

  return { days, rentalFee, serviceFee, deposit, total };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDate(d);
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function isValidDateRange(
  startDate: Date,
  endDate: Date,
  item: Item
): { valid: boolean; error?: string } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (startDate < now) {
    return { valid: false, error: "Start date cannot be in the past" };
  }

  if (endDate <= startDate) {
    return { valid: false, error: "End date must be after start date" };
  }

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days < 1) {
    return { valid: false, error: "Minimum rental period is 1 day" };
  }
  if (days > 30) {
    return { valid: false, error: "Maximum rental period is 30 days" };
  }

  // Check blocked dates
  if (item.availability.blockedDates) {
    const blocked = item.availability.blockedDates.some((blockedDate) => {
      const blocked = new Date(blockedDate);
      blocked.setHours(0, 0, 0, 0);
      return blocked >= startDate && blocked <= endDate;
    });
    if (blocked) {
      return {
        valid: false,
        error: "Selected dates include unavailable dates",
      };
    }
  }

  return { valid: true };
}
