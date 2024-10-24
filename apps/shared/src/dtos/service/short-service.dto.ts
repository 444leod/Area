export interface ShortService {
  name: string;
  actions: {
    name: string;
    description: string;
  }[];
  reactions: {
    name: string;
    description: string;
  }[];
}
