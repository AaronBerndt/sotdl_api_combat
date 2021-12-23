import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCollection, updateCollection } from "../utilities/MongoUtils";
import microCors from "micro-cors";
import { ObjectId } from "mongodb";

const cors = microCors();

const handler = async (request: VercelRequest, response: VercelResponse) => {
  try {
    if (request.method === "OPTIONS") {
      return response.status(200).end();
    }
    const { combatId } = request.body.data;

    const { data: currentCombat } = await axios(
      `https://sotdl-api-fetch.vercel.app/api/combats?_id=${attackerData.activeCombat}`
    );

    const { turn, ...rest } = currentCombat;

    const data = await updateCollection(
      "combats",
      {
        ...rest,
        turn: turn + 1,
      },
      {
        _id: new ObjectId(_id),
      }
    );
    response.status(200).send(newCombatObject);
  } catch (e) {
    response.status(504).send(e);
  }
};

export default cors(handler);
