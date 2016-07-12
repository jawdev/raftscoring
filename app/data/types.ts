export interface Division {
	id: number,
	name?: string
}

export interface Team {
	id: number,
	name?: string,
	hometown?: string,
	division?: Division;
}

export interface EventType {
	id: number,
	name?: string
}

export interface Event {
	id: number,
	type?: EventType,
	venue?: string,
	date_from?: string,
	date_to?: string,
	date?: string,
	teams?: Array<Team>
}
