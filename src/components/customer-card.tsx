import type { Customer, Status } from "@/app/dashboard/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, MessageSquare, Computer, Wrench, User } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<Status, string> = {
  "in-progress": "bg-yellow-400/20 text-yellow-700 border-yellow-400/30 hover:bg-yellow-400/30 dark:text-yellow-400",
  "completed": "bg-green-400/20 text-green-700 border-green-400/30 hover:bg-green-400/30 dark:text-green-400",
  "submitted": "bg-blue-400/20 text-blue-700 border-blue-400/30 hover:bg-blue-400/30 dark:text-blue-400",
  "ready-for-pickup": "bg-purple-400/20 text-purple-700 border-purple-400/30 hover:bg-purple-400/30 dark:text-purple-400",
};

export function CustomerCard({ customer, onEdit }: { customer: Customer; onEdit: () => void; }) {
  const statusLabels: Record<Status, string> = {
    'in-progress': 'In Bearbeitung',
    'completed': 'Abgeschlossen',
    'submitted': 'Eingereicht',
    'ready-for-pickup': 'Abholbereit',
  };
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline">{customer.name}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className={cn("mt-1 capitalize", statusColors[customer.status])}>
                  {statusLabels[customer.status]}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-start gap-3 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="flex-1">{customer.address}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-start gap-3">
          <Computer className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div>
            <strong>{customer.device}:</strong>
            <span className="text-muted-foreground ml-1">{customer.errorDescription}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 text-muted-foreground">
          <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="line-clamp-2 flex-1">{customer.notes}</p>
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
