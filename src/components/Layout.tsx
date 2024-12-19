import { LogoutButton } from "./auth/LogoutButton";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Concours
          </h1>
          <LogoutButton />
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;