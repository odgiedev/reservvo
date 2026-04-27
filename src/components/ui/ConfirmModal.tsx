"use client";

import { type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  loading = false,
}: ConfirmModalProps): ReactNode => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="text-sm text-foreground/75">{description}</p>
    <div className="mt-6 flex items-center justify-end gap-3">
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        onClick={onConfirm}
        loading={loading}
        className={
          variant === "danger"
            ? "bg-red-600 text-white hover:bg-red-700"
            : ""
        }
      >
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);
