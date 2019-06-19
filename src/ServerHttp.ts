import { boundClass } from "autobind-decorator";
import * as bodyParser from "body-parser";
import * as express from "express";
import { Express, NextFunction, Request, Response } from "express";
import { createServer, Server } from "http";
import { Container, injectable } from "inversify";
import * as winston from "winston";
import { ErrorHandler } from "./ErrorHandler";
import { getRoutes } from "./routes";
import { EndpointNotFoundError } from "./http/errors";

@injectable()
@boundClass
export class ServerHttp {
    private _app: Express;
    private server: Server;

    public constructor(
        private readonly container: Container,
        private readonly errorHandler: ErrorHandler,
        private readonly port: number = 8020,
    ) {
        //
    }

    public get app(): Express {
        if (!this._app) {
            this._app = this.createApp();
        }

        return this._app;
    }

    public start(): void {
        this.server = createServer(this.app)
            .listen(this.port)
            .on("listening", () => winston.info("Server HTTP is listening."))
            .on("error", this.errorHandler.handle);
    }

    private createApp(): Express {
        const app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use("/", getRoutes(this.container));
        app.use((req, res, next) => next(new EndpointNotFoundError()));
        app.use(this.handleError);

        return app;
    }

    private handleError(e: any, req: Request, res: Response, next: NextFunction): void {
        this.errorHandler.handleHttpError(e, req, res);
        next();
    }
}
