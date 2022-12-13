import CreateRoomForm from "components/room/CreateRoomForm";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { UserIcon } from "@heroicons/react/24/outline";
import JoinRoomButton from "components/room/JoinRoomButton";
import { useState } from "react";
import UpdateRoomForm from "components/room/UpdateRoomForm";

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

  const [selectedMemberId, setSelectedMemberId] = useState<number>();

  return (
    <main className="flex min-h-screen flex-col p-4">
      <h1 className="mb-6 text-3xl font-extrabold">Edit Rooms</h1>

      <CreateRoomForm campId={campId} />
      <ul className="mt-4 grid gap-6">
        {data?.map((room) => (
          <li key={room.id} className="border-b pb-4">
            <div className="mb-4">
              <UpdateRoomForm defaultValues={room} />
            </div>

            <ul className="mt-2 grid gap-2">
              {room.members.map((member) => (
                <li key={member.id}>
                  <MemberListItem
                    text={member.user.name}
                    selected={member.id === selectedMemberId}
                    onClick={() =>
                      setSelectedMemberId(
                        member.id === selectedMemberId ? undefined : member.id
                      )
                    }
                  />
                </li>
              ))}
            </ul>
            {selectedMemberId &&
              room.capacity > room.members.length &&
              !room.members.map((m) => m.id).includes(selectedMemberId) && (
                <JoinRoomButton room={room} memberId={selectedMemberId} />
              )}
          </li>
        ))}
      </ul>
    </main>
  );
};

type UserListItemProps = {
  text: string | null;
  selected: boolean;
  onClick: () => void;
};

function MemberListItem({ text, selected, onClick }: UserListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg border border-gray-300 py-2 px-4 ${
        selected ? "bg-indigo-500 text-white" : "bg-white"
      }`}
    >
      <UserIcon
        className={`h-4 stroke-2 ${
          selected ? "stroke-white" : "stroke-indigo-500"
        }`}
      />
      <span className="flex-grow text-left text-sm">{text}</span>
      <span className={`text-sm ${!selected && "text-indigo-500"}`}>
        {selected ? "Cancel" : "Reallocate"}
      </span>
    </button>
  );
}

export default Page;
