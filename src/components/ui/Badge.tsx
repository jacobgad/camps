type Props = {
  title: string;
};

export default function Badge(props: Props) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
      {props.title}
    </span>
  );
}
