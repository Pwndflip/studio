import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">
              KundenAI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 p-6">
            <p className="text-center text-muted-foreground">
              Ihr KI-gestütztes Kundenmanagement-Tool.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">Dashboard betreten</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
