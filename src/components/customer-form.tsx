"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/app/dashboard/data";
import { STATUSES, TYPEN } from "@/app/dashboard/data";
import { Trash2, Calendar as CalendarIcon, Archive, ArchiveRestore } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { de } from "date-fns/locale";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Der Name muss mindestens 2 Zeichen lang sein."),
  adresse: z.string().optional().nullable(),
  telefon: z.string().optional().nullable(),
  gerät: z.string().min(2, "Gerätename ist erforderlich."),
  problem: z.string().min(5, "Fehlerbeschreibung ist erforderlich."),
  notiz: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  datum: z.string(),
  notizEditDate: z.string().optional().nullable(),
  fehlercode: z.string().optional().nullable(),
  typ: z.string().optional().nullable(),
});

type CustomerFormProps = {
  customer: Customer | null;
  onSave: (values: z.infer<typeof formSchema>) => void;
  onDelete: (customerId: string) => void;
  onArchive: (customer: Customer) => void;
  onUnarchive: (customer: Customer) => void;
  isArchiveView: boolean;
  onDone: () => void;
};

export function CustomerForm({ customer, onSave, onDelete, onDone, onArchive, onUnarchive, isArchiveView }: CustomerFormProps) {
  const { toast } = useToast();

  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    let date = parseISO(dateString);
    if (isValid(date)) return date;
    const parts = dateString.split('.');
    if (parts.length === 3) {
      date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      if (isValid(date)) return date;
    }
    date = new Date(dateString);
    if (isValid(date)) return date;
    return null; 
  }

  const defaultDatum = customer?.datum ? parseDate(customer.datum) : new Date();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: customer ? {
      ...customer,
      datum: defaultDatum?.toISOString() ?? new Date().toISOString(),
    } : {
      name: "",
      adresse: "",
      telefon: "",
      gerät: "",
      problem: "",
      notiz: "",
      status: "In Werkstatt-Prüfüng",
      datum: new Date().toISOString(),
      fehlercode: "",
      typ: "KD",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const submissionValues = {
        ...values,
        datum: format(parseISO(values.datum), 'yyyy-MM-dd'),
    };
    onSave(submissionValues);
    toast({
      title: "Kunde gespeichert",
      description: `Die Daten von ${values.name} wurden erfolgreich gespeichert.`,
    });
  }
  
  const lastEditedDate = parseDate(customer?.notizEditDate);

  const handleArchive = () => {
    if(customer) {
        onArchive(customer);
        toast({
            title: "Kunde archiviert",
            description: `Der Eintrag für ${customer.name} wurde ins Archiv verschoben.`,
        });
    }
  }

  const handleUnarchive = () => {
    if(customer) {
        onUnarchive(customer);
        toast({
            title: "Kunde dearchiviert",
            description: `Der Eintrag für ${customer.name} wurde aus dem Archiv wiederhergestellt.`,
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vollständiger Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl><Input placeholder="+49 176 12345678" {...field} value={field.value ?? ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl><Input placeholder="Musterstraße 123, 12345 Musterstadt" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="gerät"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gerät</FormLabel>
                    <FormControl><Input placeholder="z.B. Siemens Waschmaschine" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Status auswählen" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typ"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Typ auswählen" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPEN.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="datum"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Erstellungsdatum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(parseISO(field.value), "PPP", { locale: de })
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? parseISO(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={de}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          <div className="space-y-4 flex flex-col">
             <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problembeschreibung</FormLabel>
                    <FormControl><Textarea placeholder="z.B. schleudert nicht, heizt nicht" {...field} value={field.value ?? ""} rows={5} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
                control={form.control}
                name="notiz"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-grow">
                    <div className="flex items-center justify-between">
                      <FormLabel>Interne Notizen</FormLabel>
                    </div>
                    <FormControl><Textarea placeholder="Fügen Sie hier interne Notizen hinzu..." {...field} value={field.value ?? ""} className="flex-grow" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {lastEditedDate && (
                <div className="text-xs text-muted-foreground pt-1 text-right">
                    Zuletzt bearbeitet: {format(lastEditedDate, "dd.MM.yyyy")}
                </div>
              )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            {customer && customer.id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird der Kundendatensatz für {customer.name} dauerhaft gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(customer.id!)} className="bg-destructive hover:bg-destructive/90">
                      Fortsetzen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
             {customer && customer.id && (
                isArchiveView ? (
                    <Button type="button" variant="secondary" onClick={handleUnarchive}>
                        <ArchiveRestore className="mr-2 h-4 w-4" /> Dearchivieren
                    </Button>
                ) : (
                    <Button type="button" variant="secondary" onClick={handleArchive}>
                        <Archive className="mr-2 h-4 w-4" /> Archivieren
                    </Button>
                )
             )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onDone}>Abbrechen</Button>
            <Button type="submit">Kunde speichern</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
