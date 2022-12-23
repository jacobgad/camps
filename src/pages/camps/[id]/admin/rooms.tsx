import type { GetServerSideProps, NextPage } from "next";
import CreateRoomForm from "components/room/CreateRoomForm";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import JoinRoomButton from "components/room/JoinRoomButton";
import { useState } from "react";
import UpdateRoomForm from "components/room/UpdateRoomForm";
import { isAuthed } from "utils/auth";
import MemberListItem from "components/room/MemberListItem";
import DeleteRoomButton from "components/room/DeleteRoomButton";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.id as string;
  const { data } = trpc.room.getAll.useQuery({ campId });

  const [selectedMemberId, setSelectedMemberId] = useState<number>();

  return (
    <main className="flex flex-col px-4 py-8">
      <h1 className="mb-6 text-3xl font-extrabold">Edit Rooms</h1>

      <CreateRoomForm campId={campId} />
      <ul className="my-6 grid gap-6">
        {data?.map((room) => (
          <li key={room.id} className="border-t pt-4">
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
            {room.members.length < 1 && !selectedMemberId && (
              <DeleteRoomButton roomId={room.id} />
            )}
            {selectedMemberId &&
              room.capacity > room.members.length &&
              !room.members.map((m) => m.id).includes(selectedMemberId) && (
                <JoinRoomButton
                  roomId={room.id}
                  memberId={selectedMemberId}
                  onSubmit={() => setSelectedMemberId(undefined)}
                />
              )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
