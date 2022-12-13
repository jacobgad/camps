import { HashtagIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { trpc } from "utils/trpc";
import { z } from "zod";

type Props = {
  defaultValues: Partial<Schema>;
};

const schema = z.object({
  id: z.number(),
  name: z.string().min(3),
  capacity: z.number().min(1),
  campId: z.string().cuid(),
});
type Schema = z.infer<typeof schema>;

export default function UpdateRoomForm({ defaultValues }: Props) {
  const { register, handleSubmit, reset, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.room.update.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} updated`);
      utils.room.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
      reset(defaultValues);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))} //use onBlur with parent state to track updated rooms
      className="grid gap-2"
    >
      <Input label="Room Name" type="text" {...register("name")} />
      <Input
        label="Capacity"
        type="number"
        Icon={HashtagIcon}
        {...register("capacity", { valueAsNumber: true })}
      />
      <Button text="Update room" disabled={isLoading || !formState.isValid} />
    </form>
  );
}
