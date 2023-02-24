import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { PlusIcon } from "@heroicons/react/20/solid";
import Layout from "components/layout/Layout";
import TeamForm from "components/team/TeamForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;

  const { mutate, isLoading } = trpc.team.create.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} Created`);
      router.push(`/camps/${campId}/admin/teams`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Teams</h1>

      <TeamForm
        onSubmit={mutate}
        defaultValues={{ campId, points: 0 }}
        buttonProps={{ isLoading, Icon: PlusIcon, text: "Add new team" }}
      />
    </Layout>
  );
};

export default Page;
