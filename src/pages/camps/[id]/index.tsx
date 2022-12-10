import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

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

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.camp.get.useQuery({ id });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>

      <hr className="divide-y-4 divide-black" />
      {data?.members[0]?.role === "organiser" && (
        <Link href={`/camps/${data?.id}/admin`}>Admin</Link>
      )}
      <hr />

      <h2>{data?.members[0]?.user.name}</h2>
    </main>
  );
};

export default Page;