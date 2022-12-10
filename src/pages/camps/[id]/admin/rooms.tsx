import CreateRoomForm from "components/room/CreateRoomForm";
import Badge from "@ui/Badge";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { UserIcon } from "@heroicons/react/24/outline";
import JoinRoomButton from "components/room/JoinRoomButton";

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
      <ul className="mt-4 grid gap-6">
        {data?.map((room) => (
          <li key={room.id} className="border-b pb-6">
            <p className="flex justify-between">
              <span className="font-bold">{room.name}</span>
              <Badge
                title={`${room.capacity - room.members.length} open slots`}
              />
            </p>
            <ul className=" mt-2 gap-2 last:grid">
              {room.members.map((member) => (
                <li key={member.id}>
                  <UserListItem text={member.user.name} />
                </li>
              ))}
            </ul>
            <JoinRoomButton room={room} />
          </li>
        ))}
      </ul>
    </main>
  );
};

type UserListItemProps = {
  text: string | null;
};

function UserListItem({ text }: UserListItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-4">
      <UserIcon className="h-4 stroke-indigo-500 stroke-2" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export default Page;
