import { UserIcon } from "@heroicons/react/24/outline";

type UserCardProps = {
  text: string | null;
  selected?: boolean;
  onClick?: () => void;
};

export default function UserCard({ text, selected, onClick }: UserCardProps) {
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
