import { useEffect, useState } from "react";
import { SpotifyError, SpotifyUser, HookReturn } from "@/types";
import { fetchCurrentUser } from "../calls";

export type useCurrentUserReturn = {
  id: string;
  name: string;
  images: string[];
};

export function useCurrentUser(): HookReturn<useCurrentUserReturn> {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<SpotifyError | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, errorResponse } = await fetchCurrentUser();
      if (errorResponse) {
        setError(errorResponse.error as SpotifyError);
        return;
      }

      const dataUser = data as SpotifyUser;

      setId(dataUser.id);
      setName((dataUser.display_name ?? "").split(" ")[0]);
      setImages(dataUser.images.map((image) => image.url));
    };

    getUser();
  }, []);

  return { data: { id, name, images }, error: error };
}
