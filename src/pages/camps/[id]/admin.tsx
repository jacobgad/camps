import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

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

const CampAdmin: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>ADMIN</h1>
    </main>
  );
};

export default CampAdmin;
