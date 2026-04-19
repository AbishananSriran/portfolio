import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import { CheckCircle, XCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        
        const Icon =
          variant === "success"
            ? CheckCircle
            : variant === "destructive"
            ? XCircle
            : Info;

        const color =
          variant === "success"
            ? "bg-green-500 text-white"
            : variant === "destructive"
            ? "bg-red-500 text-white"
            : "bg-blue-500 text-white";

        return (
          <Toast
            key={id}
            {...props}
            className={`${color} flex items-start gap-3 rounded-xl p-4 shadow-lg`}
          >
            {/* Icon */}
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />

            {/* Content */}
            <div className="flex flex-col gap-0.5 flex-1">
              {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="opacity-90">
                  {description}
                </ToastDescription>
              )}
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}

      <ToastViewport
        className="
          fixed left-1/2 -translate-x-1/2
          bottom-[calc(1rem+env(safe-area-inset-bottom))]
          flex flex-col gap-3
          w-[92vw] max-w-sm
          z-[9999]
        "
        style={{ top: "auto" }}
      />
    </ToastProvider>
  );
}