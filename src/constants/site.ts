/**
 * Central brand/site configuration sourced from Organic Arogya's existing
 * print materials (Post Card.jpeg). Update SITE_CONFIG.logo once a real
 * high-res SVG/PNG logo file is supplied.
 */
export const SITE_CONFIG = {
  name: "Organic Arogya",
  tagline: "True Ayurveda, True Wellness",
  sanskritTagline: "सर्वे सन्तु निरामया",
  description:
    "Premium Ayurvedic wellness products crafted from ancient Indian herbal wisdom and modern science.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.organicarogya.com",
  email: "info@organicarogya.com",
  phones: ["+91 72729 09006", "+91 82909 44433"],
  whatsapp: "917272909006",
  address: {
    office: "31/441, Pratap Nagar, Sanganer, Jaipur - 302 033, INDIA",
    plant: "Plant & Export: Chavan Rishi Ashram, Goner, Jaipur - 303 905, INDIA",
  },
  social: {
    instagram: "https://instagram.com/organicarogya",
    facebook: "https://facebook.com/organicarogya",
    twitter: "https://twitter.com/organicarogya",
    youtube: "https://youtube.com/@organicarogya",
  },
  productCategories: [
    "Ayurvedic Herbal Juices",
    "Ayurvedic Beauty & Wellness",
    "Floral & Herbal Hydrosols",
    "Herbal Wellness Powder",
    "Green Insect Repellent",
    "Botanical Oral Health",
  ],
} as const;

export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", locale: "en-IN" },
  USD: { code: "USD", symbol: "$", locale: "en-US" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
