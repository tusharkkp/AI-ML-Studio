import { BFSInput } from '@/engines/search/bfs/types';

export interface WarehousePreset {
  id: string;
  name: string;
  description: string;
  input: BFSInput;
}

export const PRESETS: WarehousePreset[] = [
  {
    id: 'simple',
    name: 'Open Warehouse',
    description: 'A standard warehouse floor with scattered shelf racks.',
    input: {
      rows: 7,
      cols: 9,
      start: { r: 1, c: 1 },
      goal: { r: 5, c: 7 },
      obstacles: [
        { r: 2, c: 3 },
        { r: 3, c: 3 },
        { r: 4, c: 3 },
        { r: 2, c: 5 },
        { r: 3, c: 5 },
        { r: 4, c: 5 },
      ],
    },
  },
  {
    id: 'aisles',
    name: 'Narrow Aisles',
    description: 'Long storage aisles forcing the robot to detour around dividers.',
    input: {
      rows: 7,
      cols: 9,
      start: { r: 0, c: 0 },
      goal: { r: 6, c: 8 },
      obstacles: [
        { r: 1, c: 0 },
        { r: 1, c: 1 },
        { r: 1, c: 2 },
        { r: 1, c: 3 },
        { r: 1, c: 4 },
        { r: 1, c: 5 },
        { r: 1, c: 6 },
        { r: 3, c: 2 },
        { r: 3, c: 3 },
        { r: 3, c: 4 },
        { r: 3, c: 5 },
        { r: 3, c: 6 },
        { r: 3, c: 7 },
        { r: 3, c: 8 },
        { r: 5, c: 0 },
        { r: 5, c: 1 },
        { r: 5, c: 2 },
        { r: 5, c: 3 },
        { r: 5, c: 4 },
        { r: 5, c: 5 },
        { r: 5, c: 6 },
      ],
    },
  },
  {
    id: 'break-it',
    name: 'Trapped Robot (Make it Fail)',
    description:
      'Fallen cargo crates completely seal off the docking bay. Watch BFS exhaustively prove no path exists.',
    input: {
      rows: 6,
      cols: 6,
      start: { r: 0, c: 0 },
      goal: { r: 5, c: 5 },
      obstacles: [
        { r: 4, c: 5 },
        { r: 4, c: 4 },
        { r: 5, c: 4 },
      ],
    },
  },
];
