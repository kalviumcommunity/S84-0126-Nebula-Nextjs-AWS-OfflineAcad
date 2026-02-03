"use client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detach Node?"
      footer={
        <div className="flex gap-4 w-full">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Stay Connected
          </Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">
            Detach Now
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-slate-400 font-light leading-relaxed">
          You are about to terminate the secure session. All offline synchronization progress for this node will be suspended until the next authorization.
        </p>
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
          <p className="text-[10px] uppercase font-bold tracking-widest text-rose-400">Security Warning</p>
          <p className="text-xs text-rose-300/60 mt-1">Pending outbound syncs may be lost if not committed.</p>
        </div>
      </div>
    </Modal>
  );
}
