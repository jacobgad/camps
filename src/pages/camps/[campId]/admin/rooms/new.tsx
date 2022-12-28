import type { GetServerSideProps, NextPage } from "next";
import RoomForm from "components/room/RoomForm";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import { PlusIcon } from "@heroicons/react/20/solid";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;

  const { mutate, isLoading } = trpc.room.create.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} Created`);
      router.push(`/camps/${campId}/admin/rooms`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Rooms</h1>

      <RoomForm
        onSubmit={mutate}
        defaultValues={{ campId }}
        buttonProps={{ isLoading, Icon: PlusIcon, text: "Add new room" }}
      />
    </Layout>
  );
};

export default Page;
