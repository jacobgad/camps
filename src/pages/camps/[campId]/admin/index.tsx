import type { GetServerSideProps } from "next";
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
import { useMemo } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

export default function Page() {
  const router = useRouter();
  const id = router.query.campId as string;

  const { data } = trpc.camp.get.useQuery(
    { id },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const menuItems = useMemo(
    () => [
      {
        name: "Edit details",
        link: `/camps/${id}/admin/details`,
        icon: DocumentTextIcon,
      },
      { name: "Edit rooms", link: `/camps/${id}/admin/rooms`, icon: KeyIcon },
      {
        name: "Edit teams",
        link: `/camps/${id}/admin/teams`,
        icon: UserGroupIcon,
      },
      {
        name: "Edit itinerary",
        link: `/camps/${id}/admin/itinerary`,
        icon: CalendarIcon,
      },
      {
        name: "Edit registrations",
        link: `/camps/${id}/admin/registrations`,
        icon: UserGroupIcon,
      },
    ],
    [id]
  );

  return (
    <Layout>
      <h1>Manage Camp</h1>
      <h2 className="mt-2 h-6 text-base font-bold text-gray-500">
        {data?.name}
      </h2>
      <div className="mt-6 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <Button
              text={item.name}
              Icon={item.icon}
              intent="secondary"
              size="large"
              fullWidth
            />
          </Link>
        ))}
      </div>
    </Layout>
  );
}
