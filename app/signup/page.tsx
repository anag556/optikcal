import SignupForm from "@/app/components/SignupForm";
import Navbar from "../components/landingNav";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex-col items-center justify-center">
      <Navbar />
      <div className="max-w-3xl text-center pt-5 p-4">
        <SignupForm />
      </div>
    </main>
  );
}