"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Database, LogOut } from "lucide-react";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";

function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Database className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-muted-foreground">Lade Benutzerdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-4 z-20 flex h-16 items-center gap-4 border bg-background/60 backdrop-blur-xl md:px-6 mx-4 mt-4 rounded-xl shadow-md">
        <nav className="flex-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Database className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold">WGM-Daten</span>
          </Link>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Benutzermenü umschalten</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Einstellungen</DropdownMenuItem>
            <DropdownMenuItem disabled>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Abmelden</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedDashboardLayout>{children}</ProtectedDashboardLayout>
    </AuthProvider>
  );
}
