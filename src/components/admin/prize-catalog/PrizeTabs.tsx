import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Grid, List } from "lucide-react";
import { useState } from "react";
import PrizeGrid from "./PrizeGrid";
import PrizeTable from "./PrizeTable";

interface PrizeTabsProps {
  prizes: any[];
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, status: 'active' | 'archived') => void;
  onVisibilityToggle: (id: string, isVisible: boolean) => void;
}

const PrizeTabs = ({
  prizes,
  onEdit,
  onDelete,
  onArchive,
  onVisibilityToggle
}: PrizeTabsProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const activePrizes = prizes.filter(prize => prize.status === 'active');
  const archivedPrizes = prizes.filter(prize => prize.status === 'archived');

  return (
    <Tabs defaultValue="active" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="active">Actifs ({activePrizes.length})</TabsTrigger>
          <TabsTrigger value="archived">Archivés ({archivedPrizes.length})</TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100' : ''}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${viewMode === 'table' ? 'bg-purple-100' : ''}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <TabsContent value="active">
        {viewMode === 'grid' ? (
          <PrizeGrid
            prizes={activePrizes}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onVisibilityToggle={onVisibilityToggle}
          />
        ) : (
          <PrizeTable
            prizes={activePrizes}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onVisibilityToggle={onVisibilityToggle}
          />
        )}
      </TabsContent>

      <TabsContent value="archived">
        {viewMode === 'grid' ? (
          <PrizeGrid
            prizes={archivedPrizes}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onVisibilityToggle={onVisibilityToggle}
          />
        ) : (
          <PrizeTable
            prizes={archivedPrizes}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onVisibilityToggle={onVisibilityToggle}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PrizeTabs;