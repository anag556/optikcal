import { Suspense } from "react";
import LoginForm from "@/app/components/LoginForm";
import Navbar from "../components/landingNav";

export default function LoginPage() {
  return (
    <main className="min-h-screen items-center justify-center">
      <Navbar />
      <div className="items-center justify-center pt-5 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}