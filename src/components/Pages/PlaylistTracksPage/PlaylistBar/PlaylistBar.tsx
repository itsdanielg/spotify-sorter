import { useContext } from "react";
import { PlaylistTracksContext } from "@/context";
import { Button } from "@/components/Atoms";
import { LabeledSwitch } from "@/components/Compounds";

export function PlaylistBar() {
  const {
    playlistHook: { playlistTracks, playlistState, cancelChanges, saveChanges },
    isCompact,
    currentSort,
    setIsCompact,
    setCurrentSort
  } = useContext(PlaylistTracksContext);

  return (
    <div className="flex gap-4 w-full md:w-[50rem] p-4 bg-gray-3">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:gap-6">
          <span className="text-white">
            Total Tracks:
            <span className="font-bold text-green">{` ${playlistTracks.length}`}</span>
          </span>
          <span className="text-white">
            Current Sort:
            <span className="font-bold text-green">{` ${currentSort}`}</span>
          </span>
        </div>
        <LabeledSwitch
          label="Compact View"
          checked={isCompact}
          setChecked={setIsCompact}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 ml-auto">
        <Button
          label={"Find Duplicates"}
          onClick={() => {
            findDuplicates();
          }}
        />
        <Button
          label="Cancel Changes"
          disabled={!playlistState.isModified}
          onClick={() => {
            setCurrentSort("");
            cancelChanges();
          }}
        />
        <Button
          label="Save Changes"
          disabled={!playlistState.isModified}
          onClick={() => saveChanges()}
        />
      </div>
    </div>
  );
}
