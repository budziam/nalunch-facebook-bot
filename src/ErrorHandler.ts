import { boundClass } from "autobind-decorator";
import { Request, Response } from "express";
import { injectable } from "inversify";
import * as winston from "winston";
import * as http2 from "http2";
const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } = http2.constants;
import { EndpointNotFoundError } from "./http/errors";
import { Termination } from "./http/utils";

@boundClass
@injectable()
export class ErrorHandler {
    public handle(error: any): void {
        winston.error(error);
    }

    public handleHttpError(e: any, req: Request, res: Response): Response | undefined {
        if (e === Termination) {
            return undefined;
        }

        if (e instanceof EndpointNotFoundError) {
            return res.sendStatus(HTTP_STATUS_NOT_FOUND);
        }

        winston.error(e);

        return res.sendStatus(HTTP_STATUS_INTERNAL_SERVER_ERROR);
    }
}
