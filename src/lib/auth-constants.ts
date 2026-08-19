import type { Profession } from "@/lib/database.types";

export const PROFESSIONS = [
  { value: "artisan", label: "Artisan", emoji: "🧑‍🎨" },
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "creator", label: "Creator", emoji: "🎬" },
] as const;

export const ODISHA_DISTRICTS = [
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghapur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Keonjhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
] as const;

export const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export const RESERVED_USERNAMES = [
  "login",
  "signup",
  "dashboard",
  "auth",
  "api",
  "admin",
  "about",
  "contact",
  "pricing",
  "faq",
  "blog",
  "help",
  "support",
  "docs",
  "status",
  "www",
  "mail",
  "terms",
  "privacy",
];

export const PROFESSION_LABELS: Record<Profession, string> = {
  artisan: "Artisan",
  professional: "Professional",
  creator: "Creator",
};

export function isReservedUsername(username: string) {
  return RESERVED_USERNAMES.includes(username.toLowerCase());
}

export function normalizeUsername(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
}