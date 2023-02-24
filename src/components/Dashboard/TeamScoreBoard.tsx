import Card from "@ui/cards/Card";

export default function TeamScoreBoard() {
  return (
    <Card className="bg-white">
      <ol className="flex flex-col gap-2">
        <li>
          <ProgressBar
            percentage={20}
            className="bg-orange-500"
            name="Orange"
          />
        </li>
        <li>
          <ProgressBar percentage={80} className="bg-blue-500" name="Blue" />
        </li>
        <li>
          <ProgressBar percentage={50} className="bg-yellow-700" name="Brown" />
        </li>
      </ol>
    </Card>
  );
}

type ProgressBarProps = {
  name: string;
  percentage: number;
  className: string;
};

function ProgressBar(props: ProgressBarProps) {
  return (
    <div>
      <span className="text-sm">{props.name}</span>
      <span className="text-sm">{}</span>
      <div className="overflow-hidden rounded-full bg-gray-200 shadow-inner">
        <div
          className={"h-4 rounded-full " + props.className}
          style={{ width: `${props.percentage}%` }}
        />
      </div>
    </div>
  );
}
