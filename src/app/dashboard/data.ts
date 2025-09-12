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
}

export const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    address: '123 Main St, Anytown, USA',
    phone: '555-1234',
    device: 'iPhone 13',
    errorDescription: 'Cracked screen',
    notes: 'Customer dropped phone. Screen is completely shattered. Back glass is also cracked. Recommended full replacement.',
    status: 'in-progress',
  },
  {
    id: '2',
    name: 'Jane Smith',
    address: '456 Oak Ave, Somecity, USA',
    phone: '555-5678',
    device: 'Samsung Galaxy S21',
    errorDescription: 'Battery not charging',
    notes: 'Phone does not charge with any cable. Charging port seems to be loose. Needs port replacement.',
    status: 'submitted',
  },
  {
    id: '3',
    name: 'Peter Jones',
    address: '789 Pine Ln, Yourtown, USA',
    phone: '555-9012',
    device: 'Google Pixel 6',
    errorDescription: 'Water damage',
    notes: 'Dropped in a pool. Phone does not turn on. Rice did not work. Needs full diagnostic.',
    status: 'completed',
  },
  {
    id: '4',
    name: 'Mary Johnson',
    address: '101 Maple Dr, Ourcity, USA',
    phone: '555-3456',
    device: 'iPhone X',
    errorDescription: 'Speaker not working',
    notes: 'No sound from earpiece speaker during calls. Loudspeaker works fine.',
    status: 'ready-for-pickup',
  },
    {
    id: '5',
    name: 'Chris Lee',
    address: '212 Birch Rd, Newville, USA',
    phone: '555-7890',
    device: 'MacBook Pro 16"',
    errorDescription: 'Keyboard issues',
    notes: 'Several keys are not responding. No liquid spills reported. Butterfly keyboard model.',
    status: 'in-progress',
  },
  {
    id: '6',
    name: 'Patricia Williams',
    address: '333 Elm Ct, Oldtown, USA',
    phone: '555-2345',
    device: 'iPhone 12 Mini',
    errorDescription: 'Face ID not working',
    notes: 'Face ID stopped working after latest iOS update. "A problem was detected with the TrueDepth camera." message appears. No visible damage.',
    status: 'submitted',
  },
];
