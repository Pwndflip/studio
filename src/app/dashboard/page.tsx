"use client";

import { useState, useMemo } from 'react';
import { initialCustomers } from './data';
import type { Customer, Status } from './data';
import { CustomerList } from '@/components/customer-list';
import { DashboardHeader } from '@/components/dashboard-header';
import { CustomerFormDialog } from '@/components/customer-form-dialog';
import { format } from 'date-fns';

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

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'lastEdited'> & { id?: string }) => {
    const now = new Date().toISOString();
    if (editingCustomer) {
      const updatedCustomer = { ...editingCustomer, ...customerData, lastEdited: now };
      setCustomers(customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } else {
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        lastEdited: now,
      };
      setCustomers([newCustomer, ...customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setIsFormOpen(false);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    setIsFormOpen(false);
  }

  const allDevices = useMemo(() => [...new Set(initialCustomers.map(c => c.device).sort())], []);

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
