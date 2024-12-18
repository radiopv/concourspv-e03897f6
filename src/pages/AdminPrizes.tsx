import PrizeCatalogManager from "@/components/admin/PrizeCatalogManager";

const AdminPrizes = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des prix</h1>
      <PrizeCatalogManager />
    </div>
  );
};

export default AdminPrizes;