import { ChunkCollectionStore, Food, LunchOffer } from "chunk";
import * as moment from "moment";
// @ts-ignore
import * as haversineDistance from "haversine-distance";
import { injectable } from "inversify";
import { boundMethod } from "autobind-decorator";
import { Client } from "../client/Client";

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

const canTake = (lunchOffer: LunchOffer): boolean => fitsDate(lunchOffer) && !lunchOffer.isEmpty;

const fitsDate = (lunchOffer: LunchOffer): boolean => moment().isSame(lunchOffer.date, "day");

const formatDistance = (meters: number): string => {
    const roundedMeters = Math.round(meters);

    if (roundedMeters < 1000) {
        return `${roundedMeters} m`;
    }

    const kilometers = Math.round(roundedMeters / 100) / 10;

    return `${kilometers} km`;
};

const formatFood = (food: Food): string => `- ${food.name}`;

@injectable()
export class LunchOfferComposer {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly client: Client,
    ) {
        //
    }

    public async compose(): Promise<string> {
        await this.chunkCollectionStore.load(this.client.position, moment(), 5000);

        return this.chunkCollectionStore.lunchOffers
            .filter(canTake)
            .sort(this.compareByDistance)
            .slice(0, MAX_LUNCH_OFFERS)
            .map(this.formatLunchOffer)
            .join("\n\n");
    }

    @boundMethod
    private compareByDistance(a: LunchOffer, b: LunchOffer): number {
        const aDistance = haversineDistance(this.client.position, a.business.location.coordinates);
        const bDistance = haversineDistance(this.client.position, b.business.location.coordinates);
        return compare(aDistance, bDistance, true);
    }

    @boundMethod
    private formatLunchOffer(lunchOffer: LunchOffer): string {
        const { business, foods } = lunchOffer;
        const meters = haversineDistance(
            this.client.position,
            lunchOffer.business.location.coordinates,
        );
        const distance = formatDistance(meters);
        const foodsText = foods.map(formatFood).join("\n");

        return `${business.name} - ${distance}\n${business.address}\n${foodsText}`;
    }
}
