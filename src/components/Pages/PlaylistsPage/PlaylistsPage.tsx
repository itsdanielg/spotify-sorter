import { useCurrentUserPlaylists, useCurrentUserPlaylistsReturn } from "@/api";
import { Playlist } from "@/types";
import { Page } from "@/components/Templates";
import { PlaylistLink } from "./PlaylistLink";

export function PlaylistsPage() {
  const { data, error } = useCurrentUserPlaylists();
  const { playlists } = data as useCurrentUserPlaylistsReturn;

  return (
    <Page
      className="flex flex-col items-center p-4 gap-4"
      isLoading={playlists.length === 0}
      error={error}>
      <div className="flex items-center justify-center my-4">
        <span className="text-white text-[3.5rem] font-bold">Playlists</span>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap items-center md:justify-center gap-4 md:gap-12 w-full md:w-auto">
        {playlists.map(({ id, name, imageURL, owner, description, collaborative, isPublic }: Playlist) => {
          return (
            <PlaylistLink
              key={`Playlist ID ${id}`}
              id={id}
              name={name}
              imageURL={imageURL}
              owner={owner}
              description={description}
              collaborative={collaborative}
              isPublic={isPublic}
            />
          );
        })}
      </div>
    </Page>
  );
}
