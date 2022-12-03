import Link from "next/link";
import toast from "react-hot-toast";
import { trpc } from "../../utils/trpc";

export default function Camps() {
  const { data } = trpc.camps.getAll.useQuery(undefined, {
    onError: (error) => toast.error(error.message),
  });

  console.log(data);

  return (
    <div className="p-4">
      <h1>Camps</h1>
      <Link href="/camps/new">New Camp</Link>

      <ul>
        {data?.map((camp) => (
          <li key={camp.id} className="my-2 border">
            <Link href={`/camps/${camp.id}`}>
              <p>{camp.name}</p>
              <p className="text-sm">{camp.organiser}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
