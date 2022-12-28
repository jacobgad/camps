import type { GetServerSideProps, NextPage } from "next";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import CampDetailsForm from "components/camp/CampDetailsForm";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const NewCamp: NextPage = () => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.camp.create.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(`Camp ${data.name} created`);
      router.push(`/camps/${data.id}/admin`);
    },
  });

  return (
    <Layout>
      <h1>New Camp</h1>
      <CampDetailsForm isLoading={isLoading} onSubmit={mutate} />
    </Layout>
  );
};

export default NewCamp;
