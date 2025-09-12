"use client";

import { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';
import type { Customer, Status } from './data';
import { CustomerList } from '@/components/customer-list';
import { DashboardHeader } from '@/components/dashboard-header';
import { CustomerFormDialog } from '@/components/customer-form-dialog';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allDevices, setAllDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customersRef = ref(db, 'customers');
    const unsubscribe = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedCustomers: Customer[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const sortedCustomers = loadedCustomers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCustomers(sortedCustomers);
        const uniqueDevices = [...new Set(sortedCustomers.map(c => c.device).sort())];
        setAllDevices(uniqueDevices);
      } else {
        setCustomers([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        customer.name.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower) ||
        customer.address.toLowerCase().includes(searchLower) ||
        customer.device.toLowerCase().includes(searchLower) ||
        customer.status.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesDevice = deviceFilter === 'all' || customer.device === deviceFilter;

      return matchesSearch && matchesStatus && matchesDevice;
    });
  }, [customers, searchQuery, statusFilter, deviceFilter]);

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id'> & { id?: string }) => {
    if (customerData.id) { // Editing existing customer
      const customerRef = ref(db, `customers/${customerData.id}`);
      const updatedCustomer = { ...customerData, lastEdited: new Date().toISOString() };
      delete updatedCustomer.id; // Don't save id inside the customer object in DB
      set(customerRef, updatedCustomer);
    } else { // Adding new customer
      const customersRef = ref(db, 'customers');
      const newCustomerRef = push(customersRef);
      const newCustomerData = { ...customerData };
      delete newCustomerData.id;
      set(newCustomerRef, newCustomerData);
    }
    setIsFormOpen(false);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    const customerRef = ref(db, `customers/${customerId}`);
    remove(customerRef);
    setIsFormOpen(false);
  }

  return (
    <>
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        deviceFilter={deviceFilter}
        onDeviceChange={setDeviceFilter}
        devices={allDevices}
        onAddNew={handleAddNew}
      />
      {isLoading ? (
         <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4">
            <div className="flex flex-col items-center gap-1 text-center p-8">
                <h3 className="text-2xl font-bold tracking-tight">Lade Kundendaten...</h3>
                <p className="text-sm text-muted-foreground">
                    Verbindung zur Datenbank wird hergestellt.
                </p>
            </div>
         </div>
      ) : (
        <CustomerList customers={filteredCustomers} onEdit={handleEdit} />
      )}
      <CustomerFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
        onDelete={handleDeleteCustomer}
      />
    </>
  );
}
