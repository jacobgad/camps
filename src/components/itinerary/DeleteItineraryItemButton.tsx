import type { ButtonProps } from "@ui/Button";
import Button from "@ui/Button";
import { TrashIcon } from "@heroicons/react/20/solid";
import { trpc } from "utils/trpc";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

type Props = {
  itineraryItemId: number;
} & Partial<ButtonProps>;

export default function DeleteItineraryItemButton(props: Props) {
  const { itineraryItemId, ...buttonProps } = props;
  const router = useRouter();
  const campId = router.query.campId as string;

  const { mutate, isLoading } = trpc.itinerary.delete.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(`${data.name} deleted`);
      router.push(`/camps/${campId}/admin/itinerary`);
    },
  });

  return (
    <Button
      {...buttonProps}
      intent="danger"
      text="Delete session"
      Icon={TrashIcon}
      isLoading={isLoading}
      onClick={() => mutate({ id: itineraryItemId })}
      className="mt-4 justify-center"
    />
  );
}
