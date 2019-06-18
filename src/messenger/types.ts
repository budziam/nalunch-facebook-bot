import { Client } from "../client/Client";

export type Psid = string;

export interface MessageQuickReply {
    payload: string;
}

export interface EventMessage {
    quick_reply?: MessageQuickReply;
    text: string;
}

export interface IncomingEvent {
    message: EventMessage;
    pass_thread_control: any;
    postback: any;
    referral: any;
    sender: {
        id: Psid;
    };
}

export interface EventController {
    handle(client: Client, event: IncomingEvent): Promise<void>;
}

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
