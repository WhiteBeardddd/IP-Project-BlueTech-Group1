"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "./modal";
import { errorMessage } from "@/lib/api";

type ConfirmDialogProps = {
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Modal title={title} size="small" onClose={onClose} icon={<span className="confirm-icon tone-clay"><Trash2 aria-hidden="true" /></span>}>
      <p className="modal-description">{message}</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={confirm} disabled={busy}>
          {busy ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
