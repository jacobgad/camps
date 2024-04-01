import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { isAuthed } from "utils/auth";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "@ui/Button";
import ItemCard from "@ui/cards/ItemCard";
import Layout from "components/layout/Layout";
import { TrashIcon } from "@heroicons/react/24/outline";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

export default function Page() {
  const router = useRouter();
  const campId = router.query.campId as string;
  const utils = trpc.useContext();

  const { data } = trpc.organiser.getAll.useQuery({ campId });
  const { mutate } = trpc.organiser.delete.useMutation({
    onSuccess: () => utils.organiser.getAll.invalidate(),
  });

  return (
    <Layout>
      <h1 className="mb-6">Organisers</h1>

      <Link href={`/camps/${campId}/admin/organisers/new`}>
        <Button
          text="Add new Organiser"
          Icon={PlusIcon}
          fullWidth
          className="justify-center"
        />
      </Link>

      <ul className="my-6 flex flex-col gap-2">
        {data?.map((user) => (
          <li key={user.id} className="flex gap-4">
            <Link
              href={`/camps/${campId}/admin/organisers/${user.id}`}
              className="flex-1"
            >
              <ItemCard
                label={user.name ?? user.email}
                description={user.email}
              />
            </Link>
            <Button
              text="Delete"
              intent="danger"
              Icon={TrashIcon}
              onClick={() => mutate({ campId, userId: user.id })}
            />
          </li>
        ))}
      </ul>
    </Layout>
  );
}
