import {Component} from '@angular/core';
import {ActionSheet, Modal, NavController} from 'ionic-angular';
import {DB} from '../../data/db';
import {Team} from '../../data/types';
import {AddEditPage} from './addedit';

@Component( {
	templateUrl: 'build/pages/teams/teams.html',
} )
export class TeamsPage {

	private teams: Array<Team> = [];

	constructor( private nav: NavController, private db: DB ) {}

	public onPageWillEnter(): void {
		this.reload();
	}

	public reload(): void {
		this.teams = [];
		this.db.query( `
			SELECT
				teams.id, teams.name, teams.division_id, teams.hometown,
				divisions.name AS division_name
			FROM teams
			INNER JOIN divisions ON teams.division_id = divisions.id
			ORDER BY teams.name
		` ).then( ( resp ) => {
			if( resp.err )
				return;
			for( let i = 0; i < resp.res.rows.length; ++i ) {
				let it = resp.res.rows.item( i );
				this.teams.push( {
					id: it.id,
					name: it.name,
					hometown: it.hometown,
					division: {
						id: it.division_id,
						name: it.division_name,
					}
				} );
			}
		} );
	}

	public add(): void {
		this.nav.push( AddEditPage, {
			is_add: true, id: 0
		} );
	}

	public more( team ): void {
		let s = ActionSheet.create( {
			title: team.name,
			buttons: [{
				text: 'Edit',
				icon: 'create',
				handler: () => {
					s.dismiss();
					this.nav.pop();
					this.nav.push( AddEditPage, {
						is_add: false,
						id: team.id
					} );
				}
/*
			}, {
				text: 'Archive',
				icon: 'archive',
				handler: () => {
					
				}
*/
			}, {
				text: 'Cancel',
				icon: 'close',
				role: 'cancel'
			}]
		} );
		this.nav.present( s );
	}

	public 
	
}
