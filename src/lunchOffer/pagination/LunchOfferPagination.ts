import { LunchOffer } from "chunk";
import { InvalidArgumentException } from "../../exceptions/InvalidArgumentException";
import { ContentType, QuickReply } from "../../api/FacebookApi";
import { LunchOfferPayload } from "../LunchOfferPayload";
import { LunchOfferCollection } from "../collection/LunchOfferCollection";

export enum PaginationEnum {
    Next = "next",
    Prev = "prev",
}

export class LunchOfferPagination {
    private pageSize: number = 5;
    private page: number = 1;

    public constructor(private readonly lunchOfferCollection: LunchOfferCollection) {
        //
    }

    public setPageSize(size: number): void {
        if (size < 1) {
            throw new InvalidArgumentException("Invalid page size");
        }

        this.pageSize = size;
    }

    public nextPage(): void {
        this.setPage(this.page + 1);
    }

    public previousPage(): void {
        this.setPage(this.page - 1);
    }

    public setPage(page: number): void {
        if (page < 1) {
            throw new InvalidArgumentException("Invalid page");
        }

        this.page = page;
    }

    public items(): LunchOffer[] {
        return this.lunchOfferCollection
            .lunchOffers()
            .slice(this.offset, this.offset + this.pageSize);
    }

    public quickReplies(): QuickReply[] {
        const output: QuickReply[] = [];

        if (this.page > 1) {
            output.push({
                content_type: ContentType.Text,
                payload: PaginationEnum.Prev,
                title: "Poprzednie",
                image_url: "https://static.xx.fbcdn.net/images/emoji.php/v9/t8a/1/32/1f448.png",
            });
        }

        output.push(
            ...this.items().map(lunchOffer => ({
                content_type: ContentType.Text,
                payload: LunchOfferPayload.fromLunchOffer(lunchOffer).toString(),
                title: lunchOffer.business.name,
            })),
        );

        if (this.hasMore()) {
            output.push({
                content_type: ContentType.Text,
                payload: PaginationEnum.Next,
                title: "Więcej",
                image_url: "https://static.xx.fbcdn.net/images/emoji.php/v9/tb/1/32/1f449.png",
            });
        }

        return output;
    }

    private get offset(): number {
        return (this.page - 1) * this.pageSize;
    }

    private hasMore(): boolean {
        return this.page * this.pageSize < this.lunchOfferCollection.lunchOffers().length;
    }
}
