import type { ButtonProps } from "@ui/Button";
import { TrashIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

type Props = {
  teamId: number;
  disabled: ButtonProps["disabled"];
};

export default function DeleteTeamButton({ teamId, disabled }: Props) {
  const router = useRouter();
  const { mutate, isLoading } = trpc.team.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} deleted`);
      router.back();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Button
      intent="danger"
      text="Delete team"
      Icon={TrashIcon}
      fullWidth
      className="justify-center"
      onClick={() => mutate({ id: teamId })}
      isLoading={isLoading}
      disabled={disabled}
    />
  );
}
