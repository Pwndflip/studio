import type { Customer } from "@/app/dashboard/data";
import { CustomerCard } from "./customer-card";

type CustomerListProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
};

export function CustomerList({ customers, onEdit }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4">
        <div className="flex flex-col items-center gap-1 text-center p-8">
          <h3 className="text-2xl font-bold tracking-tight">No customers found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
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
