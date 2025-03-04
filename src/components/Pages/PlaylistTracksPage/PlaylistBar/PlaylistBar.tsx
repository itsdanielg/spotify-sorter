import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/Atoms";
import { LabeledSwitch } from "@/components/Compounds";
import { PlaylistTrack } from "@/types";

interface PlaylistBarProps {
  isCompact: boolean;
  isRearranged: boolean;
  playlistTracks: PlaylistTrack[];
  setIsCompact: Dispatch<SetStateAction<boolean>>;
  cancelChanges: () => void;
  saveChanges: () => void;
}

export function PlaylistBar({
  isCompact,
  isRearranged,
  playlistTracks,
  setIsCompact,
  cancelChanges,
  saveChanges
}: PlaylistBarProps) {
  return (
    <div className="flex gap-4 w-full md:w-[50rem] p-4 bg-gray-3">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:gap-6">
          <span className="text-white">
            Total Tracks:
            <span className="font-bold text-green">{` ${playlistTracks.length}`}</span>
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
          label="Cancel Changes"
          disabled={!isRearranged}
          onClick={() => cancelChanges()}
        />
        <Button
          label="Save Changes"
          disabled={!isRearranged}
          onClick={() => saveChanges()}
        />
      </div>
    </div>
  );
}
