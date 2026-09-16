export interface Component {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string;
  date_added: string;
}

export type ComponentInput = Omit<Component, 'id' | 'date_added'>;
