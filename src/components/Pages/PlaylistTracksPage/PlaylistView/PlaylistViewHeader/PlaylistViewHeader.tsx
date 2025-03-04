import { Track } from "@/types";
import { twMerge } from "tailwind-merge";

type SortableColumn = {
  label: string;
  attribute: keyof Omit<Track, "albumCoverURL"> | "#";
  className: string;
  unsortable?: boolean;
};

const headerCellAttributes: SortableColumn[] = [
  {
    label: "#",
    attribute: "#",
    className: "md:w-[5%] cursor-default",
    unsortable: true
  },
  {
    label: "Release Date",
    attribute: "releaseDate",
    className: "md:w-[10%]"
  },
  {
    label: "Title",
    attribute: "title",
    className: "md:w-[35%]"
  },
  {
    label: "Artist",
    attribute: "artists",
    className: "md:w-[15%]"
  },
  {
    label: "Album",
    attribute: "album",
    className: "md:w-[20%]"
  },
  {
    label: "Track #",
    attribute: "trackNumber",
    className: "md:w-[5%]"
  },
  {
    label: "Date Added",
    attribute: "releaseDate",
    // TODO: attribute: "dateAdded",
    className: "md:w-[10%]"
  }
];

interface PlaylistViewHeaderProps {
  sortPlaylist: (field: string) => void;
}

export function PlaylistViewHeader({ sortPlaylist }: PlaylistViewHeaderProps) {
  return (
    <div className="sticky top-0 flex items-center w-full h-20 md:rounded-md bg-gray-3 text-white overflow-x-auto md:overflow-hidden">
      {headerCellAttributes.map(({ label, className, unsortable }) => (
        <button
          key={label}
          className={twMerge(
            "h-full text-center p-4 cursor-pointer",
            className,
            unsortable ? "" : "hover:bg-green transition-all duration-300"
          )}
          onClick={() => sortPlaylist(label)}
          disabled={unsortable}>
          {label}
        </button>
      ))}
    </div>
  );
}
