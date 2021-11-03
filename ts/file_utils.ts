import { RSA_PSS_SALTLEN_MAX_SIGN } from 'constants';
import {Request, Response} from 'express';
import {readFileSync} from 'fs';

import { config } from './config';

export function serve(file_name: string, type: string = "text/plain") {
	return function(req: Request, res: Response) {
		try {
		let text: string = readFileSync(config.server.public_dir + file_name, "utf-8");
		res.status(200).type(type).send(text);
		} catch (error) {
			res.status(404).send()
		}
	}
}

export function serveAuthed(req: Request, res: Response) {
	let extension = req.url.split(".").slice(-1)[0];
	let type = "text/plain";
	if (extension === "html") type = "text/html";
	else if (extension === "css") type = "text/css";
	else if (extension === "js") type = "text/javascript";
	else if (extension === "png") type = "image/png";
	else if (extension === "jpg") type = "image/jpeg";
	else if (extension === "jpeg") type = "image/jpeg";
	
	try {
		let text: string = readFileSync(config.server.public_dir + "/auth" + req.url, "utf-8");
		res.status(200).type(type).send(text);
	} catch {
		res.status(404).send();
	}
}