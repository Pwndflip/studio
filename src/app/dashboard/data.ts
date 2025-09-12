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
    address: 'Musterstraße 1, 10115 Berlin',
    phone: '+49 176 12345678',
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
    address: 'Beispielweg 2, 20457 Hamburg',
    phone: '+49 151 87654321',
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
    address: 'Testallee 3, 80331 München',
    phone: '+49 160 11223344',
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
    address: 'Feldweg 4, 50667 Köln',
    phone: '+49 171 55667788',
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
    address: 'Waldstraße 5, 60311 Frankfurt am Main',
    phone: '+49 152 99887766',
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
    address: 'Hauptplatz 6, 70173 Stuttgart',
    phone: '+49 173 12312312',
    device: 'Liebherr Gefrierschrank',
    errorDescription: 'Starke Eisbildung',
    notes: 'Trotz No-Frost-Funktion starke Vereisung an der Rückwand. Türdichtung scheint in Ordnung zu sein. Problem mit dem Abtau-System vermutet.',
    status: 'submitted',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    lastEdited: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
];
