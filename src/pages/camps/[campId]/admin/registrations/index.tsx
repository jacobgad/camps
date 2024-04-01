import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { isAuthed } from "utils/auth";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "@ui/Button";
import ItemCard from "@ui/cards/ItemCard";
import Layout from "components/layout/Layout";
import Input from "@ui/Input";
import { useMemo, useState } from "react";
import { getFilteredList } from "utils/getFilteredList";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

export default function Page() {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data } = trpc.registrant.getAll.useQuery(
    { campId },
    { initialData: [] }
  );
  const [searchTerm, setSearchTerm] = useState("");

  const attendees = useMemo(
    () =>
      getFilteredList({
        list: data,
        search: searchTerm,
        getSearchableFields: (item) => [item.name, item.phone],
      }),
    [data, searchTerm]
  );

  return (
    <Layout>
      <h1 className="mb-6">Registrations</h1>

      <Link href={`/camps/${campId}/admin/registrations/new`}>
        <Button
          text="Add new Registration"
          Icon={PlusIcon}
          fullWidth
          className="justify-center"
        />
      </Link>

      <div className="mt-4">
        <Input
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="my-6 flex flex-col gap-2">
        {attendees.map((attendee) => (
          <li key={attendee.id}>
            <Link href={`/camps/${campId}/admin/registrations/${attendee.id}`}>
              <ItemCard
                label={attendee.name}
                description={attendee.team.name}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
