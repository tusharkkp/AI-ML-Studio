import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WarehouseBfsLab } from '@/labs/warehouse-bfs/WarehouseBfsLab';

export function WarehouseLabPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/learn/unit-2/bfs"
          className="inline-flex items-center text-sm font-semibold text-studio-600 hover:text-unit-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to BFS Concept Page
        </Link>
        <span className="text-xs font-mono text-studio-400">Lab ID: warehouse-bfs</span>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-studio-900 dark:text-studio-50">
          Warehouse Robot Grid Laboratory
        </h1>
        <p className="text-sm text-studio-600 dark:text-studio-400 mt-1">
          Full-screen interactive workbench for Breadth-First Search on obstacle grids.
        </p>
      </div>

      <WarehouseBfsLab />
    </div>
  );
}
