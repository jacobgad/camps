import type { GetServerSideProps, NextPage } from "next";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import CampDetailsForm from "components/camp/CampDetailsForm";
import { isAuthed } from "utils/auth";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const NewCamp: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;

  const { data } = trpc.camp.get.useQuery(
    { id: campId },
    {
      onError: (error) => {
        toast.error(error.message);
        router.back();
      },
    }
  );

  const { mutate, isLoading } = trpc.camp.update.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(`Camp ${data.name} updated`);
      router.push(`/camps/${data.id}/admin`);
    },
  });

  return (
    <Layout>
      <h1>Details</h1>
      {data && (
        <CampDetailsForm
          defaultValues={data}
          onSubmit={(data) => mutate({ ...data, id: campId })}
          isLoading={isLoading}
          buttonText="Save changes"
        />
      )}
    </Layout>
  );
};

export default NewCamp;
