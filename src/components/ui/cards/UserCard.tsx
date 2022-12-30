import { UserIcon } from "@heroicons/react/24/outline";

type UserCardProps = {
  text: string;
  onClick?: () => void;
};

export default function UserCard({ text, onClick }: UserCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-4 active:bg-indigo-50"
    >
      <UserIcon className="h-4 stroke-indigo-500 stroke-2" />
      <span className="flex-grow text-left text-sm">{text}</span>
      <span className="text-sm text-indigo-500">Reallocate</span>
    </button>
  );
}
