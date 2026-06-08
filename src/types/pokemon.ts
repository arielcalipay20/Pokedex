export interface Pokemon {
  id: number;
  name: string;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
}
