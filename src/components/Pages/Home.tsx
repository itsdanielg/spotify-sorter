import { usePlaylists } from "../../api/Playlists/usePlaylists";
import { Playlist } from "../../types";
import { Loading } from "../Atoms/Loading";
import { PlaylistLink } from "../Atoms/PlaylistLink";

export function Home() {
  const playlists: Playlist[] = usePlaylists();

  if (playlists.length === 0) return <Loading />;
  return (
    <div className="flex flex-col p-6 gap-4">
      <div className="flex justify-center mb-8">
        <span className="text-white-1 text-[3rem] font-bold">Playlists</span>
      </div>
      <div className="flex flex-wrap items-center justify-center mx-12 gap-12 p-2">
        {playlists.map(({ id, name, imageURL }: Playlist) => {
          return (
            <PlaylistLink
              key={`Playlist ID ${id}`}
              id={id}
              name={name}
              imageURL={imageURL}
            />
          );
        })}
      </div>
    </div>
  );
}
