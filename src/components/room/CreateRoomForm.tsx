import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { trpc } from "utils/trpc";
import { z } from "zod";

type Props = {
  campId: string;
};

const schema = z.object({
  name: z.string().min(3),
  capacity: z.number().min(1),
  campId: z.string().cuid(),
});
type Schema = z.infer<typeof schema>;

export default function CreateRoomForm({ campId }: Props) {
  const { register, handleSubmit, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { campId },
  });

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.room.create.useMutation({
    onSuccess: () => {
      utils.room.getAll.invalidate();
      reset({ campId });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      className="grid gap-2"
    >
      <input type="text" placeholder="name" {...register("name")} />
      <input
        type="number"
        placeholder="capacity"
        {...register("capacity", { valueAsNumber: true })}
      />
      <button disabled={isLoading}>Submit</button>
    </form>
  );
}
