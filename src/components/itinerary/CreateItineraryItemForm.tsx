import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { trpc } from "utils/trpc";
import { z } from "zod";

type Props = {
  campId: string;
};

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  date: z.date(),
  campId: z.string().cuid(),
});
type Schema = z.infer<typeof schema>;

export default function CreateItineraryItemForm({ campId }: Props) {
  const { register, handleSubmit, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { campId },
  });

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.itinerary.create.useMutation({
    onSuccess: () => {
      utils.itinerary.get.invalidate();
      reset({ campId });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
      className="grid gap-2"
    >
      <input type="text" placeholder="title" {...register("title")} />
      <input
        type="text"
        placeholder="description"
        {...register("description")}
      />
      <input
        type="datetime-local"
        placeholder="date"
        {...register("date", { valueAsDate: true })}
      />
      <button disabled={isLoading}>Submit</button>
    </form>
  );
}
