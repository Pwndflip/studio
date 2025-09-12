import type { Customer } from "@/app/dashboard/data";
import { CustomerCard } from "./customer-card";
import { Archive } from "lucide-react";

type CustomerListProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  isArchiveView: boolean;
};

export function CustomerList({ customers, onEdit, isArchiveView }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4">
        <div className="flex flex-col items-center gap-1 text-center p-8">
            <Archive className="h-12 w-12 text-muted-foreground"/>
          <h3 className="text-2xl font-bold tracking-tight">
            {isArchiveView ? "Archiv ist leer" : "Keine Kunden gefunden"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isArchiveView ? "Hier werden archivierte Einträge angezeigt." : "Versuchen Sie, Ihre Suche oder Filter anzupassen."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {customers.map((customer, index) => (
        <div
          key={customer.id}
          className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
        >
          <CustomerCard customer={customer} onEdit={() => onEdit(customer)} />
        </div>
      ))}
    </div>
  );
}
