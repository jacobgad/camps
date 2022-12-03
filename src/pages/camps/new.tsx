import { useForm } from "react-hook-form";
import Input from "../../components/forms/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../components/Button";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const schema = z.object({
  name: z.string().min(5),
  organiser: z.string().min(5),
});

export default function New() {
  const router = useRouter();

  const { mutate, isLoading } = trpc.camps.create.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => router.push(`/camps/${data.id}`),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <div className="p-5">
      <h1 className="mb-4">New Camp</h1>

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="grid gap-2"
      >
        <Input
          label="Name"
          {...register("name")}
          error={errors.name?.message?.toString()}
        />

        <Input
          label="Organiser"
          {...register("organiser")}
          error={errors.organiser?.message?.toString()}
        />

        <Button type="submit" disabled={!isValid || isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
}
