'use client';
import * as Toast from '@radix-ui/react-toast';
import { CheckCircle, X } from 'lucide-react';

type NotificationProps = {
  variant: 'success' | 'danger';
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
};

const NotificationComponent = ({ variant, open, setOpen, title, description }: NotificationProps) => {
  const getColorClass = (variant: 'success' | 'danger') => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className={`${getColorClass(variant)} text-white px-4 py-3 pr-10 rounded-md shadow-lg relative flex items-start gap-3`}
      >
        <CheckCircle className="w-5 h-5 mt-1" />

        <div>
          <Toast.Title className="font-semibold text-base">{title}</Toast.Title>
          <Toast.Description className="text-sm">
            {description}
          </Toast.Description>
        </div>

        <Toast.Close className="absolute top-2 right-2 text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-4 right-4 w-96 max-w-full z-50" />
    </Toast.Provider>
  );
};

export default NotificationComponent;
