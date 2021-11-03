import { encode, decode, safe, unsafe, parse, stringify } from 'ini';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { assert } from 'node:console';

// define a location for the config file
const config_file = "./config/config.ini";

// export the config
export var config: {[id: string]: any} = undefined;

function setDefault(cfg: {[id: string]: any}, key: string, value: any) {
	let keys = key.split(".");
	assert(keys.length === 2, "Expected length 2 but got %s instead!", JSON.stringify(keys.length));
	
	if (cfg[keys[0]] === undefined) cfg[keys[0]] = {};
	if (cfg[keys[0]][keys[1]] === undefined) cfg[keys[0]][keys[1]] = value;
	
}

// read the entire config and set any default values that are omitted.
export function load_config() {
	let local_config: {[id: string]: any} = {};
	if (existsSync(config_file)) local_config = parse(readFileSync(config_file, "utf-8"));
	
	setDefault(local_config, "server.port", 8080);
	setDefault(local_config, "server.public_dir", "./public")
	setDefault(local_config, "server.hash_algorithm", "sha512");
	
	setDefault(local_config, "database.host", "192.168.1.125");
	setDefault(local_config, "database.port", "5432");
	setDefault(local_config, "database.database", "db_simple_inventory");
	setDefault(local_config, "database.user", "<user>");
	setDefault(local_config, "database.password", "<secret_password>");
	
	writeFileSync(config_file, stringify(local_config), "utf-8");
	config = local_config;
}