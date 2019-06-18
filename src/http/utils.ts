import { NextFunction, RequestHandler } from "express";

export const TERMINATION = Symbol.for("Termination");

export const asyncHandler = (callback: RequestHandler): RequestHandler => async (
    ...args
): Promise<void> => {
    const next = args[args.length - 1] as NextFunction;

    try {
        await callback(...args);
        next();
    } catch (e) {
        next(e);
    }
};

export const controllerHandler = (callback: RequestHandler): RequestHandler => async (
    ...args
): Promise<void> => {
    const next = args[args.length - 1] as NextFunction;

    try {
        await callback(...args);
        next(TERMINATION);
    } catch (e) {
        next(e);
    }
};
