import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

export default function Camp() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.camps.getCamp.useQuery({ id });

  return (
    <>
      <h1>Camp</h1>

      <div className="overflow-auto">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
}
