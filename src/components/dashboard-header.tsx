"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUSES } from "@/app/dashboard/data";
import type { Status } from "@/app/dashboard/data";
import { PlusCircle, Search, Archive, ArrowLeft } from "lucide-react";

type DashboardHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: Status | 'all';
  onStatusChange: (value: Status | 'all') => void;
  deviceFilter: string;
  onDeviceChange: (value: string) => void;
  devices: string[];
  onAddNew: () => void;
  isArchiveView: boolean;
  onToggleArchiveView: () => void;
};

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  deviceFilter,
  onDeviceChange,
  devices,
  onAddNew,
  isArchiveView,
  onToggleArchiveView,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Kunden suchen..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Nach Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={deviceFilter} onValueChange={onDeviceChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Nach Gerät filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Geräte</SelectItem>
            {devices.map((device) => (
              <SelectItem key={device} value={device}>
                {device}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onToggleArchiveView}>
          {isArchiveView ? <ArrowLeft className="mr-2 h-4 w-4"/> : <Archive className="mr-2 h-4 w-4" />}
          {isArchiveView ? "Zurück" : "Archiv"}
        </Button>
      </div>
      {!isArchiveView && (
        <Button onClick={onAddNew} className="ml-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Kunde hinzufügen
        </Button>
      )}
    </div>
  );
}
