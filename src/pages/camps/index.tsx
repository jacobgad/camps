import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session)
    return {
      redirect: {
        destination: `/signin?callbackUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  return { props: {} };
};

const Camps: NextPage = () => {
  const { data } = trpc.camp.getAll.useQuery();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <h1>My Camps</h1>
        <Link href="camps/new">New Camp</Link>
        <ul>
          {data?.map((camp) => (
            <li key={camp.id} className="rounded border shadow">
              <p>{camp.title}</p>
              <p>{camp.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Camps;
