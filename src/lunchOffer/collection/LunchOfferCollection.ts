import { boundMethod } from "autobind-decorator";
import * as moment from "moment";
// @ts-ignore
import * as haversineDistance from "haversine-distance";
import { ChunkCollectionStore, compare, LunchOffer } from "chunk";
import { Client } from "../../client/Client";

const canTake = (lunchOffer: LunchOffer): boolean => fitsDate(lunchOffer) && !lunchOffer.isEmpty;
const fitsDate = (lunchOffer: LunchOffer): boolean => moment().isSame(lunchOffer.date, "day");

export class LunchOfferCollection {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly client: Client,
    ) {
        //
    }

    public lunchOffers(): LunchOffer[] {
        return this.chunkCollectionStore.lunchOffers.filter(canTake).sort(this.compareByDistance);
    }

    @boundMethod
    private compareByDistance(a: LunchOffer, b: LunchOffer): number {
        const aDistance = haversineDistance(this.client.position, a.business.location.coordinates);
        const bDistance = haversineDistance(this.client.position, b.business.location.coordinates);
        return compare(aDistance, bDistance, true);
    }
}
