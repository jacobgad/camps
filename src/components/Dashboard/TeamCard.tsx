import { UserGroupIcon } from "@heroicons/react/24/outline";
import type { Team } from "@prisma/client";
import Card from "@ui/cards/Card";

type Props = {
  team: Team;
};

export default function TeamCard({ team }: Props) {
  return (
    <Card className="flex items-center justify-between bg-white">
      <span className="flex items-center gap-2 ">
        <UserGroupIcon className="h-8" />
        Team: {team.name}
      </span>
      <div
        className={`h-8 w-8 rounded-full ${team.color}`}
        style={{ backgroundColor: team.color }}
      />
    </Card>
  );
}
