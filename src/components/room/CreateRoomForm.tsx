import { HashtagIcon, PlusIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
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
  const { register, handleSubmit, reset, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { campId },
  });

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.room.create.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.name} Created`);
      utils.room.getAll.invalidate();
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      className="grid gap-2"
    >
      <Input label="Room Name" type="text" {...register("name")} />
      <Input
        label="Capacity"
        type="number"
        Icon={HashtagIcon}
        {...register("capacity", { valueAsNumber: true })}
      />
      <Button
        text="Add new room"
        Icon={PlusIcon}
        disabled={!formState.isValid}
        isLoading={isLoading}
        className="justify-center"
      />
    </form>
  );
}
