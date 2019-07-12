import { boundClass } from "autobind-decorator";
import { Request, Response } from "express";
import { injectable } from "inversify";
import * as winston from "winston";
import * as http2 from "http2";
import { EndpointNotFoundError } from "./http/errors";
import { TERMINATION } from "./http/utils";
import { isAxiosError } from "./exceptions/utils";
import { AxiosError } from "axios";

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } = http2.constants;

@boundClass
@injectable()
export class ErrorHandler {
    public handleHttpError(e: any, req: Request, res: Response): Response | undefined {
        if (e === TERMINATION) {
            return undefined;
        }

        if (e instanceof EndpointNotFoundError) {
            return res.sendStatus(HTTP_STATUS_NOT_FOUND);
        }

        this.handle(e);

        return res.sendStatus(HTTP_STATUS_INTERNAL_SERVER_ERROR);
    }

    public handle(error: any): void {
        if (isAxiosError(error)) {
            const axiosError: AxiosError = error;

            winston.error("Request error", {
                message: axiosError.message,
                code: axiosError.code,
                request: {
                    method: axiosError.config.method,
                    url: axiosError.config.url,
                    params: axiosError.config.params,
                    data: axiosError.config.data,
                    headers: axiosError.config.headers,
                },
                response: axiosError.response && {
                    data: axiosError.response.data,
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                    headers: axiosError.response.headers,
                },
            });
        } else {
            winston.error(error);
        }
    }
}
