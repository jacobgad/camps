import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

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

  return (
    <main className="flex min-h-screen flex-col p-4">
      <h1>ADMIN</h1>
      <h2>Timetable</h2>
      <Link href={`/camps/${id}/admin/itinerary`}>Itinerary</Link>
      <Link href={`/camps/${id}/admin/rooms`}>Rooms</Link>
      <Link href={`/camps/${id}/admin/members`}>Members</Link>
      <Link href={`/camps/${id}/admin/messages`}>Message</Link>
    </main>
  );
};

export default Page;
