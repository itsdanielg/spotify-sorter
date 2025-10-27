import { SpotifyError } from "@/types";

export function Error({ status, message }: SpotifyError) {
  const newMessage = status === 401 ? "Your access token has expired. Please log in again." : message;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center p-6 gap-4 text-white text-2xl">
        {status && <span>{status}</span>}
        {message && <span>{newMessage}</span>}
      </div>
    </div>
  );
}
