import Layout from "components/layout/Layout";
import PersonalInformationForm from "components/register/PersonalInformationForm";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;

  const { data } = trpc.camp.get.useQuery(
    { id: campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <Layout>
      <header className="-mx-4 -mt-8 bg-indigo-600 px-4 py-8 text-indigo-50">
        <h1 className="text-2xl font-extrabold tracking-tight">{data?.name}</h1>
        <p className="mt-1 text-xs uppercase tracking-wide">
          {data?.organiser}
        </p>
      </header>

      <h2 className="mt-8 text-lg font-medium text-gray-900">Registration</h2>
      <p className="mt-1 text-sm font-normal text-gray-500">
        Your information is only accessible to the event organisers, and will
        not be shared publicly.
      </p>

      <PersonalInformationForm onSubmit={() => null} />
    </Layout>
  );
};

export default Page;
