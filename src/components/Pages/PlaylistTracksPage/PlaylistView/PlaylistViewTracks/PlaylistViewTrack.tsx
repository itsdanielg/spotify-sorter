import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { PlaylistTracksContext } from "@/context";
import { PlaylistTrack } from "@/types";
import { Label } from "@/components/Atoms";
import { AlbumCover } from "@/components/Compounds";

type PlaylistViewTrackProps = Omit<PlaylistTrack, "id">;

export function PlaylistViewTrack({
  index,
  addedAt,
  addedBy,
  isLocal,
  rearranged,
  track: { title, artists, album, albumCoverURL, trackNumber, releaseDate, explicit, durationInMs }
}: PlaylistViewTrackProps) {
  const { isCompact } = useContext(PlaylistTracksContext);

  return (
    <div
      className={twMerge(
        "flex items-center w-full transition-all [&>*]:p-2 bg-gray-6 hover:bg-gray-5 text-white",
        `${isLocal ? "bg-yellow-600" : ""}`,
        `${index % 2 === 0 ? "bg-gray-7" : ""}`,
        `${rearranged ? " bg-green" : ""}`,
        `${isCompact ? "text-sm overflow-x-auto md:overflow-hidden [&>*]:truncate" : ""}`
      )}>
      <span className={`${isCompact ? "w-16 md:w-[5%]" : "w-[5%]"} text-center`}>{index + 1}</span>
      <span className={`${isCompact ? "w-20 md:w-[10%]" : "w-[10%]"} text-center`}>
        {releaseDate.toISOString().split("T")[0]}
      </span>
      {!isCompact && (
        <span className="w-[5%] p-2">
          <AlbumCover
            src={albumCoverURL}
            width="w-full"
          />
        </span>
      )}
      <span className={`${isCompact ? "w-[120rem] md:w-[35%]" : "w-[30%]"} flex items-center gap-2`}>
        <span>{title}</span>
        {explicit && (
          <Label
            className="px-2 rounded-sm text-[0.6rem]"
            label="E"
          />
        )}
      </span>
      <span className={`${isCompact ? "w-[10rem] md:w-[15%]" : "w-[15%]"}`}>
        {isCompact ? (
          <>{artists[0]}</>
        ) : (
          <>
            {artists.map((artist, index) => (
              <p
                key={`${album} ${artist}`}
                className={index === 0 ? "font-bold" : ""}>
                {artist}
              </p>
            ))}
          </>
        )}
      </span>
      <span className={`${isCompact ? "w-[10rem] md:w-[20%]" : "w-[20%]"}`}>{album}</span>
      <span className={`${isCompact ? "w-[10rem] md:w-[5%]" : "w-[5%]"} text-center`}>{trackNumber}</span>
      <span className={`${isCompact ? "w-[10rem] md:w-[10%]" : "w-[10%]"} text-center`}>
        {/* <Label label={`Added by: ${addedBy}`} /> */}
        <p>{addedAt.toISOString().split("T")[0]}</p>
        {!isCompact && <p>{addedAt.toLocaleTimeString()}</p>}
      </span>
    </div>
  );
}
