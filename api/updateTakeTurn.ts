import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection, updateCollection } from "../utilities/MongoUtils";
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
    const { combatId, _id, type } = request.body.data;
    let data;

    const { data: currentCombat } = await axios(
      `https://sotdl-api-fetch.vercel.app/api/combats?_id=${combatId}`
    );

    if (type === "player") {
      const { data: characterData } = await axios(
        `https://sotdl-api-fetch.vercel.app/api/characters?_id=${_id}`
      );
      const newCharacterObject = {};
      data = await updateCollection("characters", newCharacterObject, {
        _id: new ObjectId(_id),
      });
    } else {
      const { combatants, ...rest } = currentCombat;
      const monster = find(currentCombat?.combatants, { _id });

      const newCombatObject = {
        ...rest,
        combatants: combatants.map((combatant) => {
          if (combatant._id === _id) {
            const { turnType, ...rest } = combatant;

            return {
              ...rest,
              turnType: turnType === "Fast" ? "Slow" : "Fast",
            };
          }
          return combatant;
        }),
      };

      data = await updateCollection("combats", newCombatObject, {
        _id: new ObjectId(_id),
      });
    }

    response.status(200).send(data);
  } catch (e) {
    response.status(504).send(e);
  }
};

export default cors(handler);
