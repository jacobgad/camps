export type ItineraryType = "singleTrack" | "multiTrack";

type ItineraryTypeOption = {
  label: string;
  value: ItineraryType;
  description: string;
};

type Props = {
  value: ItineraryType;
  onChange: (type: ItineraryType) => void;
};

const itineraryTypeOptions: ItineraryTypeOption[] = [
  {
    label: "Single-Track",
    value: "singleTrack",
    description: "All registrants are automatically assigned in this session",
  },
  {
    label: "Multi-Track",
    value: "multiTrack",
    description:
      "Registrants can select between multiple sessions occurring at the same time",
  },
];

export default function ItineraryItemForm({ value, onChange }: Props) {
  return (
    <fieldset className="mb-6 text-sm font-medium text-gray-700">
      <legend className="mb-2">Itinerary type</legend>
      {itineraryTypeOptions.map((type, idx) => (
        <div key={type.value} className={`${idx > 0 && "mt-4"}`}>
          <input
            type="radio"
            name="itineraryType"
            id={type.value}
            checked={value === type.value}
            onChange={() => onChange(type.value)}
            className="transition"
          />
          <label htmlFor={type.value} className="ml-2 align-middle">
            {type.label}
          </label>
          <p className="mt-1 font-normal text-gray-500">{type.description}</p>
        </div>
      ))}
    </fieldset>
  );
}
