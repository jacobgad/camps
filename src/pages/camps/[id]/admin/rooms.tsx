import CreateRoomForm from "components/room/CreateRoomForm";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
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
  const { data } = trpc.room.getAll.useQuery({ campId });

  return (
    <main className="flex min-h-screen flex-col p-4">
      <h1>ADMIN</h1>
      <h2>Rooms</h2>

      <CreateRoomForm campId={campId} />
      <ul className="mt-4 grid gap-2">
        {data?.map((room) => (
          <li key={room.id} className="border p-1">
            <p className="flex justify-between">
              <span>{room.name}</span>
              <span>{room.capacity - room.members.length} open slots</span>
            </p>
            <ul>
              {room.members.map((member) => (
                <li key={member.id}>{member.user.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
