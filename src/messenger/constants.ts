import { ContentType, QuickReply } from "../api/FacebookApi";

export enum ActionChoicePayload {
    Conversation = "Conversation",
}

export const ACTION_CHOICE_REPLIES: QuickReply[] = [
    {
        content_type: ContentType.Location,
    },
    {
        content_type: ContentType.Text,
        title: "Rozmowa z człowiekiem",
        payload: ActionChoicePayload.Conversation,
        image_url:
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/198/woman_1f469.png",
    },
];
