import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Card from "./Card";

type InputCardProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  description: string;
};

export default function ItemCard(props: InputCardProps) {
  return (
    <Card
      selected={props.selected}
      disabled={props.disabled}
      className="flex items-center justify-between transition"
    >
      <div>
        <p className="text-sm font-semibold">{props.label}</p>
        <p
          className={`text-sm font-normal ${
            props.selected ? "text-indigo-100" : "text-gray-500"
          }`}
        >
          {props.description}
        </p>
      </div>
      <CheckCircleIcon
        className={`h-6 text-indigo-50 transition ${
          !props.selected && "opacity-0"
        }`}
      />
    </Card>
  );
}
