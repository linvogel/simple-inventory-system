import moment from "moment";

enum LoggerLevel {
	FATAL,
	ERROR,
	WARNING,
	INFO,
	DEBUG,
	VERBOSE
}

var current_log_level: LoggerLevel = LoggerLevel.INFO;

function string_of_level(lvl: LoggerLevel) {
	switch (lvl) {
		case LoggerLevel.FATAL: return "[FATAL]";
		case LoggerLevel.ERROR: return "[ERROR]";
		case LoggerLevel.WARNING: return "[WARNING]";
		case LoggerLevel.INFO: return "[INFO]";
		case LoggerLevel.DEBUG: return "[DEBUG]";
		case LoggerLevel.VERBOSE: return "[VERBOSE]";
	}
}

function log(lvl: LoggerLevel, caller: string, msg: string) {
	if (lvl <= current_log_level) {
		let date: string = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		console.log("[" + date + "]" + string_of_level(lvl) + "[" + caller + "] " + msg);
	}
}

export function fatal(msg: string, module?: string) {
	log(LoggerLevel.FATAL, module === undefined ? fatal.caller.name : module, msg);
}

export function error(msg: string, module?: string) {
	log(LoggerLevel.ERROR, module === undefined ? error.caller.name : module, msg);
}

export function warning(msg: string, module?: string) {
	log(LoggerLevel.WARNING, module === undefined ? warning.caller.name : module, msg);
}

export function info(msg: string, module?: string) {
	log(LoggerLevel.INFO, module === undefined ? info.caller.name : module, msg);
}

export function debug(msg: string, module?: string) {
	log(LoggerLevel.DEBUG, module === undefined ? debug.caller.name : module, msg);
}

export function verbose(msg: string, module?: string) {
	log(LoggerLevel.VERBOSE, module === undefined ? verbose.caller.name : module, msg);
}