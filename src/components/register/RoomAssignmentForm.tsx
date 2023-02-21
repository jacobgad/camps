import { CheckCircleIcon } from "@heroicons/react/20/solid";
import type { Camp, Room } from "@prisma/client";
import Button from "@ui/Button";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";

type Props = {
  campId: Camp["id"];
  roomId: Room["id"];
  selected: boolean;
};

export default function RoomAssignmentForm(props: Props) {
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.member.upsert.useMutation({
    onSuccess: () => utils.room.getAll.invalidate(),
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button
      text="Join room"
      intent={props.selected ? "primary" : "secondary"}
      Icon={props.selected ? CheckCircleIcon : undefined}
      fullWidth
      size="large"
      className="justify-center"
      isLoading={isLoading}
      onClick={() =>
        !props.selected &&
        mutate({ roomId: props.roomId, campId: props.campId })
      }
    />
  );
}
