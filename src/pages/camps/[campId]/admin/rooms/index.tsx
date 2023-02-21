import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { isAuthed } from "utils/auth";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "@ui/Button";
import ItemCard from "@ui/cards/ItemCard";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data } = trpc.room.getAll.useQuery({ campId });

  return (
    <Layout>
      <h1 className="mb-6">Rooms</h1>

      <Link href={`/camps/${campId}/admin/rooms/new`}>
        <Button
          text="Add new Room"
          Icon={PlusIcon}
          fullWidth
          className="justify-center"
        />
      </Link>

      <ul className="my-6 flex flex-col gap-2">
        {data?.map((room) => (
          <li key={room.id}>
            <Link href={`/camps/${campId}/admin/rooms/${room.id}`}>
              <ItemCard
                label={room.name}
                description={`${
                  room.gender === "male" ? "M" : "F"
                } - Capacity ${room.members.length}/${room.capacity}`}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Page;
