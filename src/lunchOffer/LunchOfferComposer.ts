import { ChunkCollectionStore, compare, Food, LunchOffer } from "chunk";
import * as moment from "moment";
// @ts-ignore
import * as haversineDistance from "haversine-distance";
import { injectable } from "inversify";
import { boundMethod } from "autobind-decorator";
import { Client } from "../client/Client";
import { TagComposer } from "./TagComposer";
import { chooseFoods } from "./foodUtils";

const MAX_LUNCH_OFFERS = 5;

const canTake = (lunchOffer: LunchOffer): boolean => fitsDate(lunchOffer) && !lunchOffer.isEmpty;

const fitsDate = (lunchOffer: LunchOffer): boolean => moment().isSame(lunchOffer.date, "day");

const formatFood = (food: Food): string => {
    const price = food.price ? ` - ${food.price.toFixed(2)}zł` : "";
    return `- ${food.name}${price}`;
};

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
        const tagComposer = new TagComposer(lunchOffer);

        const distance = tagComposer.distance(this.client);
        const subtitle = [tagComposer.priceRange, tagComposer.timeInterval]
            .filter(a => a)
            .join(", ");
        const foodsText = chooseFoods(lunchOffer)
            .map(formatFood)
            .join("\n");

        return `${lunchOffer.business.name} - ${distance}\n${subtitle}\n${foodsText}`;
    }
}
