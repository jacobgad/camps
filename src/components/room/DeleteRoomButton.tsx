import type { ButtonProps } from "@ui/Button";
import { TrashIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

type Props = {
  roomId: number;
  disabled: ButtonProps["disabled"];
};

export default function DeleteRoomButton({ roomId, disabled }: Props) {
  const utils = trpc.useContext();
  const router = useRouter();

  const { mutate, isLoading } = trpc.room.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} deleted`);
      utils.room.getAll.invalidate();
      router.back();
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
      disabled={disabled}
    />
  );
}
