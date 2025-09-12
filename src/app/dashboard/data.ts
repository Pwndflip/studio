import { format } from 'date-fns';

export type Status = 
  | "Abgeschlossen"
  | "Ersatzteil Bestellt"
  | "Fertig Für Auslieferung"
  | "Gerät wird von Kunden Gebracht"
  | "Gerät wird von uns abgeholt"
  | "In Werkstatt-Prüfüng";


export const STATUSES: { value: Status; label: string }[] = [
  { value: 'Abgeschlossen', label: 'Abgeschlossen' },
  { value: 'Ersatzteil Bestellt', label: 'Ersatzteil Bestellt' },
  { value: 'Fertig Für Auslieferung', label: 'Fertig Für Auslieferung' },
  { value: 'Gerät wird von Kunden Gebracht', label: 'Kunde bringt Gerät' },
  { value: 'Gerät wird von uns abgeholt', label: 'Abholung durch uns' },
  { value: 'In Werkstatt-Prüfüng', label: 'In Werkstatt-Prüfüng' },
];

export interface Customer {
  id: string;
  name: string;
  adresse: string;
  telefon: string;
  gerät: string;
  problem: string;
  notiz: string;
  status: Status;
  datum: string;
  notizEditDate?: string;
  fehlercode?: string;
  typ?: string;
}

// This is not used anymore since we are fetching from the database, but keeping it for reference
export const initialCustomers: Omit<Customer, 'id'>[] = [];
