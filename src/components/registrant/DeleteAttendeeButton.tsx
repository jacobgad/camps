import type { ButtonProps } from "@ui/Button";
import { TrashIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

type Props = {
  registrantId: number;
  disabled?: ButtonProps["disabled"];
};

export default function DeleteRegistrantButton({
  registrantId,
  disabled,
}: Props) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.registrant.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} deleted`);
      router.back();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button
      intent="danger"
      text="Delete attendee"
      Icon={TrashIcon}
      fullWidth
      className="justify-center"
      onClick={() => mutate({ id: registrantId })}
      isLoading={isLoading}
      disabled={disabled}
    />
  );
}
