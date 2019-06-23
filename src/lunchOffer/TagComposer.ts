import { Business, LunchOffer, TimeInterval } from "chunk";
import * as moment from "moment";
// @ts-ignore
import * as haversineDistance from "haversine-distance";
import { Client } from "../client/Client";

export class TagComposer {
    public constructor(private readonly lunchOffer: LunchOffer) {
        //
    }

    public get priceRange(): string | undefined {
        const priceRange = this.formatPriceRange();
        return priceRange ? `💰 ${priceRange}` : undefined;
    }

    public get timeInterval(): string | undefined {
        const timeInterval = this.business
            .getLunchHours(moment())
            .map(this.formatTimeInterval)
            .join(", ");

        if (timeInterval) {
            return `⏱️ ${timeInterval}`;
        }

        return undefined;
    }

    public distance(client: Client): string {
        const meters = haversineDistance(
            client.position,
            this.lunchOffer.business.location.coordinates,
        );
        return `🚶‍ ${this.formatMeters(meters)}`;
    }

    private formatPriceRange(): string | undefined {
        const min = this.business.minLunchPrice
            ? this.business.minLunchPrice.toFixed(2)
            : undefined;
        const max = this.business.maxLunchPrice
            ? this.business.maxLunchPrice.toFixed(2)
            : undefined;

        if (!min && !max) {
            return undefined;
        }

        if (!min) {
            return `do ${max}zł`;
        }

        if (!max) {
            return `od ${min}zł`;
        }

        if (min === max) {
            return `${min}zł`;
        }

        return `${min} - ${max}zł`;
    }

    private formatTimeInterval(timeInterval: TimeInterval): string | undefined {
        const start = timeInterval.start ? timeInterval.start.format("HH:mm") : undefined;
        const end = timeInterval.end ? timeInterval.end.format("HH:mm") : undefined;

        if (start && end) {
            return `${start} - ${end}`;
        }

        if (start) {
            return `od ${start}`;
        }

        if (end) {
            return `do ${start}`;
        }

        return undefined;
    }

    private formatMeters(meters: number): string {
        const roundedMeters = Math.round(meters);

        if (roundedMeters < 1000) {
            return `${roundedMeters} m`;
        }

        const kilometers = Math.round(roundedMeters / 100) / 10;

        return `${kilometers} km`;
    }

    private get business(): Business {
        return this.lunchOffer.business;
    }
}
