import type { Member, Room, User } from "@prisma/client";
import Button from "@ui/Button";
import Modal from "@ui/Modal";
import { RadioGroup } from "@ui/RadioGroup";
import UserCard from "@ui/UserCard";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";

type Props = {
  member: Member & {
    user: Pick<User, "name" | "email">;
  };
};

export default function MemberCard({ member }: Props) {
  const router = useRouter();
  const campId = router.query.campId as string;
  const [open, setOpen] = useState(false);

  const { data } = trpc.room.getAll.useQuery(
    { campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <>
      <UserCard
        text={member.user.name ?? member.user.email}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={member.user.name ?? member.user.email}
      >
        <ReallocateRoomForm
          memberId={member.id}
          rooms={data ?? []}
          currentRoomId={member.roomId}
          onSubmit={() => router.back()}
        />
      </Modal>
    </>
  );
}

type ReallocateRoomFormProps = {
  memberId: Member["id"];
  rooms: (Room & {
    members: Member[];
  })[];
  currentRoomId: number;
  onSubmit: () => void;
};

function ReallocateRoomForm(props: ReallocateRoomFormProps) {
  const [roomId, setRoomId] = useState(props.currentRoomId);

  const { mutate, isLoading } = trpc.room.join.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(`Joined ${data.room.name}`);
      props.onSubmit();
    },
  });

  return (
    <div className="flex h-full flex-col">
      <RadioGroup<typeof props.rooms[number]>
        options={props.rooms.filter((room) => room.id !== props.currentRoomId)}
        value={props.rooms.find((room) => room.id === roomId)}
        onChange={(room) => setRoomId(room.id)}
        formatOption={(room) => ({
          id: room.id,
          label: room.name,
          description: `Capacity ${room.members.length}/${room.capacity}`,
          disabled: room.members.length >= room.capacity,
        })}
        className="flex-grow"
      />
      <Button
        text="Reallocate"
        isLoading={isLoading}
        onClick={() => mutate({ memberId: props.memberId, roomId })}
        className="justify-center"
        fullWidth
      />
    </div>
  );
}
