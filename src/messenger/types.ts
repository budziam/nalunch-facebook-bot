import { Client } from "../client/Client";

export type Psid = string;

export interface MessageQuickReply {
    payload: string;
}

export interface EventMessage {
    mid: string;
    quick_reply?: MessageQuickReply;
    text?: string;
    attachments?: Attachment[];
}

export interface Attachment {
    title: string;
    url: string;
    type: "location";
    payload: {
        coordinates: {
            lat: number;
            long: number;
        };
    };
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
