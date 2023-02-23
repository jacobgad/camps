type Props = {
  title: string;
  description: string;
};

export default function StepInfo({ title, description }: Props) {
  return (
    <>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      <p className="mt-1 mb-6 text-sm font-normal text-gray-500">
        {description}
      </p>
    </>
  );
}
