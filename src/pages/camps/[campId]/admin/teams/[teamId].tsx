import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import MemberCard from "components/room/MemberCard";
import Layout from "components/layout/Layout";
import TeamForm from "components/team/TeamForm";
import DeleteTeamButton from "components/team/DeleteTeamButton";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const teamId = Number(router.query.teamId as string);

  const { data } = trpc.team.get.useQuery(
    { id: teamId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const { mutate, isLoading } = trpc.team.update.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} updated`);
      router.push(`/camps/${campId}/admin/teams`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Teams</h1>

      {data && (
        <div>
          <TeamForm
            onSubmit={(data) => mutate({ ...data, id: teamId })}
            defaultValues={data}
            buttonProps={{ text: "Save changes", isLoading }}
          />
        </div>
      )}

      <div className="mt-4">
        {data && (
          <DeleteTeamButton
            teamId={data.id}
            disabled={data.members.length > 0}
          />
        )}
      </div>

      <h2 className="mt-10 text-lg font-medium">Team members</h2>
      <ul className="mt-4 space-y-2">
        {data?.members.map((member) => (
          <li key={member.id}>
            <MemberCard member={member} />
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Page;
