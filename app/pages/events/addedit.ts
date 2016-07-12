import {Component} from '@angular/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {Loading, NavController, NavParams} from 'ionic-angular';
import {DB, Query} from '../../data/db';
import {EventType, Team} from '../../data/types';
import {MONTH_SHORT, DateX} from '../../util/time';

@Component( {
	templateUrl: 'build/pages/events/addedit.html',
} )
export class AddEditPage {

	private is_add: boolean = true;
	private id: number = 0;
	private form: any;
	private types: Array<EventType> = [];
	private teams: Array<Team> = [];
	private year_max: number = 0;
	
	private val_venue: string = "";
	private val_type: string = "";
	private val_date_from: string = "";
	private val_date_to: string = "";
	private val_teams: Array<any> = [];

	constructor( private nav: NavController, private navp: NavParams, private db: DB, formb: FormBuilder ) {
		this.is_add = navp.get( 'is_add' );
		this.id = navp.get( 'id' );
		let d = new Date();
		this.year_max = d.getFullYear() + 4;
		this.val_date_from = DateX.ymd( d );
		console.log(this.val_date_from);
		this.val_date_to = this.val_date_from;

		this.db.query( `
			SELECT id, name
			FROM event_types
		` ).then( ( resp ) => {
			if( resp.err )
				return;
			for( let i = 0; i < resp.res.rows.length; ++i )
				this.types.push( resp.res.rows.item( i ) );
			this.db.query( `
				SELECT id, name
				FROM teams
				ORDER BY name
			` ).then( ( resp ) => {
				if( resp.err )
					return;
				for( let i = 0; i < resp.res.rows.length; ++i ) {
					let it = resp.res.rows.item( i );
					this.teams.push( {id: it.id, name: it.name} );
				}
				if( !this.is_add ) {
					this.db.query( `
						SELECT id, event_type_id, venue, date_from, date_to
						FROM events
						WHERE id = ?
					`, [this.id] ).then( ( resp ) => {
						if( resp.err )
							return;
						let it = resp.res.rows.item( 0 );
						this.val_venue = it.venue;
						this.val_type = it.event_type_id;
						this.val_date_from = it.date_from;
						this.val_date_to = it.date_to;
					} );
					this.db.query( `
						SELECT team_id
						FROM event_teams
						WHERE event_id = ?
					`, [this.id] ).then( ( resp ) => {
						if( resp.err )
							return;
						for( let i = 0; i < resp.res.rows.length; ++i )
							this.val_teams.push( resp.res.rows.item( i ).team_id );
					} );
				}
			} );
		} );

		this.form = formb.group( {
			venue: [this.val_venue, Validators.required],
			type: [this.val_type, Validators.required],
			date_from: [this.val_date_from, Validators.required],
			date_to: [this.val_date_to, Validators.required],
			teams: [this.val_teams, Validators.required],
		} );
	}

	public inp( n: string ): any {
		return this.form.controls[n];
	}

	public onSubmit( data: any ): void {
		let loading = Loading.create( {
			content: "Please wait..."
		} );
		this.nav.present( loading );
		if( this.is_add ) {
			this.db.query( `
				INSERT INTO events( event_type_id, venue, date_from, date_to )
				VALUES( ?, ?, ?, ? )
			`, [
				data.type, data.venue, data.date_from, data.date_to
			] ).then( ( resp ) => {
				if( resp.err )
					return;
				let iid = resp.res.insertId;
				let qs: Array<Query> = [];
				for( let i = 0; i < data.teams.length; ++i ) {
					qs.push({
						q: `INSERT INTO event_teams( event_id, team_id ) VALUES( ?, ? )`,
						p: [iid, data.teams[i]]
					});
				}
				this.db.multiQuery( qs ).then( ( resp ) => {
					loading.dismiss();
					this.nav.pop();
				} );
			} );
		} else {
			this.db.query( `
				UPDATE events
				SET event_type_id = ?, venue = ?, date_from = ?, date_to = ?
				WHERE id = ?
			`, [
				data.type, data.venue, data.date_from, data.date_to, this.id
			] ).then( ( resp ) => {
				let qs: Array<Query> = [{
					q: `DELETE FROM event_teams WHERE event_id = ?`,
					p: [this.id]
				}];
				for( let i = 0; i < data.teams.length; ++i ) {
					qs.push({
						q: `INSERT INTO event_teams( event_id, team_id ) VALUES( ?, ? )`,
						p: [this.id, data.teams[i]]
					});
				}
				this.db.multiQuery( qs ).then( ( resp ) => {
					loading.dismiss();
					this.nav.pop();
				} );
			} );
		}
	}

}
