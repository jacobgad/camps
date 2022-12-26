import Card from "./Card";

type InputCardProps = {
  label: string;
  description: string;
  className?: string;
};

export default function ItemCard(props: InputCardProps) {
  return (
    <Card className={props.className}>
      <p className="text-sm font-semibold">{props.label}</p>
      <p className="text-sm font-normal text-gray-500">{props.description}</p>
    </Card>
  );
}
