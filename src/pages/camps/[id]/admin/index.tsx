import type { GetServerSideProps, NextPage } from "next";
import {
  CalendarIcon,
  DocumentTextIcon,
  KeyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
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

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data } = trpc.camp.get.useQuery(
    { id },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <main className="flex min-h-screen flex-col px-4 py-8">
      <h1>Manage Camp</h1>
      <h2 className="mt-2 text-base font-bold text-gray-500">{data?.name}</h2>
      <div className="mt-6 flex flex-col gap-2">
        <Link href={`/camps/${id}/admin/details`}>
          <Button
            text="Edit details"
            Icon={DocumentTextIcon}
            intent="secondary"
            size="large"
            fullWidth
          />
        </Link>
        <Link href={`/camps/${id}/admin/rooms`}>
          <Button
            text="Edit rooms"
            Icon={KeyIcon}
            intent="secondary"
            size="large"
            fullWidth
          />
        </Link>
        <Link href={`/camps/${id}/admin/teams`}>
          <Button
            text="Edit teams"
            Icon={UserGroupIcon}
            intent="secondary"
            size="large"
            fullWidth
          />
        </Link>
        <Link href={`/camps/${id}/admin/itinerary`}>
          <Button
            text="Edit itinerary"
            Icon={CalendarIcon}
            intent="secondary"
            size="large"
            fullWidth
          />
        </Link>
      </div>
    </main>
  );
};

export default Page;
