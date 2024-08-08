import { PlaylistTrack } from "@/types";
import {
  sortByAddedAt,
  sortByAlbum,
  sortByArtist,
  sortByReleaseDate,
  sortByTitle,
  sortByTrackNumber
} from "../sortComparators";

export function multiSortComparator(
  playlistTrackOne: PlaylistTrack,
  playlistTrackTwo: PlaylistTrack,
  fields: string[]
) {
  for (const field of fields) {
    let sorted = 0;
    switch (field) {
      case "Date Added":
        sorted = sortByAddedAt(playlistTrackOne, playlistTrackTwo);
        if (sorted !== 0) return sorted;
        break;
      case "Album":
        sorted = sortByAlbum(playlistTrackOne, playlistTrackTwo);
        if (sorted !== 0) return sorted;
        break;
      case "Artist":
        sorted = sortByArtist(playlistTrackOne, playlistTrackTwo);
        if (sorted !== 0) return sorted;
        break;
      case "Release Date":
        sorted = sortByReleaseDate(playlistTrackOne, playlistTrackTwo);
        if (sorted !== 0) return sorted;
        break;
      case "Title":
        sorted = sortByTitle(playlistTrackOne, playlistTrackTwo);
        if (sorted !== 0) return sorted;
        break;
      case "Track":
        sorted = sortByTrackNumber(playlistTrackOne, playlistTrackTwo);
        if (sorted !== 0) return sorted;
        break;
      default:
        break;
    }
  }

  return 0;
}
