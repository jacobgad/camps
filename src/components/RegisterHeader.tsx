import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export default function RegisterHeader() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.camps.getCamp.useQuery(
    { id },
    {
      enabled: !!id,
    }
  );

  return (
    <header className="w-full bg-indigo-600 px-4 pt-4 pb-6 text-indigo-200">
      <h1 className="text-xs font-medium uppercase leading-4 tracking-wider">
        Camp Registration
      </h1>
      <h2 className="mb-1 text-2xl font-extrabold leading-8 text-indigo-50">
        {data?.name}
      </h2>
      <p className="text-xs font-medium uppercase leading-4 tracking-wide">
        {data?.organiser}
      </p>
    </header>
  );
}
