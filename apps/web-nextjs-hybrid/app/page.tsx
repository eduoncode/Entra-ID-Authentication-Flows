import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          const { signIn } = await import("@/auth");
          await signIn("microsoft-entra-id");
        }}
      >
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Login com Entra ID
        </button>
      </form>
    );
  }

  const userRes = await fetch("http://localhost:3002/user/profile", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const userData = await userRes.json();

  const adminRes = await fetch("http://localhost:3002/admin/dashboard", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const adminData = await adminRes.json();

  const oboRes = await fetch("http://localhost:3002/user/profile-downstream", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const oboData = await oboRes.json();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Bem-vindo, {session.user?.name}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold text-lg text-blue-700">
            Acesso User (Scopes)
          </h2>
          <pre className="bg-slate-100 p-4 mt-2 text-sm text-black rounded">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-red-700">
            Acesso Admin (Roles)
          </h2>
          <pre className="bg-slate-200 p-4 mt-2 text-sm text-black rounded">
            {JSON.stringify(adminData, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-blue-700">
            Acesso On-Behalf-Of User
          </h2>
          <pre className="bg-slate-100 p-4 mt-2 text-sm text-black rounded">
            {JSON.stringify(oboData, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
