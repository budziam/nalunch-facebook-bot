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
        image_url: "https://static.xx.fbcdn.net/images/emoji.php/v9/t8f/1/16/1f469.png",
    },
];
