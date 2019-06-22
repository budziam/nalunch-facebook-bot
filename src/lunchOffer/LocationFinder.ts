import { IncomingEvent } from "../messenger/types";
import { Coordinates } from "chunk";

interface Match {
    label: string;
    payload: string;
}

export class LocationFinder {
    public constructor(private readonly event: IncomingEvent) {
        //
    }

    public getQuickReplyLocation(): Coordinates | undefined {
        const attachments = this.event.message.attachments;

        if (attachments && attachments[0] && attachments[0].type === "location") {
            return {
                latitude: attachments[0].payload.coordinates.lat,
                longitude: attachments[0].payload.coordinates.long,
            };
        }

        return undefined;
    }

    public matchLocation(): Match[] {
        // TODO Implement
        return [];
    }
}
