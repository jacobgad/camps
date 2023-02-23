import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export default function Modal(props: DialogProps) {
  return (
    <AnimatePresence>
      {props.open && (
        <Dialog
          open={props.open}
          onClose={props.onClose}
          static
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <motion.div>
            <div className="fixed inset-0 py-10 px-4">
              <Dialog.Panel className="mx-auto flex h-full max-w-sm flex-col rounded-lg bg-gray-50 p-6 shadow-xl">
                <div className="mb-4 flex justify-between">
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

                <div className="flex-grow overflow-auto">{props.children}</div>
              </Dialog.Panel>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
