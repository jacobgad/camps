import { TrashIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";

type Props = {
  roomId: number;
};

export default function DeleteRoomButton({ roomId }: Props) {
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.room.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} deleted`);
      utils.room.getAll.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button
      intent="danger"
      text="Delete room"
      Icon={TrashIcon}
      fullWidth
      className="justify-center"
      onClick={() => mutate({ id: roomId })}
      isLoading={isLoading}
    />
  );
}
