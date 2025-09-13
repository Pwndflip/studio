"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Customer, Status } from './data';
import { CustomerList } from '@/components/customer-list';
import { DashboardHeader } from '@/components/dashboard-header';
import { CustomerFormDialog } from '@/components/customer-form-dialog';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 25;

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [archivedCustomers, setArchivedCustomers] = useState<Customer[]>([]);
  const [allDevices, setAllDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isArchiveView, setIsArchiveView] = useState(false);

  useEffect(() => {
    const customersRef = ref(db, 'einträge');
    const unsubscribe = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedCustomers: Customer[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Customer, 'id'>),
        }));
        
        const sortedCustomers = loadedCustomers.sort((a, b) => {
            const dateA = a.datum ? new Date(a.datum).getTime() : 0;
            const dateB = b.datum ? new Date(b.datum).getTime() : 0;
            return dateB - dateA;
        });

        setCustomers(sortedCustomers);
      } else {
        setCustomers([]);
      }
      setTimeout(() => setIsLoading(false), 500);
    }, (error) => {
        console.error("Firebase read failed on 'einträge': ", error);
        alert("Could not connect to Firebase. Please check your configuration in src/lib/firebase.ts and ensure the database is accessible.");
        setCustomers([]);
        setTimeout(() => setIsLoading(false), 500);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const archiveRef = ref(db, 'archiv');
    const unsubscribe = onValue(archiveRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedCustomers: Customer[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Customer, 'id'>),
        }));
        const sortedCustomers = loadedCustomers.sort((a, b) => {
            const dateA = a.datum ? new Date(a.datum).getTime() : 0;
            const dateB = b.datum ? new Date(b.datum).getTime() : 0;
            return dateB - dateA;
        });
        setArchivedCustomers(sortedCustomers);
      } else {
        setArchivedCustomers([]);
      }
    }, (error) => {
        console.error("Firebase read failed on 'archiv': ", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const allCustomers = [...customers, ...archivedCustomers];
    const uniqueDevices = [...new Set(allCustomers.map(c => c.gerät).filter(Boolean).sort())];
    setAllDevices(uniqueDevices);
  }, [customers, archivedCustomers]);

  const sourceCustomers = useMemo(() => isArchiveView ? archivedCustomers : customers, [isArchiveView, customers, archivedCustomers]);

  const filteredCustomers = useMemo(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    return sourceCustomers.filter((customer) => {
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
  }, [sourceCustomers, searchQuery, statusFilter, deviceFilter]);

  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice(0, visibleCount);
  }, [filteredCustomers, visibleCount]);
  
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
      if (visibleCount < filteredCustomers.length) {
         setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
      }
    }
  }, [visibleCount, filteredCustomers.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id'> & { id?: string }) => {
    const sourcePath = isArchiveView ? 'archiv' : 'einträge';
    if (customerData.id) { // Editing existing customer
      const customerRef = ref(db, `${sourcePath}/${customerData.id}`);
      const { id, ...dataToSave } = customerData;
      set(customerRef, {
        ...dataToSave,
        notizEditDate: format(new Date(), 'dd.MM.yyyy')
      });
    } else { // Adding new customer
      const customersRef = ref(db, sourcePath);
      const newCustomerRef = push(customersRef);
      const { id, ...dataToSave } = customerData;
      set(newCustomerRef, {
        ...dataToSave,
        datum: format(new Date(), 'yyyy-MM-dd'),
        notizEditDate: format(new Date(), 'dd.MM.yyyy')
      });
    }
    setIsFormOpen(false);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    const sourcePath = isArchiveView ? 'archiv' : 'einträge';
    const customerRef = ref(db, `${sourcePath}/${customerId}`);
    remove(customerRef);
    setIsFormOpen(false);
  }

  const moveCustomer = (customer: Customer, from: 'einträge' | 'archiv', to: 'einträge' | 'archiv') => {
    if (!customer.id) return;
    const fromRef = ref(db, `${from}/${customer.id}`);
    const toRef = ref(db, `${to}/${customer.id}`);
    const { id, ...dataToMove } = customer;
    set(toRef, dataToMove);
    remove(fromRef);
    setIsFormOpen(false);
  }

  const handleArchiveCustomer = (customer: Customer) => {
    moveCustomer(customer, 'einträge', 'archiv');
  }
  
  const handleUnarchiveCustomer = (customer: Customer) => {
    moveCustomer(customer, 'archiv', 'einträge');
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
        isArchiveView={isArchiveView}
        onToggleArchiveView={() => setIsArchiveView(!isArchiveView)}
      />
      {isLoading ? (
         <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4">
            <div className="flex flex-col items-center gap-1 text-center p-8">
                <h3 className="text-2xl font-bold tracking-tight">Verbinde mit Datenbank...</h3>
                <p className="text-sm text-muted-foreground">
                    Einen Moment bitte. Wenn dies lange dauert, überprüfen Sie bitte Ihre Firebase-Konfiguration.
                </p>
            </div>
         </div>
      ) : (
        <CustomerList customers={paginatedCustomers} onEdit={handleEdit} isArchiveView={isArchiveView} />
      )}
       <footer className="text-center text-sm text-muted-foreground mt-4">
        {paginatedCustomers.length} von {filteredCustomers.length} Einträgen angezeigt. Insgesamt: {sourceCustomers.length}
      </footer>
      <CustomerFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
        onDelete={handleDeleteCustomer}
        onArchive={handleArchiveCustomer}
        onUnarchive={handleUnarchiveCustomer}
        isArchiveView={isArchiveView}
      />
    </>
  );
}
