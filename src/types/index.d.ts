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
  isLoading: boolean;
  callbacks?: { [key: string]: (...args: any[]) => any };
};

type TokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

type PlaylistUpdateError = {
  message: string;
  tracksSwitched: number;
};

type Playlist = {
  readonly id: string;
  readonly name: string;
  readonly imageURL: string;
  readonly owner: string;
  readonly description: string;
  readonly collaborative: boolean;
  readonly isPublic: boolean;
};

type PlaylistTrack = {
  readonly id: string;
  readonly index: number;
  readonly addedAt: Date;
  readonly addedBy: string;
  readonly isLocal: boolean;
  readonly track: Track;
  rearranged: boolean;
};

type Track = {
  readonly title: string;
  readonly artists: string[];
  readonly album: string;
  readonly albumCoverURL: string;
  readonly trackNumber: number;
  readonly releaseDate: Date;
  readonly explicit: boolean;
  readonly durationInMs: number;
};

export * from "./spotify";
export type { APIReturn, HookReturn, TokenResponse, PlaylistUpdateError, Playlist, PlaylistTrack, Track };
