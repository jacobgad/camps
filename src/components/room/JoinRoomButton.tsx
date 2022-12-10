import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { Room } from "@prisma/client";
import toast from "react-hot-toast";
import { trpc } from "utils/trpc";

type Props = {
  room: Room;
};

export default function JoinRoomButton({ room }: Props) {
  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.room.join.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => utils.room.getAll.invalidate(),
  });

  return (
    <button
      onClick={() => mutate({ roomId: room.id })}
      disabled={isLoading}
      className="mt-2 flex w-full items-center justify-center rounded-lg border border-gray-300 bg-indigo-50 py-4 text-sm font-semibold text-indigo-500 disabled:bg-gray-200 disabled:text-gray-500"
    >
      <span className={isLoading ? "opacity-0" : ""}>Join Room</span>
      {isLoading && <ArrowPathIcon className="absolute h-5 animate-spin" />}
    </button>
  );
}
