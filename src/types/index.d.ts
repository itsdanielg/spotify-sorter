import { SpotifyError } from "./spotify";

type APIReturn<T> = Promise<
  | {
      data: T;
      errorResponse: null;
    }
  | {
      data: null;
      errorResponse: SpotifyResponseError;
    }
>;

type HookReturn<T> = {
  data: T | null;
  error: SpotifyError | null;
};

type Playlist = {
  id: string;
  name: string;
  imageURL: string;
  owner: string;
  description: string;
  collaborative: boolean;
  isPublic: boolean;
};

type PlaylistTrack = {
  id: string;
  index: number;
  addedAt: Date;
  addedBy: string;
  isLocal: boolean;
  rearranged: boolean;
  track: Track;
};

type Track = {
  title: string;
  artists: string[];
  album: string;
  albumCoverURL: string;
  trackNumber: number;
  releaseDate: Date;
  explicit: boolean;
  durationInMs: number;
  preview_url: string | null;
};

export * from "./spotify";
export type { APIReturn, HookReturn, Playlist, PlaylistTrack, Track };
