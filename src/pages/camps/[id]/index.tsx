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
  const campId = router.query.id as string;
  const { data } = trpc.member.get.useQuery({ campId });

  return (
    <main className="flex min-h-screen flex-col bg-indigo-600 px-4 py-8 text-indigo-50">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">{data?.camp.title}</h1>
        <p>{data?.camp.description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {data?.role === "organiser" && (
          <Link
            href={`/camps/${data?.id}/admin`}
            className="flex place-content-center rounded-md border border-indigo-50 py-4"
          >
            Manage Camp
          </Link>
        )}
      </div>
    </main>
  );
};

export default Page;
