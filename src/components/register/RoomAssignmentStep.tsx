import type { Camp } from "@prisma/client";
import Badge from "@ui/Badge";
import UserCard from "@ui/cards/UserCard";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { trpc } from "utils/trpc";
import RoomAssignmentForm from "./RoomAssignmentForm";

type Props = {
  campId: Camp["id"];
};

export default function RoomAssignmentStep({ campId }: Props) {
  const session = useSession();
  const { data } = trpc.room.getAll.useQuery({ campId });

  return (
    <ul>
      {data?.map((room, idx) => (
        <li key={room.id}>
          <div className="flex justify-between">
            <span>{room.name}</span>
            <Badge
              title={`${room.capacity - room.members.length} open slots`}
            />
          </div>
          <ul className="my-2 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {room.members.map((member) => (
                <motion.li
                  key={member.id}
                  layout
                  transition={{ duration: 0.2 }}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                >
                  <UserCard text={member.user.name ?? "No name"} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <RoomAssignmentForm
            roomId={room.id}
            campId={campId}
            selected={
              !!room.members.find(
                (member) => member.userId === session.data?.user?.id
              )
            }
          />
          {idx !== data.length - 1 && <hr className="my-6" />}
        </li>
      ))}
    </ul>
  );
}
