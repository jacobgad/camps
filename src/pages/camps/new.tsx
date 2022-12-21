import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Input from "@ui/Input";
import Button from "@ui/Button";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";

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
  name: z.string().min(3),
  organiser: z.string().min(3),
  startDate: z.date(),
  endDate: z.date(),
});
type Schema = z.infer<typeof schema>;

const NewCamp: NextPage = () => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.camp.create.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => router.push(`/camps/${data.id}`),
  });

  const { register, watch, formState, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  return (
    <main className="flex min-h-screen flex-col px-4 py-8">
      <h1>New Camp</h1>
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="mt-4 grid w-full gap-6"
      >
        <Input
          label="Camp name"
          fullWidth
          {...register("name")}
          error={formState.errors.name?.message}
        />
        <div className="grid gap-4">
          <Input
            label="Organiser"
            {...register("organiser")}
            error={formState.errors.organiser?.message}
          />
          <Button
            text="Add additional organiser"
            Icon={PlusCircleIcon}
            intent="secondary"
            size="small"
          />
        </div>
        <Input
          label="Start date"
          type="date"
          {...register("startDate", { valueAsDate: true })}
          error={formState.errors.startDate?.message}
        />
        <Input
          label="End date"
          type="date"
          disabled={!watch("startDate")?.getTime()}
          min={
            watch("startDate")?.getTime() > 0
              ? format(watch("startDate"), "yyyy-MM-dd")
              : undefined
          }
          {...register("endDate", { valueAsDate: true })}
          error={formState.errors.endDate?.message}
        />
        <Button
          text="Submit"
          disabled={isLoading || !formState.isValid}
          fullWidth
          className="mt-2 justify-center"
        />
      </form>
    </main>
  );
};

export default NewCamp;
