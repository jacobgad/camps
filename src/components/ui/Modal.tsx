import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export default function Modal(props: DialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 py-10 px-4">
        <Dialog.Panel className="mx-auto h-full max-w-sm rounded-lg bg-gray-50 p-6 shadow-xl">
          <div className="flex justify-between">
            <Dialog.Title className="text-lg font-medium">
              {props.title}
            </Dialog.Title>
            <button onClick={props.onClose}>
              <XMarkIcon className="h-6 text-gray-400" />
            </button>
          </div>

          {props.description && (
            <Dialog.Description>{props.description}</Dialog.Description>
          )}

          {props.children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
