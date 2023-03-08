import { PlaylistSong, Song } from "../types";

export const mockPlaylistSongs: PlaylistSong[] = [
  {
    id: "0",
    index: 0,
    song: {
      title: "title",
      artists: ["artist"],
      album: "album one",
      albumURL: "url",
      trackNumber: 1,
      releaseDate: "2022-01-01",
      dateAdded: "2022-01-01",
      timeAdded: "2022-01-01"
    } as unknown as Song,
    rearranged: false
  },
  {
    id: "1",
    index: 1,
    song: {
      title: "title",
      artists: ["artist"],
      album: "album one",
      albumURL: "url",
      trackNumber: 1,
      releaseDate: "2022-01-02",
      dateAdded: "2022-01-01",
      timeAdded: "2022-01-01"
    } as unknown as Song,
    rearranged: false
  },
  {
    id: "2",
    index: 2,
    song: {
      title: "title",
      artists: ["artist"],
      album: "album two",
      albumURL: "url",
      trackNumber: 1,
      releaseDate: "2022-01-02",
      dateAdded: "2022-01-01",
      timeAdded: "2022-01-01"
    } as unknown as Song,
    rearranged: false
  },
  {
    id: "3",
    index: 3,
    song: {
      title: "title",
      artists: ["artist"],
      album: "album two",
      albumURL: "url",
      trackNumber: 2,
      releaseDate: "2022-01-02",
      dateAdded: "2022-01-01",
      timeAdded: "2022-01-01"
    } as unknown as Song,
    rearranged: false
  },
  {
    id: "4",
    index: 4,
    song: {
      title: "title",
      artists: ["artist"],
      album: "album two",
      albumURL: "url",
      trackNumber: 2,
      releaseDate: "2022-01-02",
      dateAdded: "2022-01-01",
      timeAdded: "2022-01-01"
    } as unknown as Song,
    rearranged: false
  }
];
