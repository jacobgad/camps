import { UserGroupIcon } from "@heroicons/react/24/outline";
import Card from "@ui/cards/Card";
import type { sycTeams } from "utils/sycTeams";

type Props = {
  team: typeof sycTeams[number];
};

export default function TeamCard({ team }: Props) {
  return (
    <Card className="flex items-center justify-between bg-white">
      <span className="flex items-center gap-2 ">
        <UserGroupIcon className="h-8" />
        Team: {team.name}
      </span>
      <div
        className="h-8 w-8 rounded-full"
        style={{ backgroundColor: team.color }}
      />
    </Card>
  );
}
