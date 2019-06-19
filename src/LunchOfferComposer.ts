import { ChunkCollectionStore, Food, LunchOffer } from "chunk";
import * as moment from "moment";
import * as haversineDistance from "haversine-distance";
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
    // @ts-ignore
    const aDistance = haversineDistance(client.position, a.business.location.coordinates);
    // @ts-ignore
    const bDistance = haversineDistance(client.position, b.business.location.coordinates);
    return compare(aDistance, bDistance, true);
};

const canTake = (lunchOffer: LunchOffer): boolean => fitsDate(lunchOffer) && !lunchOffer.isEmpty;

const fitsDate = (lunchOffer: LunchOffer): boolean => moment().isSame(lunchOffer.date, "day");

const formatLunchOffer = (lunchOffer: LunchOffer, client: Client): string => {
    const { business, foods } = lunchOffer;
    // @ts-ignore
    const meters = haversineDistance(client.position, b.business.location.coordinates);
    const distance = formatDistance(meters);
    return `${business.name} - ${business.address} - ${distance}m\n${foods
        .map(formatFood)
        .join("\n")}`;
};

const formatDistance = (meters: number): string => {
    const roundedMeters = Math.round(meters);

    if (roundedMeters < 1000) {
        return `${roundedMeters}&nbsp;m`;
    }

    const kilometers = Math.round(roundedMeters / 100) / 10;

    return `${kilometers}&nbsp;km`;
};

const formatFood = (food: Food): string => `- ${food.name}`;

@injectable()
export class LunchOfferComposer {
    public constructor(private readonly chunkCollectionStore: ChunkCollectionStore) {
        //
    }

    public async composeFor(client: Client): Promise<string> {
        await this.chunkCollectionStore.load(client.position, moment(), 5000);

        return this.chunkCollectionStore.lunchOffers
            .filter(canTake)
            .sort((a: LunchOffer, b: LunchOffer) => compareByDistance(a, b, client))
            .slice(0, MAX_LUNCH_OFFERS)
            .map(lunchOffer => formatLunchOffer(lunchOffer, client))
            .join("\n\n");
    }
}
