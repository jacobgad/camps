import Card from "./Card";

type InputCardProps = {
  label: string;
  description: string;
};

export default function ItemCard({ label, description }: InputCardProps) {
  return (
    <Card>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-sm font-normal text-gray-500">{description}</p>
    </Card>
  );
}
