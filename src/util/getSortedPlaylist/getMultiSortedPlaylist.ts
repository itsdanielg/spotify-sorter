import { PlaylistTrack } from "@/types";
import {
  sortByAddedAt,
  sortByAlbum,
  sortByArtist,
  sortByReleaseDate,
  sortByTitle,
  sortByTrackNumber
} from "./sortComparators";

export function getMultiSortedPlaylist(unorderedPlaylist: PlaylistTrack[], fields: string): PlaylistTrack[] {
  const orderedPlaylist = [...unorderedPlaylist];
  for (const field of fields) {
    switch (field) {
      case "Date Added":
        orderedPlaylist.sort(sortByAddedAt);
        break;
      case "Album":
        orderedPlaylist.sort(sortByAlbum);
        break;
      case "Artist":
        orderedPlaylist.sort(sortByArtist);
        break;
      case "Release Date":
        orderedPlaylist.sort(sortByReleaseDate);
        break;
      case "Title":
        orderedPlaylist.sort(sortByTitle);
        break;
      case "Track":
        orderedPlaylist.sort(sortByTrackNumber);
        break;
      default:
        break;
    }
  }
  return orderedPlaylist;
}
