import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DB} from '../../data/db';
import {Event} from '../../data/types';
import {DateX} from '../../util/time';
import {AddEditPage} from './addedit';

@Component( {
	templateUrl: 'build/pages/events/events.html'
} )

export class EventsPage {

	private events: Array<Event> = [];

	constructor( private nav: NavController, private db: DB ) {}

	public onPageWillEnter(): void {
		this.reload();
	}

	public reload(): void {
		this.events = [];
		this.db.query( `
			SELECT
				events.id, events.venue, events.date_from, events.date_to,
				event_types.id AS type_id, event_types.name AS type_name
			FROM events
			INNER JOIN event_types ON events.event_type_id = event_types.id
			ORDER BY events.date_from DESC
		` ).then( ( resp ) => {
			if( resp.err )
				return;
			for( let i = 0; i < resp.res.rows.length; ++i ) {
				let it = resp.res.rows.item( i );
				let d1 = new Date( it.date_from );
				let d2 = new Date( it.date_to );
				let e: Event = {
					id: it.id,
					type: {id: it.type_id, name: it.type_name},
					venue: it.venue,
					date_from: it.date_from,
					date_to: it.date_to,
					date: DateX.canonical( it.date_from ) + " - " + DateX.canonicalY( it.date_to ),
					teams: []
				}
				this.db.query( `
					SELECT teams.id, teams.name
					FROM teams
					INNER JOIN event_teams ON teams.id = event_teams.team_id
					WHERE event_teams.event_id = ?
					ORDER BY teams.name
				`, [it.id] ).then( ( resp ) => {
					if( resp.err )
						return;
					for( let j = 0; j < resp.res.rows.length; ++j ) {
						var jt = resp.res.rows.item( j );
						e.teams.push( {id: jt.id, name: jt.name} );
					}
					this.events.push( e );
				} );
			}
		} );
	}

	public add(): void {
		this.nav.push( AddEditPage, {is_add: true, id: 0} );
	}

	public edit( e: any ): void {
		this.nav.push( AddEditPage, {is_add: false, id: e.id} );
	}

}
