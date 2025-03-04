import { Loader, Modal } from "../Atoms";

interface LoaderModalProps {
  isLoading: boolean;
}

export function LoaderModal({ isLoading }: LoaderModalProps) {
  return (
    <Modal show={isLoading}>
      <Loader />
    </Modal>
  );
}
