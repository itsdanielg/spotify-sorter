import { ReactNode, useEffect } from "react";
import { Snackbar } from "@/components/Atoms";

interface FadingSnackbarProps {
  children: ReactNode;
  show: boolean;
  error: boolean;
  callbackAfterFade?: () => void;
}

export function FadingSnackbar({ children, show, error, callbackAfterFade = () => {} }: FadingSnackbarProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        callbackAfterFade();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, callbackAfterFade]);

  const visibility = show ? "visible animate-snackbar" : "invisible";
  const bgColor = error ? "bg-red-400" : "bg-green";

  return (
    <Snackbar className={`${visibility} ${bgColor} w-96 h-20 flex flex-col p-4 px-6 pointer-events-none`}>
      {children}
    </Snackbar>
  );
}
