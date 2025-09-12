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
  onSave: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
};

export function CustomerFormDialog({
  isOpen,
  onOpenChange,
  customer,
  onSave,
  onDelete,
}: CustomerFormDialogProps) {
  const title = customer ? "Edit Customer" : "Add New Customer";
  const description = customer
    ? "Update the customer details below."
    : "Fill out the form to add a new customer record.";

  // By re-mounting the form using a key, we ensure its state is reset
  // when switching between adding and editing different customers.
  const key = customer ? customer.id : "new";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
              onDone={() => onOpenChange(false)}
            />
        )}
      </DialogContent>
    </Dialog>
  );
}
