import { AxiosInstance } from "axios";
import { injectable } from "inversify";
import * as qs from "qs";
import { ClientProfile } from "../client/types";
import { trimSlashes } from "nalunch-sdk";

export interface OutcomingMessage {
    quick_replies?: QuickReply[];
    text: string;
}

export enum ContentType {
    Text = "text",
    Location = "location",
    UserPhoneNumber = "user_phone_number",
    UserEmail = "user_email",
}

export interface QuickReply {
    content_type: ContentType;
    image_url?: string;
    payload?: string;
    title?: string;
}

@injectable()
export class FacebookApi {
    public constructor(
        private readonly axios: AxiosInstance,
        private readonly accessToken: string,
    ) {
        //
    }

    public async getProfile(psid: string): Promise<ClientProfile> {
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

        await this.axios.post(url, data);
    }

    public async typingOn(psid: string): Promise<void> {
        const url = this.to("/me/messages");
        const data = {
            recipient: {
                id: psid,
            },
            sender_action: "typing_on",
        };

        await this.axios.post(url, data);
    }

    public async passThreadControl(psid: string): Promise<void> {
        const url = this.to("/me/pass_thread_control");
        const data = {
            recipient: {
                id: psid,
            },
            target_app_id: 263902037430900,
            metadata: "Nowa wiadomość",
        };

        await this.axios.post(url, data);
    }

    private to(path: string, query: any = {}): string {
        query.access_token = this.accessToken;

        return `https://graph.facebook.com/v3.3/${trimSlashes(path)}?${qs.stringify(query)}`;
    }
}
