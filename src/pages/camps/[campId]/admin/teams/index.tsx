import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { isAuthed } from "utils/auth";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "@ui/Button";
import ItemCard from "@ui/cards/ItemCard";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data } = trpc.team.getAll.useQuery({ campId });

  return (
    <Layout>
      <h1 className="mb-6">Teams</h1>

      <Link href={`/camps/${campId}/admin/teams/new`}>
        <Button
          text="Add new Team"
          Icon={PlusIcon}
          fullWidth
          className="justify-center"
        />
      </Link>

      <ul className="my-6 flex flex-col gap-2">
        {data?.map((team) => (
          <li key={team.id}>
            <Link href={`/camps/${campId}/admin/teams/${team.id}`}>
              <ItemCard
                label={team.name}
                description={team.points + " Points"}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Page;
