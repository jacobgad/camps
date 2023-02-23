import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import PersonalInformationForm from "./PersonalInformationForm";
import StepInfo from "./StepInfo";

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
    <>
      <StepInfo
        title="Personal information"
        description="Your information is only accessible to the event organisers, and will not be shared publicly."
      />
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
    </>
  );
}
