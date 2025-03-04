import { Loader } from "@/components/Atoms";
import { FadingSnackbar } from "@/components/Compounds/";
import { useState, useEffect } from "react";

interface SaveSnackbarProps {
  tracksSwitched: number;
  saving: {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
}

export function SaveSnackbar({ tracksSwitched, saving: { isPending, isSuccess, isError } }: SaveSnackbarProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isPending) setShow(true);
  }, [isPending]);

  const label = isError ? "Saving incomplete. Please try again." : "Saving complete!";

  return (
    <FadingSnackbar
      show={show}
      error={isError}
      callbackAfterFade={() => setShow(false)}>
      {isPending ? (
        <Loader width="w-8" />
      ) : (
        <>
          <span>{label}</span>
          <span>
            <strong>{tracksSwitched}</strong>
            {tracksSwitched === 1 ? " total track has been updated!" : " total tracks have been updated!"}
          </span>
        </>
      )}
    </FadingSnackbar>
  );
}
