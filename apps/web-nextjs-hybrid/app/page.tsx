import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(JSON.stringify(session, null, 2));

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          const { signIn } = await import("@/auth");
          await signIn("microsoft-entra-id");
        }}
      >
        <button type="submit">Login com Entra ID</button>
      </form>
    );
  }

  const res = await fetch("http://localhost:3002/user/profile", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const apiData = await res.json();

  return (
    <main className="p-8">
      <h1>Bem-vindo, {session.user?.name}</h1>
      <pre className="bg-gray-100 p-4 mt-4 text-black">
        {JSON.stringify(apiData, null, 2)}
      </pre>
    </main>
  );
}
