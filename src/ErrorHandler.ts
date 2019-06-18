import { boundClass } from "autobind-decorator";
import { Request, Response } from "express";
import { injectable } from "inversify";
import { EndpointNotFoundError } from "./http/errors";

@boundClass
@injectable()
export class ErrorHandler {
    public handle(error: any): void {
        console.error(error);
    }

    public handleHttpError(e: any, req: Request, res: Response): Response | undefined {
        if (e instanceof EndpointNotFoundError) {
            return res.sendStatus(404);
        }

        console.error(e);

        return res.sendStatus(500);
    }
}
