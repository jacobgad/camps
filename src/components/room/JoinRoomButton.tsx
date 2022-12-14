import type { Member, Room } from "@prisma/client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { trpc } from "utils/trpc";

type Props = {
  memberId: Member["id"];
  roomId: Room["id"];
  disabled?: boolean;
  onSubmit: (data: Member) => void;
};

export default function JoinRoomButton({ roomId, memberId, ...props }: Props) {
  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.room.join.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      props.onSubmit(data);
      utils.room.getAll.invalidate();
    },
  });

  return (
    <button
      onClick={() => memberId !== undefined && mutate({ roomId, memberId })}
      disabled={isLoading || props.disabled}
      className="mt-2 flex w-full items-center justify-center rounded-lg border border-gray-300 bg-indigo-50 py-4 text-sm font-semibold text-indigo-500 disabled:bg-gray-200 disabled:text-gray-500"
    >
      <span className={isLoading ? "opacity-0" : ""}>Move to this room</span>
      {isLoading && <ArrowPathIcon className="absolute h-5 animate-spin" />}
    </button>
  );
}
