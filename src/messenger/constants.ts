import { ContentType } from "./types";

export enum ActionChoicePayload {
    Conversation = "Conversation",
}

export const ACTION_CHOICE_REPLIES = [
    {
        content_type: ContentType.Location,
    },
    {
        content_type: ContentType.Text,
        title: "👩‍🚀 Rozmowa z człowiekiem",
        payload: ActionChoicePayload.Conversation,
    },
];
