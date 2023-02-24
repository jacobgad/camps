import type { Team } from "@prisma/client";
import Card from "@ui/cards/Card";
import { motion } from "framer-motion";

type Props = {
  teams: Team[];
};

export default function TeamScoreBoard({ teams }: Props) {
  teams.sort((a, b) => b.points - a.points);
  const max = Math.max(...teams.map((team) => team.points));

  return (
    <Card className="bg-white">
      <ol className="flex flex-col gap-3">
        {teams.map((team) => (
          <li key={team.id}>
            <ProgressBar percentage={(team.points / max) * 100} team={team} />
          </li>
        ))}
      </ol>
    </Card>
  );
}

type ProgressBarProps = {
  team: Team;
  percentage: number;
};

function ProgressBar({ team, percentage }: ProgressBarProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-sm">{team.name}</span>
        <span className="text-sm">{team.points}</span>
      </div>
      <div className="overflow-hidden rounded-full bg-gray-200 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage || 5}%` }}
          transition={{ duration: 0.5 }}
          className={"h-4 rounded-full " + team.color}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
