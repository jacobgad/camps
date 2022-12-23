import type { GetServerSideProps, NextPage } from "next";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import CampDetailsForm from "components/camp/CampDetailsForm";
import { isAuthed } from "utils/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const NewCamp: NextPage = () => {
  const router = useRouter();
  const campId = router.query.id as string;

  const { data } = trpc.camp.get.useQuery(
    { id: campId },
    {
      onError: (error) => {
        toast.error(error.message);
        router.back();
      },
    }
  );

  const { mutate, isLoading } = trpc.camp.create.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(`Camp ${data.name} created`);
      router.push(`/camps/${data.id}/admin`);
    },
  });

  return (
    <main className="flex flex-col px-4 py-8">
      <h1>Details</h1>
      {data && (
        <CampDetailsForm
          defaultValues={data}
          onSubmit={mutate}
          isLoading={isLoading}
          buttonText="Save changes"
        />
      )}
    </main>
  );
};

export default NewCamp;
