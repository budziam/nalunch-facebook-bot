import { DATE_FORMAT, EnrichedSlug, LunchOffer } from "chunk";
import * as moment from "moment";
import { Moment } from "moment";

export class LunchOfferPayload {
    public constructor(public readonly date: Moment, public readonly enrichedSlug: EnrichedSlug) {
        //
    }

    public static fromString(text: string): LunchOfferPayload {
        const [dateText, enrichedSlugText] = text.split("#");

        const date = moment(dateText);
        const enrichedSlug = EnrichedSlug.fromString(enrichedSlugText);

        return new LunchOfferPayload(date, enrichedSlug);
    }

    public static fromLunchOffer(lunchOffer: LunchOffer): LunchOfferPayload {
        return new LunchOfferPayload(
            lunchOffer.date,
            new EnrichedSlug(lunchOffer.business.slug, lunchOffer.business.location.coordinates),
        );
    }

    public toString(): string {
        return `${this.date.format(DATE_FORMAT)}#${this.enrichedSlug}`;
    }
}
