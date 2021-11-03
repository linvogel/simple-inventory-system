import {Request, Response} from 'express';
import { Pool, PoolClient, QueryResult } from 'pg';
import { createHash } from 'crypto';
import * as uuid from 'uuid';

import { config } from './config';
import { debug, error, fatal, info } from './logger';
import { exit } from 'process';


var connectionPool: Pool = undefined;

async function initPool() {
	connectionPool = new Pool({
		user: config.database.user,
		host: config.database.host,
		database: config.database.database,
		password: config.database.password,
		port: config.database.port
	});
	
	await initRelations();
}

async function initRelations() {
	if (connectionPool === undefined) {
		fatal("Cannot initiate database connection pool!");
		exit(1);
	}
	
	let client: PoolClient = await connectionPool.connect();
	
	client.query("CREATE TABLE IF NOT EXISTS users (uid UUID, username VARCHAR(32), password_hash TEXT, salt UUID, role TEXT);")
}

export async function loginUser(username: string, password: string) {
	if (connectionPool === undefined) await initPool();
	var user_data = undefined;
	let client: PoolClient = await connectionPool.connect();
	try {
		let sha256 = createHash(config.server.hash_algorithm);
		let res: QueryResult<any> = await client.query("SELECT uid, salt FROM users WHERE username=$1;", [ username ]);
		let uid = res.rows[0].uid;
		let salt = res.rows[0].salt;
		let pass_hash = sha256.update(password + salt, "utf8").digest("hex");
		let user_row: QueryResult<any> = await client.query("SELECT * FROM users WHERE uid=$1 AND username=$2 AND password_hash=$3;", [uid, username, pass_hash]);
		user_data = {
			uid: user_row.rows[0].uid,
			username: user_row.rows[0].username,
			role: user_row.rows[0].role
		};
	} catch (err) {
		error("Error logging user in: " + err);
	}
	client.release();
	
	return user_data;
}

export async function registerUser(username: string, password: string, role: string) {
	if (connectionPool === undefined) initPool();
	let client: PoolClient = await connectionPool.connect();
	
	try {
		let existing = await client.query("SELECT uid FROM users WHERE username=$1;", [username]);
		if (existing.rows.length === 0) {
			let uid = uuid.v4();
			let salt = uuid.v4();
			let sha512 = createHash("sha512");
			let pass_hash = sha512.update(password + salt, "utf-8").digest("hex");
			await client.query("INSERT INTO users(uid, username, password_hash, salt, role) VALUES ($1, $2, $3, $4, $5);", [uid, username, pass_hash, salt, role]);
		} else {
			debug("Attempted to register existing username: " + username);
		}
	} catch (err) {
		error("Error registering user: " + err);
	}
}