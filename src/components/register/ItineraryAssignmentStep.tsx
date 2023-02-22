import { ArrowRightIcon } from "@heroicons/react/20/solid";
import type { Camp } from "@prisma/client";
import Button from "@ui/Button";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { trpc } from "utils/trpc";
import ItineraryAssignmentForm from "./ItineraryAssignmentForm";

type Props = {
  campId: Camp["id"];
  onBack: () => void;
  onNext: () => void;
};

export default function ItineraryAssignmentStep(props: Props) {
  const session = useSession();
  const { data } = trpc.itinerary.getAll.useQuery({ campId: props.campId });

  const multiTrackItems = useMemo(() => {
    return data?.filter((item) => item.options.length > 0);
  }, [data]);

  const isComplete = useMemo(() => {
    return multiTrackItems?.every((item) =>
      item.options.some((option) =>
        option.members.some(
          (member) => member.userId === session.data?.user?.id
        )
      )
    );
  }, [multiTrackItems, session.data]);

  return (
    <div className="flex flex-grow flex-col">
      <ol className="mb-6 flex-grow">
        {multiTrackItems?.map((item, idx) => (
          <li key={item.id}>
            {idx !== 0 && <hr className="my-6" />}
            <p className="mb-2">
              <span className="mb-2 text-base font-bold">
                {format(new Date(item.date), "iiii")}
              </span>
              <span className="mx-1 text-sm text-gray-400">&bull;</span>
              <span className="mb-2 text-sm font-semibold tracking-wider text-gray-500">
                {format(item.date, "h:mm aa")}
              </span>
            </p>

            <ItineraryAssignmentForm
              options={item.options}
              selectedOption={item.options.find((option) =>
                option.members.find(
                  (member) => member.userId === session.data?.user?.id
                )
              )}
            />
          </li>
        ))}
      </ol>

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
          text="Finish"
          type="button"
          Icon={ArrowRightIcon}
          fullWidth
          className="justify-center"
          disabled={!isComplete}
          onClick={props.onNext}
        />
      </div>
    </div>
  );
}
