import type { GetServerSideProps, NextPage } from "next";
import RoomForm from "components/room/RoomForm";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const roomId = Number(router.query.roomId as string);

  const { data } = trpc.room.get.useQuery(
    { id: roomId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const { mutate, isLoading } = trpc.room.update.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} updated`);
      router.push(`/camps/${campId}/admin/rooms`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <main className="flex flex-col px-4 py-8">
      <h1 className="mb-6">Rooms</h1>

      {data && (
        <div>
          <RoomForm
            onSubmit={(data) => mutate({ ...data, id: roomId })}
            defaultValues={data}
            buttonProps={{ text: "Save changes", isLoading }}
          />
        </div>
      )}
    </main>
  );
};

export default Page;
