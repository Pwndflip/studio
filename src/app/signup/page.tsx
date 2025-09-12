"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, UserPlus } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { app } from "@/lib/firebase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Fehler bei der Registrierung",
        description: "Die Passwörter stimmen nicht überein.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Registrierung erfolgreich",
        description: "Sie werden zum Dashboard weitergeleitet.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      let description = "Ein unbekannter Fehler ist aufgetreten.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Diese E-Mail-Adresse wird bereits verwendet.";
      } else if (error.code === 'auth/weak-password') {
        description = "Das Passwort ist zu schwach. Es muss mindestens 6 Zeichen lang sein.";
      }
      toast({
        variant: "destructive",
        title: "Registrierung fehlgeschlagen",
        description: description,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Database className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">
              Konto erstellen
            </CardTitle>
            <CardDescription>
              Registrieren Sie sich, um WGM-Daten zu nutzen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrieren..." : "Konto erstellen"}
                {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Haben Sie bereits ein Konto? <Link href="/" className="text-primary hover:underline">Anmelden</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
