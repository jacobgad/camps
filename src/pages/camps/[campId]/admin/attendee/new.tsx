import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { PlusIcon } from "@heroicons/react/20/solid";
import Layout from "components/layout/Layout";
import AttendeeForm from "components/attendee/AttendeeForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;

  const { mutate, isLoading } = trpc.attendee.create.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} Created`);
      router.push(`/camps/${campId}/admin/attendee`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Attendee</h1>

      <AttendeeForm
        campId={campId}
        onSubmit={mutate}
        buttonProps={{ isLoading, Icon: PlusIcon, text: "Add new attendee" }}
      />
    </Layout>
  );
};

export default Page;
