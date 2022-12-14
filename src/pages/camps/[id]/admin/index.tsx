import {
  CalendarIcon,
  KeyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { LinkButton } from "@ui/LinkButton";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
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
      <h1 className="text-3xl font-extrabold">Manage Camp</h1>
      <div className="mt-6 flex flex-col gap-3">
        <LinkButton
          text="Edit rooms"
          href={`/camps/${id}/admin/rooms`}
          Icon={KeyIcon}
        />
        <LinkButton
          text="Edit teams"
          href={`/camps/${id}/admin/teams`}
          Icon={UserGroupIcon}
        />
        <LinkButton
          text="Edit schedule"
          href={`/camps/${id}/admin/itinerary`}
          Icon={CalendarIcon}
        />
        <LinkButton
          text="Edit rooms"
          href={`/camps/${id}/admin/rooms`}
          Icon={KeyIcon}
        />
      </div>
    </main>
  );
};

export default Page;
