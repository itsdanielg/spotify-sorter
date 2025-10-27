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

type TokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
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
};

export * from "./spotify";
export type { APIReturn, HookReturn, TokenResponse, Playlist, PlaylistTrack, Track };
