import type { Room } from "@prisma/client";
import { KeyIcon } from "@heroicons/react/24/outline";
import Card from "@ui/cards/Card";

type Props = {
  room: Room;
};

export default function RoomCard({ room }: Props) {
  return (
    <Card className="flex items-center justify-between bg-white">
      <span className="flex items-center gap-2 ">
        <KeyIcon className="h-8" />
        {room.name}
      </span>
      <span className="text font-medium text-indigo-600">
        Code: {room.code}
      </span>
    </Card>
  );
}
