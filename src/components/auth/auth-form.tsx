
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth"; // Updated import
import { Briefcase } from "lucide-react"; // Example icon, can be changed

export function AuthForm() {
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [emailSignup, setEmailSignup] = useState("");
  const [phoneSignup, setPhoneSignup] = useState("");
  const [nameSignup, setNameSignup] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");
  const { login, signup } = useAuth(); // Updated hook usage

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email: emailLogin }); 
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ email: emailSignup, phone: phoneSignup, name: nameSignup });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center mb-8 text-primary">
        <Briefcase size={48} className="mr-3" /> {/* Consider updating icon if needed */}
        <h1 className="text-4xl font-bold">ZimSave+</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">Securely access your financial tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="you@example.com"
                    value={emailLogin}
                    onChange={(e) => setEmailLogin(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    placeholder="••••••••"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <Label htmlFor="name-signup">Full Name</Label>
                  <Input
                    id="name-signup"
                    placeholder="John Doe"
                    value={nameSignup}
                    onChange={(e) => setNameSignup(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="you@example.com"
                    value={emailSignup}
                    onChange={(e) => setEmailSignup(e.target.value)}
                    required
                  />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="phone-signup">Phone (Optional)</Label>
                  <Input
                    id="phone-signup"
                    type="tel"
                    placeholder="+263 77X XXX XXX"
                    value={phoneSignup}
                    onChange={(e) => setPhoneSignup(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={passwordSignup}
                    onChange={(e) => setPasswordSignup(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
