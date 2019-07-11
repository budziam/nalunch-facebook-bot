import { Client, ClientState } from "../client/Client";
import { Bus } from "./Bus";
import { injectable } from "inversify";

@injectable()
export class FallbackService {
    public constructor(private readonly bus: Bus) {
        //
    }

    public async unknownSituation(client: Client): Promise<void> {
        client.moveToState(ClientState.ActionChoice);
        await this.bus.send(client, "Trochę się pogubiłem 😞 Zacznijmy od początku.");
    }
}
