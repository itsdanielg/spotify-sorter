export type mockPlaylistSong = {
  id: string;
  index: number;
};

export function mockUpdatePlaylistItem(playlist: mockPlaylistSong[], startIndex: number, endIndex: number) {
  playlist.splice(endIndex, 0, playlist.splice(startIndex, 1)[0]);
}
