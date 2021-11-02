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