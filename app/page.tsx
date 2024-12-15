"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleClick = async () => {
    const response = await fetch("/api/hello");
    const data = await response.json();
    console.log(data);
    router.push(data.hello);
  };
  return (
    <div>
      <h1>What's your Moobimood ?</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}
