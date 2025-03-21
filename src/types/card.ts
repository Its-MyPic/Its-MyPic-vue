import { data } from "@/plugins/data";

export interface Card extends data.Info {
  // Extending the base protobuf-generated Info interface
  // We can add more properties here if needed in the future
}

export interface FilterOptions {
  mygo: Set<number>;
  avemujica: Set<number>;
  character: number;
}
