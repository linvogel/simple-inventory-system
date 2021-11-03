import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

import { debug, info, verbose } from './logger';
import { loginUser, registerUser } from "./database";
import * as uuid from 'uuid';
import { JwkKeyExportOptions } from "node:crypto";

// define a secret unique to this instance of the server
const jwt_secret: string = uuid.v4();

// regex are beautiful. almost feels like writing ancient egyptian hieroglyphs...
const reg_username: RegExp = /^[0-9a-zA-Z_]{3,32}$/g;
const reg_password: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\.\,\-\_\?\!\+\/\&])[a-zA-Z0-9\.\,\-\_\?\!\+\/\&]{8,32}$/g;

export async function authHandler(req: Request, res: Response) {
	if (req.cookies['auth_token']) {
		let auth_token = req.cookies['auth_token'];
		try {
			let payload = jwt.verify(auth_token, jwt_secret) as jwt.JwtPayload;
			let uid = payload['uid'];
			let username = payload['username'];
			let role = payload['role'];
			req.next();
			return;
		} catch {
			verbose("Invalid Token");
		}
	}
	debug("Redirecting to login.");
	res.redirect("/login.html");
}

export async function loginHandler(req: Request, res: Response) {
	if (req.body.username && req.body.password) {
		verbose("Logging user in: " + req.body.username);
		let user_data = await loginUser(req.body.username, req.body.password);
		if (user_data) {
			verbose("Login successful");
			let auth_token: string = jwt.sign(user_data, jwt_secret, {expiresIn: 300});
			res.cookie('auth_token', auth_token, { maxAge: 300000 });
			res.redirect("/index.html");
		} else {
			res.redirect("/login.html");
		}
	} else {
		verbose("Incomplete login information");
	}
}

export async function registerHandler(req: Request, res: Response) {
	if (reg_username.test(req.body.username) && req.body.password === req.body.password_confirm && reg_password.test(req.body.password)) {
		debug("Registering user: " + req.body.username);
		registerUser(req.body.username, req.body.password, "default");
		res.redirect("/login.html");
	} else {
		verbose("Attempted Registering invalid user");
		res.redirect("/register.html");
	}
}