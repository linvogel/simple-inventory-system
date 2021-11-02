import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { fatal, error, warning, info, debug, verbose } from './logger';
import { authHandler, registerHandler } from './auth'
import { load_config, config } from './config';
import { serve } from './file_utils';


const app:express.Express = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded())
app.use((req, res) => { verbose("Requested URL: " + req.url, "RequestLister"); req.next(); })

// define all unauthenticated routes
app.get("/login.html", serve("/login.html", "text/html"));
app.get("/register.html", serve("/register.html", "text/html"));
app.get("/unauth.js", serve("/unauth.js", "text/javascript"));

app.post("/register_user", registerHandler);

app.use(authHandler);


function Startup() {
	info("Starting server...");
	
	debug("Loading Config...");
	load_config();
	
	info("Server ready!")
}

Startup()
app.listen(config.server.port, async () => info("Server listening on port %1!".replace("%1", config.server.port), "ListenCallback"));