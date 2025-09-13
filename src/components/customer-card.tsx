import type { Customer } from "@/app/dashboard/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, MessageSquare, Computer, Wrench, User, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";

const statusColors: Record<string, string> = {
  "In Werkstatt-Prüfüng": "bg-blue-400/20 text-blue-700 border-blue-400/30 hover:bg-blue-400/30 dark:text-blue-400",
  "Abgeschlossen": "bg-green-400/20 text-green-700 border-green-400/30 hover:bg-green-400/30 dark:text-green-400",
  "Ersatzteil Bestellt": "bg-orange-400/20 text-orange-700 border-orange-400/30 hover:bg-orange-400/30 dark:text-orange-400",
  "Fertig Für Auslieferung": "bg-purple-400/20 text-purple-700 border-purple-400/30 hover:bg-purple-400/30 dark:text-purple-400",
  "Gerät wird von Kunden Gebracht": "bg-pink-400/20 text-pink-700 border-pink-400/30 hover:bg-pink-400/30 dark:text-pink-400",
  "Gerät wird von uns abgeholt": "bg-yellow-400/20 text-yellow-700 border-yellow-400/30 hover:bg-yellow-400/30 dark:text-yellow-400",
};

const typColors: Record<string, string> = {
  "KD": "bg-gray-400/20 text-gray-700 border-gray-400/30",
  "Rkl": "bg-red-400/20 text-red-700 border-red-400/30",
};

export function CustomerCard({ customer, onEdit }: { customer: Customer; onEdit: () => void; }) {
  const displayDateStr = customer.notizEditDate || customer.datum;
  
  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    
    // Try parsing 'yyyy-MM-dd' ISO format first
    let date = parseISO(dateString);
    if (isValid(date)) return date;
    
    // Try parsing 'dd.MM.yyyy' format
    const parts = dateString.split('.');
    if (parts.length === 3) {
      // Note: new Date(year, monthIndex, day)
      date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      if (isValid(date)) return date;
    }
    
    // Fallback for other potential string formats that Date.parse might handle
    date = new Date(dateString);
    if (isValid(date)) return date;
    
    return null; // Return null if all parsing fails
  }

  const displayDate = parseDate(displayDateStr);

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-xl rounded-2xl bg-transparent">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl bg-muted/80">
                {customer.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline">{customer.name}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 flex-wrap">
                 {customer.status && (
                    <Badge variant="outline" className={cn("mt-1 capitalize", statusColors[customer.status] || "bg-gray-400/20 text-gray-700 border-gray-400/30")}>
                        {customer.status}
                    </Badge>
                 )}
                 {customer.typ && (
                    <Badge variant="outline" className={cn("mt-1", typColors[customer.typ] || "bg-gray-400/20 text-gray-700 border-gray-400/30")}>
                        {customer.typ}
                    </Badge>
                 )}
              </CardDescription>
            </div>
          </div>
          {displayDate && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 pt-1">
                <CalendarDays className="w-3 h-3"/>
                <span>{format(displayDate, 'dd.MM.yyyy')}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-start gap-3 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="flex-1">{customer.adresse}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{customer.telefon}</span>
        </div>
        <div className="flex items-start gap-3">
          <Computer className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div>
            <strong>{customer.gerät}:</strong>
            <span className="text-muted-foreground ml-1">{customer.problem}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-muted-foreground">
          <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="line-clamp-2 flex-1">{customer.notiz}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full" onClick={onEdit}>
          <Wrench className="mr-2 h-4 w-4" /> Details bearbeiten
        </Button>
      </CardFooter>
    </Card>
  );
}
