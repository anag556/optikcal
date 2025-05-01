import SignupForm from "@/app/components/SignupForm";
import Navbar from "../components/landingNav";

export default function SignupPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="text-center align-middle pt-5 p-4">
        <SignupForm />
      </div>
    </main>
  );
}