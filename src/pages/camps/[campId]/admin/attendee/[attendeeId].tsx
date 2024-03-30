import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import Layout from "components/layout/Layout";
import AttendeeForm from "components/attendee/AttendeeForm";
import DeleteAttendeeButton from "components/attendee/DeleteAttendeeButton";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

export default function Page() {
  const router = useRouter();
  const campId = router.query.campId as string;
  const attendeeId = Number(router.query.attendeeId as string);

  const { data } = trpc.attendee.get.useQuery(
    { id: attendeeId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const { mutate, isLoading } = trpc.attendee.update.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} updated`);
      router.push(`/camps/${campId}/admin/attendee`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Teams</h1>

      {data && (
        <div>
          <AttendeeForm
            campId={campId}
            onSubmit={(data) => mutate({ ...data, id: attendeeId })}
            defaultValues={data}
            buttonProps={{ text: "Save changes", isLoading }}
          />
        </div>
      )}

      <div className="mt-4">
        {data && <DeleteAttendeeButton attendeeId={attendeeId} />}
      </div>
    </Layout>
  );
}
