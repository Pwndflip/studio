import { format } from 'date-fns';

export type Status = 'in-progress' | 'completed' | 'submitted' | 'ready-for-pickup';

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'in-progress', label: 'In Bearbeitung' },
  { value: 'completed', label: 'Abgeschlossen' },
  { value: 'submitted', label: 'Eingereicht' },
  { value: 'ready-for-pickup', label: 'Abholbereit' },
];

export type EditableField<T> = {
  value: T;
  lastEdited?: string;
};

export interface Customer {
  id: string;
  name: EditableField<string>;
  address: EditableField<string>;
  phone: EditableField<string>;
  device: EditableField<string>;
  errorDescription: EditableField<string>;
  notes: EditableField<string>;
  status: EditableField<Status>;
  createdAt: string;
}

export const initialCustomers: Customer[] = [
  {
    id: '1',
    name: { value: 'John Doe' },
    address: { value: 'Musterstraße 1, 10115 Berlin' },
    phone: { value: '+49 176 12345678' },
    device: { value: 'Siemens Waschmaschine' },
    errorDescription: { value: 'Schleudert nicht' },
    notes: { value: 'Kunde berichtet, dass die Maschine kein Wasser abpumpt und der Schleudervorgang nicht startet. Flusensieb bereits gereinigt. Verdacht auf defekte Pumpe.' },
    status: { value: 'in-progress' },
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: '2',
    name: { value: 'Jane Smith' },
    address: { value: 'Beispielweg 2, 20457 Hamburg' },
    phone: { value: '+49 151 87654321' },
    device: { value: 'Bosch Geschirrspüler' },
    errorDescription: { value: 'Heizt nicht' },
    notes: { value: 'Das Wasser bleibt kalt, Geschirr wird nicht sauber. Heizstab oder Thermostat könnte defekt sein. Programm bricht nach einiger Zeit ab.' },
    status: { value: 'submitted' },
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
  {
    id: '3',
    name: { value: 'Peter Jones' },
    address: { value: 'Testallee 3, 80331 München' },
    phone: { value: '+49 160 11223344' },
    device: { value: 'AEG Kühlschrank' },
    errorDescription: { value: 'Kühlt nicht mehr' },
    notes: { value: 'Kompressor läuft, aber keine Kühlleistung. Möglicherweise Kältemittelverlust oder Problem mit dem Thermostat. Kunde hat das Gerät bereits abgetaut.' },
    status: { value: 'completed' },
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: '4',
    name: { value: 'Mary Johnson' },
    address: { value: 'Feldweg 4, 50667 Köln' },
    phone: { value: '+49 171 55667788' },
    device: { value: 'Miele Backofen' },
    errorDescription: { value: 'Display zeigt Fehlercode F24' },
    notes: { value: 'Fehlercode deutet auf ein Problem mit der Türverriegelung hin. Tür schließt, aber der Ofen startet kein Programm. Verriegelungsmechanismus prüfen.' },
    status: { value: 'ready-for-pickup' },
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
    {
    id: '5',
    name: { value: 'Chris Lee' },
    address: { value: 'Waldstraße 5, 60311 Frankfurt am Main' },
    phone: { value: '+49 152 99887766' },
    device: { value: 'Neff Induktionskochfeld' },
    errorDescription: { value: 'Eine Kochzone ohne Funktion' },
    notes: { value: 'Die vordere linke Kochzone erkennt keine Töpfe. Die anderen Zonen funktionieren einwandfrei. Vermutlich ein defekter Induktor.' },
    status: { value: 'in-progress' },
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
  },
  {
    id: '6',
    name: { value: 'Patricia Williams' },
    address: { value: 'Hauptplatz 6, 70173 Stuttgart' },
    phone: { value: '+49 173 12312312' },
    device: { value: 'Liebherr Gefrierschrank' },
    errorDescription: { value: 'Starke Eisbildung' },
    notes: { value: 'Trotz No-Frost-Funktion starke Vereisung an der Rückwand. Türdichtung scheint in Ordnung zu sein. Problem mit dem Abtau-System vermutet.' },
    status: { value: 'submitted' },
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
  },
];
