import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { PlusIcon } from "@heroicons/react/20/solid";
import Layout from "components/layout/Layout";
import OrganiserForm from "components/organiser/OrganiserForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

export default function Page() {
  const router = useRouter();
  const campId = router.query.campId as string;

  const { mutate, isLoading } = trpc.organiser.create.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} Created`);
      router.push(`/camps/${campId}/admin/organisers`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Organisers</h1>

      <OrganiserForm
        onSubmit={mutate}
        defaultValues={{ campId }}
        buttonProps={{ isLoading, Icon: PlusIcon, text: "Add new room" }}
      />
    </Layout>
  );
}
