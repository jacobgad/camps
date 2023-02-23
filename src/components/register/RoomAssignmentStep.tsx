import { ArrowRightIcon } from "@heroicons/react/20/solid";
import type { Camp } from "@prisma/client";
import Badge from "@ui/Badge";
import Button from "@ui/Button";
import UserCard from "@ui/cards/UserCard";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import RoomAssignmentForm from "./RoomAssignmentForm";
import StepInfo from "./StepInfo";

type Props = {
  campId: Camp["id"];
  onNext: () => void;
  onBack: () => void;
};

export default function RoomAssignmentStep(props: Props) {
  const session = useSession();
  const { data } = trpc.room.getAllGender.useQuery({ campId: props.campId });

  const isAllocated = useMemo(() => {
    return !!data?.find((room) =>
      room.members.find((member) => member.userId === session.data?.user?.id)
    );
  }, [data, session]);

  return (
    <div className="flex flex-grow flex-col">
      <div className="max-h-screen flex-grow overflow-auto">
        <StepInfo
          title="Your room"
          description="Select which room you would like to stay in for the duration of the camp"
        />
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
                campId={props.campId}
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
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          text="Back"
          type="button"
          intent="secondary"
          fullWidth
          className="justify-center"
          onClick={props.onBack}
        />

        <Button
          text="Next"
          type="button"
          Icon={ArrowRightIcon}
          fullWidth
          className="justify-center"
          disabled={!isAllocated}
          onClick={props.onNext}
        />
      </div>
    </div>
  );
}
