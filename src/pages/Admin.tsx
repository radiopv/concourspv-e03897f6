import { Button } from "@/components/ui/button";

const Admin = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2">Administration</h1>
        <p className="text-gray-600">Gérez votre concours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          <p className="text-gray-600 mb-4">
            Gérez les questions du concours
          </p>
          <Button className="w-full">Gérer les questions</Button>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <p className="text-gray-600 mb-4">
            Consultez la liste des participants
          </p>
          <Button className="w-full">Voir les participants</Button>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tirage au sort</h2>
          <p className="text-gray-600 mb-4">
            Effectuez le tirage au sort
          </p>
          <Button className="w-full">Configurer le tirage</Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;