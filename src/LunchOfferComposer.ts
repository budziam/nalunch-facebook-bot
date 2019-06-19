import { ChunkCollectionStore, LunchOffer } from "chunk";
import * as moment from "moment";
import haversineDistance from "haversine-distance";
import { Client } from "./client/Client";
import { injectable } from "inversify";

const MAX_LUNCH_OFFERS = 5;

const compare = (a: any, b: any, asc: boolean = true): number => {
    if (a === b) {
        return 0;
    }

    if (a === undefined) {
        return 1;
    }

    if (b === undefined) {
        return -1;
    }

    if (b > a) {
        return asc ? -1 : 1;
    }

    if (a > b) {
        return asc ? 1 : -1;
    }

    return 0;
};

const compareByDistance = (a: LunchOffer, b: LunchOffer, client: Client): number => {
    const aDistance = haversineDistance(client.position, a.business.location.coordinates);
    const bDistance = haversineDistance(client.position, b.business.location.coordinates);
    return compare(aDistance, bDistance, true);
};

const fitsDate = (lunchOffer: LunchOffer): boolean => moment().isSame(lunchOffer.date, "day");

const formatLunchOffer = (lunchOffer: LunchOffer): string => {
    const { business } = lunchOffer;
    return `${business.name}`;
};

@injectable()
export class LunchOfferComposer {
    public constructor(private readonly chunkCollectionStore: ChunkCollectionStore) {
        //
    }

    public async composeFor(client: Client): Promise<string> {
        await this.chunkCollectionStore.load(client.position, moment(), 5000);

        return this.chunkCollectionStore.lunchOffers
            .filter(fitsDate)
            .sort((a, b) => compareByDistance(a, b, client))
            .slice(0, MAX_LUNCH_OFFERS)
            .map(formatLunchOffer)
            .join("\n\n");
    }
}
