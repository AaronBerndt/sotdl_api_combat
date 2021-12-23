import { VercelRequest, VercelResponse } from "@vercel/node";
import { updateCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";
import axios from "axios";
import { find } from "lodash";

const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    if (request.method === "OPTIONS") {
      return response.status(200).end();
    }
    const {
      healthChangeAmount,
      combatId,
      _id,
      health,
      damage,
    } = request.body.data;

    const { data: currentCombat } = await axios(
      `https://sotdl-api-fetch.vercel.app/api/combats?_id=${combatId}`
    );

    const { combatants, ...rest } = currentCombat;
    const monster = find(currentCombat?.combatants, { _id });

    const newDamage =
      damage + healthChangeAmount > health
        ? health
        : damage + healthChangeAmount < 0
        ? 0
        : damage + healthChangeAmount;

    const newCombatObject = {
      ...rest,
      combatants: combatants.map((combatant) => {
        if (combatant._id === _id) {
          const { damage, ...rest } = combatant;

          return {
            ...rest,
            damage: newDamage,
          };
        }
        return combatant;
      }),
    };

    const data = await updateCollection("combats", newCombatObject, {
      _id: new ObjectId(_id),
    });
    response.status(200).send(newCombatObject);
  } catch (e) {
    response.status(504).send(e);
  }
};

export default cors(handler);
