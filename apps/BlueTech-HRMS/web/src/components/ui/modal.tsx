"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  description?: string;
  size?: "default" | "small";
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
};

// Mounting the component opens it. Native <dialog> gives focus trapping and Escape for free.
export default function Modal({ title, description, size = "default", icon, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={`modal${size === "small" ? " small" : ""}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close">
          <X aria-hidden="true" />
        </button>
        {icon}
        <h2 id={titleId}>{title}</h2>
        {description && <p id={descriptionId} className="modal-description">{description}</p>}
        {children}
      </div>
    </dialog>
  );
}
