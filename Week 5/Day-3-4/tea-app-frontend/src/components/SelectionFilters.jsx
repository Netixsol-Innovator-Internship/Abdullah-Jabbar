import FilterDropdown from "./Filter";

export default function SelectionFilters() {
  // Defined options for each category
  const collectionOptions = [
    "Black Teas",
    "Green Teas",
    "White Teas",
    "Chai",
    "Matcha",
    "Herbal Teas",
    "Oolong",
    "Rooibos",
    "Teaware"
  ];

  const originOptions = ["India", "Japan", "Iran", "South Africa"];

  const flavorOptions = [
    "Spicy",
    "Sweet",
    "Citrus",
    "Smooth",
    "Fruity",
    "Floral",
    "Grassy",
    "Minty",
    "Bitter",
    "Creamy"
  ];

  const qualitiesOptions = ["Detox", "Energy", "Relax", "Digestion"];

  const caffeineOptions = ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"];

  const allergensOptions = ["Lactose-Free", "Gluten-Free", "Nuts-Free", "Soy-Free"];

  return (
    <div className="max-w-54">
      <FilterDropdown title="Collection" options={collectionOptions} />
      <FilterDropdown title="Origin" options={originOptions} />
      <FilterDropdown title="Flavor" options={flavorOptions} />
      <FilterDropdown title="Qualities" options={qualitiesOptions} />
      <FilterDropdown title="Caffeine" options={caffeineOptions} />
      <FilterDropdown title="Allergens" options={allergensOptions} />
    </div>
  );
}
