import { AxiosInstance } from "axios";
import { injectable } from "inversify";
import * as qs from "qs";
import { OutcomingMessage, Psid } from "./types";
import { trimSlashes } from "../utils";
import { ClientProfile } from "../client/types";

@injectable()
export class Api {
    public constructor(
        private readonly axios: AxiosInstance,
        private readonly accessToken: string,
    ) {
        //
    }

    public async getProfile(psid: Psid): Promise<ClientProfile> {
        const fields = ["first_name", "last_name"];
        const url = this.to(`/${psid}`, { fields: fields.join(",") });
        const response = await this.axios.get(url);

        return {
            firstName: response.data.first_name,
            lastName: response.data.last_name,
        };
    }

    public async sendMessage(psid: string, message: OutcomingMessage): Promise<void> {
        const url = this.to("/me/messages");
        const data = {
            recipient: {
                id: psid,
            },
            message,
        };

        console.log("Joł");

        await this.axios.post(url, data);
    }

    private to(path: string, query: any = {}): string {
        query.access_token = this.accessToken;

        return `https://graph.facebook.com/v3.3/${trimSlashes(path)}?${qs.stringify(query)}`;
    }
}
