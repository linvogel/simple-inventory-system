import { Request, Response } from "express";

import { debug, info } from './logger';

export async function authHandler(req: Request, res: Response) {
	
	debug("Redirecting to login.");
	res.redirect("/login.html");
}

export async function registerHandler(req: Request, res: Response) {
	console.log("Registering User:");
	console.log(req.body);
}