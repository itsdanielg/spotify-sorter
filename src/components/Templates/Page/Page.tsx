import { twMerge } from "tailwind-merge";
import { SpotifyError } from "@/types";
import { Footer } from "@/components/Layouts";
import { Loading, Error } from "@/components/Templates";
import { ReactNode } from "react";

interface PageProps {
  className?: string;
  isLoading?: boolean;
  error?: SpotifyError | null;
  children?: ReactNode;
}

export function Page({ className = "", isLoading = false, error = null, children = <></> }: PageProps) {
  return (
    <div className="flex flex-col w-full h-screen overflow-x-hidden">
      <div className={twMerge("w-full grow", className)}>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Error
            status={error.status}
            message={error.message}
          />
        ) : (
          children
        )}
      </div>
      <Footer />
    </div>
  );
}
