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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { refineNotesAction } from "@/app/actions";
import type { Customer } from "@/app/dashboard/data";
import { STATUSES } from "@/app/dashboard/data";
import { Bot, Loader2, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
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
import { format, toDate } from "date-fns";
import { de } from "date-fns/locale";

const editableStringSchema = z.object({
  value: z.string(),
  lastEdited: z.string().optional(),
});

const formSchema = z.object({
  name: editableStringSchema.extend({ value: z.string().min(2, "Der Name muss mindestens 2 Zeichen lang sein.") }),
  address: editableStringSchema.extend({ value: z.string().min(5, "Die Adresse muss mindestens 5 Zeichen lang sein.") }),
  phone: editableStringSchema.extend({ value: z.string().min(7, "Bitte geben Sie eine gültige Telefonnummer ein.") }),
  device: editableStringSchema.extend({ value: z.string().min(2, "Gerätename ist erforderlich.") }),
  errorDescription: editableStringSchema.extend({ value: z.string().min(5, "Fehlerbeschreibung ist erforderlich.") }),
  notes: editableStringSchema,
  status: z.object({ value: z.enum(["in-progress", "completed", "submitted", "ready-for-pickup"]), lastEdited: z.string().optional() }),
  createdAt: z.string(),
});

type CustomerFormProps = {
  customer: Customer | null;
  onSave: (values: z.infer<typeof formSchema>) => void;
  onDelete: (customerId: string) => void;
  onDone: () => void;
};

export function CustomerForm({ customer, onSave, onDelete, onDone }: CustomerFormProps) {
  const { toast } = useToast();
  const [isRefining, setIsRefining] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: customer ? {
      ...customer
    } : {
      name: { value: "" },
      address: { value: "" },
      phone: { value: "" },
      device: { value: "" },
      errorDescription: { value: "" },
      notes: { value: "" },
      status: { value: "in-progress" },
      createdAt: new Date().toISOString(),
    },
  });

  async function handleRefineNotes() {
    setIsRefining(true);
    const currentNotes = form.getValues("notes.value");
    const result = await refineNotesAction(currentNotes);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "KI-Verfeinerung fehlgeschlagen",
        description: result.error,
      });
    } else {
      form.setValue("notes.value", result.refinedNotes, { shouldValidate: true });
      toast({
        title: "Notizen verfeinert",
        description: "Die Kundennotizen wurden durch KI verbessert.",
      });
    }
    setIsRefining(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    toast({
      title: "Kunde gespeichert",
      description: `Die Daten von ${values.name.value} wurden erfolgreich gespeichert.`,
    });
  }
  
  const FieldLastEdited = ({ date }: { date?: string }) => {
    if (!date) return null;
    return (
        <FormDescription className="text-xs pt-1">
            Zuletzt bearbeitet: {format(toDate(date), "dd.MM.yyyy, HH:mm")}
        </FormDescription>
    );
  };

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
                  <FormControl><Input placeholder="John Doe" {...field} value={field.value.value} onChange={e => field.onChange({ ...field.value, value: e.target.value })} /></FormControl>
                  <FormMessage />
                  <FieldLastEdited date={field.value.lastEdited} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl><Input placeholder="+49 123 4567890" {...field} value={field.value.value} onChange={e => field.onChange({ ...field.value, value: e.target.value })} /></FormControl>
                  <FormMessage />
                  <FieldLastEdited date={field.value.lastEdited} />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl><Input placeholder="Musterstraße 123, Musterstadt, Deutschland" {...field} value={field.value.value} onChange={e => field.onChange({ ...field.value, value: e.target.value })} /></FormControl>
                    <FormMessage />
                    <FieldLastEdited date={field.value.lastEdited} />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gerät</FormLabel>
                    <FormControl><Input placeholder="z.B. Siemens Waschmaschine" {...field} value={field.value.value} onChange={e => field.onChange({ ...field.value, value: e.target.value })} /></FormControl>
                    <FormMessage />
                    <FieldLastEdited date={field.value.lastEdited} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(value) => field.onChange({ ...field.value, value })} defaultValue={field.value.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Status auswählen" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FieldLastEdited date={field.value.lastEdited} />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="createdAt"
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
                              format(toDate(field.value), "PPP", { locale: de })
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
                          selected={toDate(field.value)}
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
                name="errorDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fehlerbeschreibung</FormLabel>
                    <FormControl><Textarea placeholder="z.B. schleudert nicht, heizt nicht" {...field} value={field.value.value} onChange={e => field.onChange({ ...field.value, value: e.target.value })} rows={5} /></FormControl>
                    <FormMessage />
                    <FieldLastEdited date={field.value.lastEdited} />
                  </FormItem>
                )}
              />
            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-grow">
                    <div className="flex items-center justify-between">
                      <FormLabel>Interne Notizen</FormLabel>
                      <Button type="button" variant="ghost" size="sm" onClick={handleRefineNotes} disabled={isRefining}>
                        {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        Mit KI verfeinern
                      </Button>
                    </div>
                    <FormControl><Textarea placeholder="Fügen Sie hier interne Notizen hinzu..." {...field} value={field.value.value} onChange={e => field.onChange({ ...field.value, value: e.target.value })} className="flex-grow" /></FormControl>
                    <FormMessage />
                    <FieldLastEdited date={field.value.lastEdited} />
                  </FormItem>
                )}
              />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {customer && (
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
                      Diese Aktion kann nicht rückgängig gemacht werden. Dadurch wird der Kundendatensatz für {customer.name.value} dauerhaft gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(customer.id)} className="bg-destructive hover:bg-destructive/90">
                      Fortsetzen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
