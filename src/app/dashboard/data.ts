import { format } from 'date-fns';

export type Status = 'in-progress' | 'completed' | 'submitted' | 'ready-for-pickup';

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'in-progress', label: 'In Bearbeitung' },
  { value: 'completed', label: 'Abgeschlossen' },
  { value: 'submitted', label: 'Eingereicht' },
  { value: 'ready-for-pickup', label: 'Abholbereit' },
];

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  device: string;
  errorDescription: string;
  notes: string;
  status: Status;
  createdAt: string;
  lastEdited: string;
}

export const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    address: '123 Main St, Anytown, USA',
    phone: '555-1234',
    device: 'Siemens Waschmaschine',
    errorDescription: 'Schleudert nicht',
    notes: 'Kunde berichtet, dass die Maschine kein Wasser abpumpt und der Schleudervorgang nicht startet. Flusensieb bereits gereinigt. Verdacht auf defekte Pumpe.',
    status: 'in-progress',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    lastEdited: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    address: '456 Oak Ave, Somecity, USA',
    phone: '555-5678',
    device: 'Bosch Geschirrspüler',
    errorDescription: 'Heizt nicht',
    notes: 'Das Wasser bleibt kalt, Geschirr wird nicht sauber. Heizstab oder Thermostat könnte defekt sein. Programm bricht nach einiger Zeit ab.',
    status: 'submitted',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    lastEdited: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: '3',
    name: 'Peter Jones',
    address: '789 Pine Ln, Yourtown, USA',
    phone: '555-9012',
    device: 'AEG Kühlschrank',
    errorDescription: 'Kühlt nicht mehr',
    notes: 'Kompressor läuft, aber keine Kühlleistung. Möglicherweise Kältemittelverlust oder Problem mit dem Thermostat. Kunde hat das Gerät bereits abgetaut.',
    status: 'completed',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    lastEdited: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: '4',
    name: 'Mary Johnson',
    address: '101 Maple Dr, Ourcity, USA',
    phone: '555-3456',
    device: 'Miele Backofen',
    errorDescription: 'Display zeigt Fehlercode F24',
    notes: 'Fehlercode deutet auf ein Problem mit der Türverriegelung hin. Tür schließt, aber der Ofen startet kein Programm. Verriegelungsmechanismus prüfen.',
    status: 'ready-for-pickup',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    lastEdited: new Date().toISOString(),
  },
    {
    id: '5',
    name: 'Chris Lee',
    address: '212 Birch Rd, Newville, USA',
    phone: '555-7890',
    device: 'Neff Induktionskochfeld',
    errorDescription: 'Eine Kochzone ohne Funktion',
    notes: 'Die vordere linke Kochzone erkennt keine Töpfe. Die anderen Zonen funktionieren einwandfrei. Vermutlich ein defekter Induktor.',
    status: 'in-progress',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    lastEdited: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
  {
    id: '6',
    name: 'Patricia Williams',
    address: '333 Elm Ct, Oldtown, USA',
    phone: '555-2345',
    device: 'Liebherr Gefrierschrank',
    errorDescription: 'Starke Eisbildung',
    notes: 'Trotz No-Frost-Funktion starke Vereisung an der Rückwand. Türdichtung scheint in Ordnung zu sein. Problem mit dem Abtau-System vermutet.',
    status: 'submitted',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    lastEdited: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
];
