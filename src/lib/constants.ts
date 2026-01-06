export const CATEGORIES = [
  "Electronics",
  "Tools & Equipment",
  "Sports & Outdoors",
  "Home & Garden",
  "Furniture",
  "Vehicles",
  "Clothing & Accessories",
  "Books & Media",
  "Party & Events",
  "Other",
] as const;

export const ITEM_CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
] as const;

export const SORT_OPTIONS = [
  { value: "nearest", label: "Nearest First" },
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

export const QUICK_REPLIES = [
  "Is this still available?",
  "When can I pick up?",
  "I'm running late",
  "Thanks!",
] as const;

export const PICKUP_WINDOWS = [
  "Flexible",
  "Mornings (6am - 12pm)",
  "Afternoons (12pm - 6pm)",
  "Evenings (6pm - 10pm)",
  "Weekdays Only",
  "Weekends Only",
  "By Appointment",
] as const;
