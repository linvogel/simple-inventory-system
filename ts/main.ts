import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { fatal, error, warning, info, debug, verbose } from './logger';
import { authHandler, registerHandler, loginHandler } from './auth'
import { load_config, config } from './config';
import { serve, serveAuthed } from './file_utils';


const app:express.Express = express();

function Startup() {
	info("Starting server...");
	
	debug("Loading Config...");
	load_config();
	
	debug("Defining Routes...")
	app.use(cookieParser());
	app.use(bodyParser.urlencoded())
	app.use((req, res) => { verbose("Requested URL: " + req.url, "RequestLister"); req.next(); });

	// define all unauthenticated routes
	app.get("/login.html", serve("/login.html", "text/html"));
	app.get("/register.html", serve("/register.html", "text/html"));
	app.get("/unauth.js", serve("/unauth.js", "text/javascript"));
	app.get("/unauth.css", serve("/unauth.css", "text/css"));
	app.get("/dep/css/materialize.min.css", serve("/dep/css/materialize.min.css", "text/css"));
	app.get("/dep/js/materialize.min.js", serve("/dep/js/materialize.min.js", "text/javascript"));

	app.post("/register_user", registerHandler);
	app.post("/login_user", loginHandler);

	// authorize everything else
	app.use(authHandler);
	
	app.use(serveAuthed);
	
	info("Server ready!");
}

Startup()
app.listen(config.server.port, async () => info("Server listening on port %1!".replace("%1", config.server.port), "ListenCallback"));