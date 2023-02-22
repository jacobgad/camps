import type { ItineraryOption } from "@prisma/client";
import ItemCard from "@ui/cards/ItemCard";
import { useSession } from "next-auth/react";
import { trpc } from "utils/trpc";

type Props = {
  selectedOption?: ItineraryOption;
  options: (ItineraryOption & {
    members: {
      id: number;
      userId: string;
    }[];
  })[];
};

export default function ItineraryAssignmentForm(props: Props) {
  const session = useSession();
  const utils = trpc.useContext();

  const { mutate } = trpc.itinerary.join.useMutation({
    onSuccess: () => utils.itinerary.getAll.invalidate(),
  });

  return (
    <ol className="flex flex-col gap-2">
      {props.options.map((option) => (
        <li key={option.id} onClick={() => mutate({ id: option.id })}>
          <ItemCard
            selected={option.members.some(
              (member) => member.userId === session.data?.user?.id
            )}
            disabled={
              option.capacity <= option.members.length &&
              !option.members.some(
                (member) => member.userId === session.data?.user?.id
              )
            }
            label={option.name}
            description={option.description ?? ""}
          />
        </li>
      ))}
    </ol>
  );
}
