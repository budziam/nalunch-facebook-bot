import { ChunkCollectionStore, Food, LunchOffer } from "chunk";
import { boundClass } from "autobind-decorator";
import { Client } from "../../client/Client";
import { QuickReply } from "../../api/FacebookApi";
import { chooseFoods } from "../foodUtils";
import { TagComposer } from "./TagComposer";
import { LunchOfferPagination } from "../pagination/LunchOfferPagination";

const truthy = (item: any): boolean => !!item;

const formatFood = (food: Food): string => {
    const price = food.price ? ` - ${food.price.toFixed(2)}zł` : "";
    return `- ${food.name}${price}`;
};

@boundClass
export class LunchOfferComposer {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly lunchOfferPagination: LunchOfferPagination,
        private readonly client: Client,
    ) {
        //
    }

    public composeMany(): [string, QuickReply[]] {
        const lunchOffers = this.lunchOfferPagination.items();
        const quickReplies = this.lunchOfferPagination.quickReplies();
        const text = lunchOffers.map(this.formatLunchOfferPreview).join("\n\n");

        return [text, quickReplies];
    }

    public composeOne(lunchOffer: LunchOffer): [string, QuickReply[]] {
        const quickReplies = this.lunchOfferPagination.quickReplies();
        const text = this.formatLunchOfferDetailed(lunchOffer);
        return [text, quickReplies];
    }

    private formatLunchOfferPreview(lunchOffer: LunchOffer): string {
        const subtitle = this.formatSubtitle(lunchOffer);

        const foodsText = chooseFoods(lunchOffer)
            .map(formatFood)
            .join("\n");

        return `${lunchOffer.business.name} ${subtitle}\n${foodsText}`;
    }

    private formatLunchOfferDetailed(lunchOffer: LunchOffer): string {
        const tagComposer = new TagComposer(lunchOffer);

        const subtitle = this.formatSubtitle(lunchOffer);
        const soups = lunchOffer.soups.map(formatFood).join("\n");
        const lunches = lunchOffer.lunches.map(formatFood).join("\n");

        const soupsText = soups ? `\n\nZupy\n${soups}` : "";
        const lunchesText = lunches ? `\n\nLunche\n${lunches}` : "";

        const tags = [
            tagComposer.openingTimeInterval,
            tagComposer.phoneNumber,
            tagComposer.address,
            tagComposer.source,
        ]
            .filter(truthy)
            .join("\n");

        return `${lunchOffer.business.name} ${subtitle}${soupsText}${lunchesText}\n\nO lokalu\n${tags}`;
    }

    private formatSubtitle(lunchOffer: LunchOffer): string {
        const tagComposer = new TagComposer(lunchOffer);

        return [
            tagComposer.distance(this.client),
            tagComposer.priceRange,
            tagComposer.lunchTimeInterval,
        ]
            .filter(truthy)
            .join(", ");
    }
}
