import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import Layout from "components/layout/Layout";
import DeleteAttendeeButton from "components/registrant/DeleteAttendeeButton";
import RegistrantForm from "components/registrant/AttendeeForm";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

export default function Page() {
  const router = useRouter();
  const campId = router.query.campId as string;
  const registrantId = Number(router.query.registrantId as string);

  const { data } = trpc.registrant.get.useQuery(
    { id: registrantId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const { mutate, isLoading } = trpc.registrant.update.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} updated`);
      router.push(`/camps/${campId}/admin/registrations`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Teams</h1>

      {data && (
        <div>
          <RegistrantForm
            campId={campId}
            onSubmit={(data) => mutate({ ...data, id: registrantId })}
            defaultValues={data}
            buttonProps={{ text: "Save changes", isLoading }}
          />
        </div>
      )}

      <div className="mt-4">
        {data && <DeleteAttendeeButton registrantId={registrantId} />}
      </div>
    </Layout>
  );
}
