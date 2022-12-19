import {
  ClipboardDocumentIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import { format } from "date-fns";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

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

const Camps: NextPage = () => {
  const { data } = trpc.camp.getAll.useQuery();
  return (
    <>
      <main className="flex min-h-screen flex-col px-4 py-8">
        <h1 className="mb-6">Camps</h1>
        <Link href="camps/new">
          <Button
            text="New Camp"
            Icon={PlusCircleIcon}
            intent="secondary"
            size="large"
            fullWidth
          />
        </Link>

        <h2 className="mt-10 text-lg font-medium">My Camps</h2>
        <ul className="mt-2">
          {data?.map((camp, idx) => (
            <li key={camp.id} className={idx > 1 ? "my-4 border-t-2 py-4" : ""}>
              <p className="text-base font-bold">{camp.name}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {`${format(camp.startDate, "d MMMM yyyy")} - ${format(
                  camp.endDate,
                  "d MMMM yyyy"
                )}`}
              </p>
              <div className="mt-4 space-y-2">
                <Link href={`/camps/${camp.id}`}>
                  <Button text="Manage" fullWidth className="justify-center" />
                </Link>
                <Button
                  text="Copy registration link"
                  Icon={ClipboardDocumentIcon}
                  intent="secondary"
                  fullWidth
                  className="justify-center"
                />
                <Button
                  text="Delete camp"
                  Icon={TrashIcon}
                  intent="danger"
                  fullWidth
                  className="justify-center"
                />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Camps;
