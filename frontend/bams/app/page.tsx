import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="container">
      <div className="text-center">
        <h1 className="font-bold text-4xl">
          Best Attendance Management System
        </h1>
        {session?.user ? (
          <div>
            <p>Logged in as: {session?.user.email}</p>
            <p>Role: {session?.user.role}</p>
            <p>Token: {session?.user.token}</p>
          </div>
        ) : (
          <div>
            <p>Not logged in yet!</p>
          </div>
        )}
      </div>
    </main>
  );
}
