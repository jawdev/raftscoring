import {Injectable} from "@angular/core";
import {Query} from './dbcore';

@Injectable()
export class DBStructure {

	constructor() {}

	public existence(): string {
		return `
			SELECT name
			FROM sqlite_master
			WHERE type = 'table' AND name='state'
		`;
	}

	public rebuild(): boolean {
		return false;
	}

	public base(): Array<string> {
		return [

/*
`DROP TABLE IF EXISTS teams`,
`DROP TABLE IF EXISTS events`,
`DROP TABLE IF EXISTS event_teams`,
*/

`CREATE TABLE IF NOT EXISTS state(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	key TEXT NOT NULL,
	val TEXT
)`,

`DROP TABLE IF EXISTS divisions`,
`CREATE TABLE IF NOT EXISTS divisions(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT
)`,
`INSERT INTO divisions( name ) VALUES( 'Open (Men)' )`,
`INSERT INTO divisions( name ) VALUES( 'Open (Women)' )`,
`INSERT INTO divisions( name ) VALUES( 'Masters (Men)' )`,
`INSERT INTO divisions( name ) VALUES( 'Masters (Women)' )`,
`INSERT INTO divisions( name ) VALUES( 'U23 (Men)' )`,
`INSERT INTO divisions( name ) VALUES( 'U23 (Women)' )`,
`INSERT INTO divisions( name ) VALUES( 'U19 (Men)' )`,
`INSERT INTO divisions( name ) VALUES( 'U19 (Women)' )`,

`CREATE TABLE IF NOT EXISTS teams(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	division_id INTEGER NOT NULL DEFAULT 1,
	hometown TEXT,
	archived BOOLEAN NOT NULL DEFAULT 0
)`,

`DROP TABLE IF EXISTS event_types`,
`CREATE TABLE IF NOT EXISTS event_types(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT
)`,
`INSERT INTO event_types( name ) VALUES( 'R6' )`,
`INSERT INTO event_types( name ) VALUES( 'R4' )`,

`CREATE TABLE IF NOT EXISTS events(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_type_id INTEGER NOT NULL DEFAULT 1,
	venue TEXT,
	date_from TEXT,
	date_to TEXT 
)`,

`CREATE TABLE IF NOT EXISTS event_teams(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL DEFAULT 0,
	team_id INTEGER NOT NULL DEFAULT 0
)`,

`CREATE TABLE IF NOT EXISTS sprint(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL DEFAULT 0,
	team_id INTEGER NOT NULL DEFAULT 0,
	time REAL NOT NULL DEFAULT 0,
	notes TEXT
)`,

`CREATE TABLE IF NOT EXISTS headtohead(
)`,

`CREATE TABLE IF NOT EXISTS downriver(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL DEFAULT 0,
	team_id INTEGER NOT NULL DEFAULT 0,
	time REAL NOT NULL DEFAULT 0,
	notes TEXT
)`,

		];
	}

}
