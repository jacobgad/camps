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
import { useMemo } from "react";
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

  const organiserCamps = useMemo(
    () => data?.filter((camp) => camp.members.at(0)?.role === "organiser"),
    [data]
  );

  return (
    <>
      <main className="flex min-h-screen flex-col px-4 py-8">
        <h1 className="flex flex-col text-center uppercase text-indigo-500">
          <span className="mb-1 text-sm font-medium tracking-wide">
            Camp Registration
          </span>
          <span>Home Page</span>
        </h1>

        <h2 className="mt-10 text-lg font-medium">My Camps</h2>
        <p className="text-sm font-medium text-gray-500">
          Camps that you have registered to attend
        </p>
        <ul className="mt-4 grid gap-6">
          {data?.map((camp) => (
            <li key={camp.id} className="rounded bg-white p-4 shadow-sm">
              <p className="text-base font-bold">{camp.name}</p>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {`${format(camp.startDate, "d MMMM yyyy")} - ${format(
                  camp.endDate,
                  "d MMMM yyyy"
                )}`}
              </p>
              <Link href={`/camps/${camp.id}`} className="mt-4">
                <Button
                  text="View registration details"
                  fullWidth
                  className="justify-center"
                />
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-lg font-medium">Manage Camps</h2>
        <p className="text-sm font-medium text-gray-500">
          Camps that you are organising
        </p>
        <Link href="camps/new" className="mt-4">
          <Button
            text="New Camp"
            Icon={PlusCircleIcon}
            intent="secondary"
            size="large"
            fullWidth
          />
        </Link>
        <ul className="mt-6 grid gap-6">
          {organiserCamps?.map((camp) => (
            <li key={camp.id} className="rounded bg-white p-4 shadow-sm">
              <p className="text-base font-bold">{camp.name}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {`${format(camp.startDate, "d MMMM yyyy")} - ${format(
                  camp.endDate,
                  "d MMMM yyyy"
                )}`}
              </p>
              <div className="mt-4 space-y-2">
                <Link href={`/camps/${camp.id}/admin`}>
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
