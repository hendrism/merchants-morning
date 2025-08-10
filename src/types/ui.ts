export type CardId = 'materials' | 'workshop' | 'inventory';
export type CardDensity = 'collapsed' | 'semiExpanded' | 'expanded';
export interface CardState {
  expanded: boolean;
  semiExpanded: boolean;
  categoriesOpen: Record<string, boolean>;
}
export type CardStateMap = Record<CardId, CardState>;
