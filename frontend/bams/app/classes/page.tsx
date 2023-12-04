import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="container">
      <div className="text-center">
        <h1 className="font-bold text-4xl">
          Classes
        </h1>
        
      </div>
    </main>
  );
}
