import { injectable } from "inversify";
import { boundClass } from "autobind-decorator";
import { getLatitudeWithOffset, getLongitudeWithOffset } from "./utils";
import { Coordinates } from "./types";

/*
 * @see https://en.wikipedia.org/wiki/Decimal_degrees
 */

export const CHUNK_SIZE = 0.05;
export const PRECISION = 2;
export const ACCURACY = 10 ** PRECISION;

@injectable()
@boundClass
export class ChunkService {
    public *calculateChunksCoordinates(
        coordinates: Coordinates,
        radius: number,
    ): IterableIterator<Coordinates> {
        const leftLatitude = getLatitudeWithOffset(coordinates, -radius);
        const rightLatitude = getLatitudeWithOffset(coordinates, radius);
        const leftLongitude = getLongitudeWithOffset(coordinates, -radius);
        const rightLongitude = getLongitudeWithOffset(coordinates, radius);

        const left = this.integerAccuracy(this.normalizeLeft(leftLatitude));
        const right = this.integerAccuracy(this.normalizeRight(rightLatitude));
        const bottom = this.integerAccuracy(this.normalizeLeft(leftLongitude));
        const top = this.integerAccuracy(this.normalizeRight(rightLongitude));
        const size = this.integerAccuracy(CHUNK_SIZE);

        for (let latitude = left; right - latitude >= 0; latitude += size) {
            for (let longitude = bottom; top - longitude >= 0; longitude += size) {
                yield {
                    latitude: this.applyPrecision(latitude / ACCURACY),
                    longitude: this.applyPrecision(longitude / ACCURACY),
                };
            }
        }
    }

    public parseEnrichedSlug(slug: string): [string, Coordinates] | undefined {
        const splitted = slug.split(",");

        if (splitted.length < 2) {
            return undefined;
        }

        const chunkId = Number(splitted[1]);

        if (isNaN(chunkId)) {
            return undefined;
        }

        return [splitted[0], this.deserializeChunkId(chunkId)];
    }

    public createEnrichedSlug(slug: string, coordinates: Coordinates): string {
        const chunkId = this.calculateChunkId(coordinates);
        return `${slug},${chunkId}`;
    }

    private calculateChunkId(coordinates: Coordinates): number {
        const roundedLatitude = this.roundDownToPrecision(coordinates.latitude);
        const roundedLongitude = this.roundDownToPrecision(coordinates.longitude);

        const normalizedLatitude = this.integerAccuracy(this.normalizeLeft(roundedLatitude + 90));
        const normalizedLongitude = this.integerAccuracy(
            this.normalizeLeft(roundedLongitude + 180),
        );

        return this.integerAccuracy(normalizedLatitude * 361) + normalizedLongitude;
    }

    private deserializeChunkId(chunkId: number): Coordinates {
        const longitude = this.applyPrecision((chunkId % (ACCURACY * 361)) / ACCURACY - 180);
        const latitude = this.applyPrecision(
            (chunkId - longitude * ACCURACY) / (ACCURACY * 361) / ACCURACY - 90,
        );

        return { latitude, longitude };
    }

    public normalizeLeft(value: number): number {
        const integer = this.integerAccuracy(value);
        const size = this.integerAccuracy(CHUNK_SIZE);
        return this.applyPrecision(this.floor(integer / size) * CHUNK_SIZE);
    }

    public normalizeRight(value: number): number {
        return this.applyPrecision(value);
    }

    public applyPrecision(value: number): number {
        return this.integerAccuracy(value) / ACCURACY;
    }

    private integerAccuracy(value: number): number {
        const [left, right] = value.toFixed(PRECISION + 1).split(".");
        return Number(left) * ACCURACY + Number(right.slice(0, PRECISION));
    }

    private roundDownToPrecision(value: number): number {
        const increasedAccuracy = 10 ** (PRECISION + 1);
        const multiplied = value * increasedAccuracy;
        return (multiplied - (multiplied % 10)) / increasedAccuracy;
    }

    private floor(value: number): number {
        // Custom implementation of Math.floor that works. Math.floor fails for this case: Math.floor(142.2 * 100)
        // We cast it to a string and take everything before "."
        return Number(String(value).split(".")[0]);
    }
}
