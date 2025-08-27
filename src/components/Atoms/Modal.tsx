import { Dispatch, HTMLAttributes, ReactNode, SetStateAction } from "react";
import ReactDOM from "react-dom";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export function Modal({ show, children, className = "", ...props }: ModalProps) {
  if (!show) return <></>;

  const modalDiv = document.getElementById("modal")!;
  return ReactDOM.createPortal(
    <div
      {...props}
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-grayBackgroundTransparent">
      <div
        className={`${className} rounded-none md:rounded-lg bg-white-1 `}
        onClick={(e: any) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalDiv
  );
}
