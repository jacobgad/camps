import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

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

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
});
type Schema = z.infer<typeof schema>;

const NewCamp: NextPage = () => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.camp.create.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => router.push(`/camps/${data.id}`),
  });

  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>New Camp</h1>
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="grid gap-2"
      >
        <input type="text" placeholder="Title" {...register("title")} />
        <input
          type="text"
          placeholder="Description"
          {...register("description")}
        />
        <button disabled={isLoading}>Submit</button>
      </form>
    </main>
  );
};

export default NewCamp;
