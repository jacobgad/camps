import { ArrowRightIcon } from "@heroicons/react/20/solid";
import type { Camp } from "@prisma/client";
import Button, { type ButtonProps } from "@ui/Button";
import Badge from "@ui/Badge";
import UserCard from "@ui/cards/UserCard";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import RoomAssignmentForm from "./RoomAssignmentForm";
import StepInfo from "./StepInfo";

type Props = {
  campId: Camp["id"];
  nextButtonProps: Partial<ButtonProps>;
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
      <div className="flex-grow overflow-auto">
        <StepInfo
          title="Your room"
          description="Select which room you would like to stay in for the duration of the camp"
        />
        <ul>
          {data?.map((room, idx) => (
            <li key={room.id}>
              <div className="flex items-center">
                <span>{room.name}</span>
                {room.type === "servant" && (
                  <span className="ml-3 rounded-full bg-orange-300 px-2.5 py-0.5 text-xs font-medium text-orange-900">
                    Servant Room
                  </span>
                )}
                <div className="ml-auto">
                  <Badge
                    title={`${room.capacity - room.members.length} open slots`}
                  />
                </div>
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

      <div className="sticky bottom-0 -mb-8 flex gap-2 bg-gray-50 py-6">
        <Button
          text="Back"
          type="button"
          intent="secondary"
          fullWidth
          className="justify-center"
          onClick={props.onBack}
        />

        <Button
          {...props.nextButtonProps}
          text={props.nextButtonProps.text ?? "Next"}
          type={props.nextButtonProps.type ?? "button"}
          Icon={props.nextButtonProps.Icon ?? ArrowRightIcon}
          disabled={!isAllocated || props.nextButtonProps.disabled}
          onClick={props.nextButtonProps.onClick}
          fullWidth
          className="justify-center"
        />
      </div>
    </div>
  );
}
