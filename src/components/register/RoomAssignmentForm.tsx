import { CheckCircleIcon } from "@heroicons/react/20/solid";
import type { Camp, Room } from "@prisma/client";
import Button from "@ui/Button";
import { trpc } from "utils/trpc";

type Props = {
  campId: Camp["id"];
  roomId: Room["id"];
  selected: boolean;
};

export default function RoomAssignmentForm(props: Props) {
  const utils = trpc.useContext();
  const { mutate } = trpc.member.upsert.useMutation({
    onSuccess: () => utils.room.getAll.invalidate(),
  });

  return (
    <Button
      text="Join room"
      intent={props.selected ? "primary" : "secondary"}
      Icon={props.selected ? CheckCircleIcon : undefined}
      fullWidth
      size="large"
      className="justify-center"
      onClick={() =>
        !props.selected &&
        mutate({ roomId: props.roomId, campId: props.campId })
      }
    />
  );
}
