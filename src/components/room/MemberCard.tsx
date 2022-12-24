import type { Member, User } from "@prisma/client";
import Modal from "@ui/Modal";
import UserCard from "@ui/UserCard";
import { useState } from "react";

type Props = {
  member: Member & {
    user: Pick<User, "name" | "email">;
  };
};

export default function MemberCard({ member }: Props) {
  const [open, setOpen] = useState(false);

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
        Room1
      </Modal>
    </>
  );
}
