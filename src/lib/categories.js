export const CATEGORIES = [
  { value: "haushalt",    label: "Haushalt",     emoji: "🏠" },
  { value: "garten",     label: "Garten",        emoji: "🌿" },
  { value: "handwerk",   label: "Handwerk",      emoji: "🔧" },
  { value: "umzug",      label: "Umzug",         emoji: "📦" },
  { value: "einkaufen",  label: "Einkaufen",     emoji: "🛒" },
  { value: "begleitung", label: "Begleitung",    emoji: "🤝" },
  { value: "pflege",     label: "Pflege",        emoji: "❤️" },
  { value: "transport",  label: "Transport",     emoji: "🚗" },
  { value: "tier",            label: "Tier",             emoji: "🐾" },
  { value: "kinderbetreuung",label: "Kinderbetreuung",  emoji: "🧒" },
  { value: "technik",        label: "Computer & Technik",emoji: "💻" },
  { value: "nachhilfe",      label: "Nachhilfe",        emoji: "📚" },
  { value: "renovierung",    label: "Renovierung",      emoji: "🚿" },
  { value: "sonstiges",      label: "Sonstiges",        emoji: "✨" },
];

export function categoryLabel(value) {
  return CATEGORIES.find(c => c.value === value) || null;
}
