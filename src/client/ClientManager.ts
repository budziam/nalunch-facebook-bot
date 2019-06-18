import { Psid } from "../bus/types";
import { Client } from "./Client";
import { injectable } from "inversify";

@injectable()
export class ClientManager {
    public readonly _clients: Map<Psid, Client> = new Map();

    public get(psid: Psid): Client {
        if (!this._clients.has(psid)) {
            this._clients.set(psid, new Client(psid));
        }

        return this._clients.get(psid);
    }
}
