import { injectable } from "inversify";
import { Client } from "../client/Client";
import { OutcomingMessage } from "./types";
import { Api } from "./Api";

@injectable()
export class Bus {
    public constructor(private readonly api: Api) {
        //
    }

    public async send(client: Client, message: string | OutcomingMessage): Promise<void>;
    public async send(client: Client, message: any): Promise<void> {
        if (typeof message === "string") {
            await this.api.sendMessage(client.psid, {
                text: message,
            });
        }

        await this.api.sendMessage(client.psid, message);
    }
}
