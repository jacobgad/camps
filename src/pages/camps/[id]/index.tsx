import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.id as string;
  const { data } = trpc.member.get.useQuery({ campId });

  return (
    <main className="flex min-h-screen flex-col bg-indigo-600 px-4 py-8 text-indigo-50">
      <div className="mb-6">
        <h1>{data?.camp.name}</h1>
        <p>{data?.camp.organiser}</p>
      </div>

      <div className="flex flex-col gap-4">
        {data?.role === "organiser" && (
          <Link
            href={`/camps/${campId}/admin`}
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
