"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Customer, Status } from './data';
import { CustomerList } from '@/components/customer-list';
import { DashboardHeader } from '@/components/dashboard-header';
import { CustomerFormDialog } from '@/components/customer-form-dialog';
import { initialCustomers } from './data';

// Helper to generate a unique enough ID for local state
let nextId = 100;

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
    // Initialize customers from the local data file
    const loadedCustomers = initialCustomers.map((c, i) => ({ ...c, id: `initial-${i}` }));
    
    const sortedCustomers = loadedCustomers.sort((a, b) => {
        const dateA = a.datum ? new Date(a.datum).getTime() : 0;
        const dateB = b.datum ? new Date(b.datum).getTime() : 0;
        return dateB - dateA;
    });

    setCustomers(sortedCustomers);
    const uniqueDevices = [...new Set(sortedCustomers.map(c => c.gerät).filter(Boolean).sort())];
    setAllDevices(uniqueDevices);
    setIsLoading(false);
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (customer.name?.toLowerCase() || '').includes(searchLower) ||
        (customer.telefon?.toLowerCase() || '').includes(searchLower) ||
        (customer.adresse?.toLowerCase() || '').includes(searchLower) ||
        (customer.gerät?.toLowerCase() || '').includes(searchLower) ||
        (customer.status?.toLowerCase() || '').includes(searchLower);

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesDevice = deviceFilter === 'all' || customer.gerät === deviceFilter;

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
      setCustomers(customers.map(c => 
        c.id === customerData.id ? { ...c, ...customerData, notizEditDate: new Date().toLocaleDateString('de-DE') } : c
      ));
    } else { // Adding new customer
      const newCustomer: Customer = {
        ...customerData,
        id: `new-${nextId++}`,
        datum: new Date().toISOString().split('T')[0], // Set current date for new entries
      };
      setCustomers([newCustomer, ...customers]);
    }
    setIsFormOpen(false);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
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
                    Einen Moment bitte.
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
