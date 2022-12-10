import toast from "react-hot-toast";
import { trpc } from "utils/trpc";

type Props = {
  roomId: number;
};

export default function JoinRoomButton({ roomId }: Props) {
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.room.join.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => utils.room.getAll.invalidate(),
  });

  return (
    <button
      onClick={() => mutate({ roomId })}
      disabled={isLoading}
      className="font-sm mt-2 w-full rounded-lg border border-gray-300 bg-indigo-50 py-4 font-semibold text-indigo-500"
    >
      Join Room
    </button>
  );
}
