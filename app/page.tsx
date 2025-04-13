import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-8 px-5 font-[family-name:var(--font-geist-sans)] justify-items-center space-y-5">
      <h1 className="font-bold">Optimize your Calories with OptiKcal</h1>
      <Button className="hover:bg-gray-600 active:bg-gray-700"><Link href="/signup">Get Started</Link></Button>
    </div>
  );
}
