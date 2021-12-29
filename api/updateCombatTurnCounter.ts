import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection, updateCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import axios from "axios";

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

    const { turn, combatants, ...rest } = currentCombat;
    const newCombatantsObject = combatants.map((combatant) => {
      const { temporaryEffects, afflictions, ...rest } = combatant;

      const temporaryEffectsObject = temporaryEffects.map(
        (temporaryEffect) => {}
      );
      const afflictionsObject = afflictions.map((afflictions) => {});

      return {
        temporaryEffects,
        afflictions,
        ...rest,
      };
    });

    const newCombatObject = {
      ...rest,
      turn: turn + 1,
      combatants: newCombatantsObject,
    };

    // const data = await updateCollection("combats", newCombatObject, {
    //   _id: new ObjectId(combatId),
    // });
    response.status(200).send(newCombatantsObject);
  } catch (e) {
    console.log(e);
    response.status(504).send(e);
  }
};

export default cors(handler);
