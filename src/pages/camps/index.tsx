import type { GetServerSideProps, NextPage } from "next";
import type { Camp } from "@prisma/client";
import {
  ClipboardDocumentIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "@ui/Button";
import HeroLayout from "components/layout/HeroLayout";
import { format } from "date-fns";
import Link from "next/link";
import { isAuthed } from "utils/auth";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Camps: NextPage = () => {
  const { data } = trpc.camp.getAll.useQuery();

  return (
    <HeroLayout>
      <h2 className="text-lg font-medium text-gray-100">My Camps</h2>
      <p className="mt-1 text-sm font-normal text-gray-400">
        Camps that you have registered to attend
      </p>
      <ul className="mt-4 grid gap-6">
        {data?.attending.map((camp) => (
          <li key={camp.id}>
            <CampCard camp={camp}>
              <Link href={`/camps/${camp.id}`} className="mt-4">
                <Button
                  text="View registration details"
                  fullWidth
                  className="justify-center"
                />
              </Link>
            </CampCard>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-medium text-gray-100">Manage Camps</h2>
      <p className="mt-1 mb-4 text-sm font-normal text-gray-400">
        Camps that you are organising
      </p>
      <Link href="camps/new">
        <Button
          text="New Camp"
          Icon={PlusCircleIcon}
          intent="secondary"
          size="large"
          fullWidth
        />
      </Link>
      <ul className="mt-6 grid gap-6">
        {data?.organising.map((camp) => (
          <li key={camp.id}>
            <CampCard camp={camp}>
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
              </div>
            </CampCard>
          </li>
        ))}
      </ul>
    </HeroLayout>
  );
};

export default Camps;

type CampCardProps = {
  camp: Camp;
  children?: React.ReactNode;
};

function CampCard(props: CampCardProps) {
  return (
    <div className="rounded border border-gray-700 p-4 shadow-sm">
      <p className="text-base font-bold text-gray-200">{props.camp.name}</p>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {`${format(props.camp.startDate, "d MMMM yyyy")} - ${format(
          props.camp.endDate,
          "d MMMM yyyy"
        )}`}
      </p>
      {props.children}
    </div>
  );
}
