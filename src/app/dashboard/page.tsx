"use client";

import { useState, useMemo } from 'react';
import { initialCustomers } from './data';
import type { Customer, Status, EditableField } from './data';
import { CustomerList } from '@/components/customer-list';
import { DashboardHeader } from '@/components/dashboard-header';
import { CustomerFormDialog } from '@/components/customer-form-dialog';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        customer.name.value.toLowerCase().includes(searchLower) ||
        customer.phone.value.toLowerCase().includes(searchLower) ||
        customer.address.value.toLowerCase().includes(searchLower) ||
        customer.device.value.toLowerCase().includes(searchLower) ||
        customer.status.value.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || customer.status.value === statusFilter;
      const matchesDevice = deviceFilter === 'all' || customer.device.value === deviceFilter;

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
    if (editingCustomer) {
      // Create a deep copy to avoid direct state mutation
      const updatedCustomer = JSON.parse(JSON.stringify(editingCustomer));
      
      const now = new Date().toISOString();
      let hasChanged = false;

      // Iterate over fields to update values and timestamps
      for (const key in customerData) {
        if (key !== 'id' && key !== 'createdAt') {
          const field = key as keyof Omit<Customer, 'id' | 'createdAt'>;
          const oldValue = editingCustomer[field]?.value;
          const newValue = customerData[field]?.value;

          if (oldValue !== newValue) {
            updatedCustomer[field] = {
              value: newValue,
              lastEdited: now,
            };
            hasChanged = true;
          }
        }
      }
      
      if(hasChanged) {
          setCustomers(customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }

    } else {
      // New customer
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
      };
      setCustomers([newCustomer, ...customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setIsFormOpen(false);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    setIsFormOpen(false);
  }

  const allDevices = useMemo(() => [...new Set(initialCustomers.map(c => c.device.value).sort())], []);

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
      <CustomerList customers={filteredCustomers} onEdit={handleEdit} />
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
