import type { GetServerSideProps, NextPage } from "next";
import CreateItineraryItemForm from "components/itinerary/ItineraryItemForm";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import { toast } from "react-hot-toast";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.itinerary.create.useMutation({
    onSuccess: () => {
      utils.itinerary.getAll.invalidate();
      router.push(`/camps/${campId}/admin/itinerary`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <main className="flex flex-col p-4">
      <h1 className="mb-6">Itinerary</h1>
      <CreateItineraryItemForm
        campId={campId}
        isLoading={isLoading}
        onSubmit={mutate}
      />
    </main>
  );
};

export default Page;
