import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

export function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast) return null;

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
  };

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg w-[90%] md:w-full max-w-md",
        styles[toast.type]
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={hideToast}
        className="p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
