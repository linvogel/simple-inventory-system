import express from 'express';

import { fatal, error, warning, info, debug, verbose } from './logger';

const app:express.Express = express();


function Startup() {
	info("Starting server...");
	
	info("Server ready!")
}

Startup()
app.listen(8080, async () => info("Server listening on port 8080!", "ListenCallback"));