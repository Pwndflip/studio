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
import { refineNotesAction } from "@/app/actions";
import type { Customer } from "@/app/dashboard/data";
import { STATUSES } from "@/app/dashboard/data";
import { Bot, Loader2, Trash2 } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  device: z.string().min(2, "Device name is required."),
  errorDescription: z.string().min(5, "Error description is required."),
  notes: z.string(),
  status: z.enum(["in-progress", "completed", "submitted", "ready-for-pickup"]),
});

type CustomerFormProps = {
  customer: Customer | null;
  onSave: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onDone: () => void;
};

export function CustomerForm({ customer, onSave, onDelete, onDone }: CustomerFormProps) {
  const { toast } = useToast();
  const [isRefining, setIsRefining] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || "",
      address: customer?.address || "",
      phone: customer?.phone || "",
      device: customer?.device || "",
      errorDescription: customer?.errorDescription || "",
      notes: customer?.notes || "",
      status: customer?.status || "submitted",
    },
  });

  async function handleRefineNotes() {
    setIsRefining(true);
    const currentNotes = form.getValues("notes");
    const result = await refineNotesAction(currentNotes);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "AI Refinement Failed",
        description: result.error,
      });
    } else {
      form.setValue("notes", result.refinedNotes, { shouldValidate: true });
      toast({
        title: "Notes Refined",
        description: "The customer notes have been improved by AI.",
      });
    }
    setIsRefining(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCustomerData = {
      ...(customer || {}),
      id: customer?.id || Date.now().toString(),
      avatarUrl: customer?.avatarUrl || `https://picsum.photos/seed/${Date.now()}/40/40`,
      imageHint: customer?.imageHint || 'person avatar',
      ...values,
    };
    onSave(newCustomerData as Customer);
    toast({
      title: "Customer Saved",
      description: `${values.name}'s details have been saved successfully.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input placeholder="555-123-4567" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="device"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device</FormLabel>
                <FormControl><Input placeholder="iPhone 14 Pro" {...field} /></FormControl>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="errorDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Error Description</FormLabel>
                <FormControl><Textarea placeholder="e.g. Cracked screen, won't turn on" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Internal Notes</FormLabel>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRefineNotes} disabled={isRefining}>
                    {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    Refine with AI
                  </Button>
                </div>
                <FormControl><Textarea placeholder="Add any internal notes here..." {...field} rows={5} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-between pt-4">
          <div>
            {customer && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the customer
                      record for {customer.name}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(customer.id)} className="bg-destructive hover:bg-destructive/90">
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
            <Button type="submit">Save Customer</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
