'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';

type Props = {
  onConfirm: () => void;
};

const DeleteDialog = ({ onConfirm }: Props) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition">
          Delete Post
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg space-y-4">
          <AlertDialog.Title className="text-lg font-bold text-gray-900">
            Hapus Post?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-600">
            Aksi ini tidak bisa dibatalkan. Post akan dihapus secara permanen.
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
                Batal
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteDialog;
