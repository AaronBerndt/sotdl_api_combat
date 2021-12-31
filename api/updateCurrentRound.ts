import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection, updateCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import axios from "axios";
import { find, findIndex, indexOf } from "lodash";

const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    if (request.method === "OPTIONS") {
      return response.status(200).end();
    }
    const { combatId } = request.body.data;

    const { data: currentCombat } = await axios(
      `https://sotdl-api-fetch.vercel.app/api/combats?_id=${combatId}`
    );

    const { currentRound, ...rest } = currentCombat;

    const currentRoundTypeArray = [
      "Player Fast",
      "Monster Fast",
      "Player Slow",
      "Monster Slow",
    ];

    const index = indexOf(currentRoundTypeArray, currentRound);
    const newIndex = index === 3 ? 0 : index + 1;

    const newCombatObject = {
      currentRound: currentRoundTypeArray[newIndex],
      ...rest,
    };

    const data = await updateCollection("combats", newCombatObject, {
      _id: new ObjectId(combatId),
    });

    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};

export default cors(handler);
