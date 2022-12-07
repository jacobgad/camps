import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";

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
  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <h1>Camps</h1>
        <Link href="/camps">My Camps</Link>
      </main>
    </>
  );
};

export default Camps;
