"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomerForm } from "./customer-form";
import type { Customer } from "@/app/dashboard/data";

type CustomerFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customer: Customer | null;
  onSave: (customer: Omit<Customer, 'id'> & { id?: string }) => void;
  onDelete: (customerId: string) => void;
  onArchive: (customer: Customer) => void;
  onUnarchive: (customer: Customer) => void;
  isArchiveView: boolean;
};

export function CustomerFormDialog({
  isOpen,
  onOpenChange,
  customer,
  onSave,
  onDelete,
  onArchive,
  onUnarchive,
  isArchiveView
}: CustomerFormDialogProps) {
  const title = customer ? "Kunde bearbeiten" : "Neuen Kunden hinzufügen";
  const description = customer
    ? "Aktualisieren Sie die Kundendetails unten."
    : "Füllen Sie das Formular aus, um einen neuen Kundendatensatz hinzuzufügen.";

  const key = customer ? customer.id : "new";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {isOpen && (
            <CustomerForm
              key={key}
              customer={customer}
              onSave={onSave}
              onDelete={onDelete}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
              isArchiveView={isArchiveView}
              onDone={() => onOpenChange(false)}
            />
        )}
      </DialogContent>
    </Dialog>
  );
}
