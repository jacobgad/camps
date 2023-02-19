import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import PersonalInformationForm from "./PersonalInformationForm";

type Props = {
  onComplete: () => void;
};

export default function PersonalInformationStep(props: Props) {
  const user = trpc.user.get.useQuery();
  const { mutate, isLoading } = trpc.user.update.useMutation({
    onSuccess: () => props.onComplete(),
    onError: (error) => toast.error(error.message),
  });

  return (
    <PersonalInformationForm
      defaultValues={{
        name: user.data?.name ?? undefined,
        email: user.data?.email,
        dob: user.data?.dob ?? undefined,
        phone: user.data?.phone ?? undefined,
        gender: user.data?.gender ?? undefined,
      }}
      onSubmit={mutate}
      buttonProps={{ isLoading }}
    />
  );
}
