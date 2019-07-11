import { ChunkCollectionStore, Food, LunchOffer } from "chunk";
import * as moment from "moment";
import { injectable } from "inversify";
import { boundMethod } from "autobind-decorator";
import { LunchOfferCollection } from "../LunchOfferCollection";
import { Client } from "../../client/Client";
import { ContentType, QuickReply } from "../../api/FacebookApi";
import { chooseFoods } from "../foodUtils";
import { TagComposer } from "./TagComposer";
import { LunchOfferPayload } from "../LunchOfferPayload";

const truthy = (item: any): boolean => !!item;

const formatFood = (food: Food): string => {
    const price = food.price ? ` - ${food.price.toFixed(2)}zł` : "";
    return `- ${food.name}${price}`;
};

@injectable()
export class LunchOfferComposer {
    public constructor(
        private readonly chunkCollectionStore: ChunkCollectionStore,
        private readonly lunchOfferCollection: LunchOfferCollection,
        private readonly client: Client,
    ) {
        //
    }

    public async composeMany(): Promise<[string, QuickReply[]]> {
        // TODO It should be moved
        await this.chunkCollectionStore.load(this.client.position, moment(), 5000);

        const lunchOffers = this.lunchOfferCollection.lunchOffers();

        const text = lunchOffers.map(this.formatLunchOfferPreview).join("\n\n");
        const quickReplies = lunchOffers.map(this.formatLunchOfferQuickReply);

        return [text, quickReplies];
    }

    public composeOne(lunchOffer: LunchOffer): [string, QuickReply[]] {
        const text = this.formatLunchOfferDetailed(lunchOffer);
        const quickReplies: QuickReply[] = [];
        return [text, quickReplies];
    }

    @boundMethod
    private formatLunchOfferPreview(lunchOffer: LunchOffer): string {
        const subtitle = this.formatSubtitle(lunchOffer);

        const foodsText = chooseFoods(lunchOffer)
            .map(formatFood)
            .join("\n");

        return `${lunchOffer.business.name} ${subtitle}\n${foodsText}`;
    }

    @boundMethod
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

    @boundMethod
    private formatLunchOfferQuickReply(lunchOffer: LunchOffer): QuickReply {
        return {
            content_type: ContentType.Text,
            payload: LunchOfferPayload.fromLunchOffer(lunchOffer).toString(),
            title: lunchOffer.business.name,
        };
    }
}
