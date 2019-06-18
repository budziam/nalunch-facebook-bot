import { Express, Request, Response } from "express";
import { createContainer } from "../src/inversify.config";

export const setup = createContainer;

export const makeRequest = async (app: Express, req: Request, res: Response) =>
    new Promise(resolve => app(req, res, resolve));
