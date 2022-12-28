import type { GetServerSideProps, NextPage } from "next";
import {
  CalendarIcon,
  DocumentTextIcon,
  KeyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "utils/trpc";
import Link from "next/link";
import { isAuthed } from "utils/auth";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.campId as string;

  const { data } = trpc.camp.get.useQuery(
    { id },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <Layout>
      <h1>Manage Camp</h1>
      <h2 className="mt-2 h-6 text-base font-bold text-gray-500">
        {data?.name}
      </h2>
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
    </Layout>
  );
};

export default Page;
