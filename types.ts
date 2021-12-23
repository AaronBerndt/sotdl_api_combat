export type Combat = {
  _id: string;
  combatants: Combatants;
  turn: number;
  currentRoundType:
    | "Player Fast"
    | "Monster Fast"
    | "Player Slow"
    | "Monster Slow";
};

export type Combatant = {
  _id: string;
  name: string;
  hp: number;
  type: "PC" | "Monster" | "NPC";
  roundType: "Fast" | "Slow";
};

export type Combats = Combat[];
export type Combatants = Combatant[];
