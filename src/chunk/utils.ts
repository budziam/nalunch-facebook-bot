import { Coordinates } from "./types";

// https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
const EARTH_RADIUS = 6378137;

export const getLatitudeWithOffset = (coordinates: Coordinates, radius: number): number =>
    coordinates.latitude + (radius / EARTH_RADIUS) * (180 / Math.PI);

export const getLongitudeWithOffset = (coordinates: Coordinates, radius: number): number =>
    coordinates.longitude +
    ((radius / EARTH_RADIUS) * (180 / Math.PI)) / Math.cos((coordinates.latitude * Math.PI) / 180);
