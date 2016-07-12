import {Component} from '@angular/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {Loading, NavController, NavParams} from 'ionic-angular';
import {DB} from '../../data/db';
import {Division} from '../../data/types';



@Component( {
	templateUrl: 'build/pages/teams/addedit.html',
} )
export class AddEditPage {

	private is_add: boolean = true;
	private id: number = 0;
	private form: any;
	private divisions: Array<Division> = [];

	private val_name: string = "";
	private val_division: string = "";
	private val_hometown: string = "";

	constructor( private nav: NavController, private navp: NavParams, private db: DB, form_builder: FormBuilder ) {
		this.is_add = navp.get( 'is_add' );
		this.id = navp.get( 'id' );

		this.db.query( `
			SELECT id, name FROM divisions
		` ).then( ( resp ) => {
			if( resp.err ) 
				return;
			for( let i = 0; i < resp.res.rows.length; ++i )
				this.divisions.push( resp.res.rows.item( i ) );
			if( !this.is_add ) {
				this.db.query( `
					SELECT name, division_id, hometown
					FROM teams
					WHERE id = ?
				`, [this.id] ).then( ( resp ) => {
					if( resp.err )
						return;
					let r = resp.res.rows.item( 0 );
					this.val_name = r.name;
					this.val_division = r.division_id;
					this.val_hometown = r.hometown;
				} );
			}
		} );

		this.form = form_builder.group( {
			name: [this.val_name, Validators.required],
			division: [this.val_division, Validators.required],
			hometown: [this.val_hometown, Validators.required],
		} );
	}

	public inp( n: string ): any {
		return this.form.controls[n];
	}

	public inp_valid( n: string ): any {
		return this.form.controls[n].touched && !this.form.controls[n].valid;
	}

	public onSubmit( data: any ): void {
		let loading = Loading.create( {
			content: "Please wait...",
		} );
		this.nav.present( loading );
		if( this.is_add ) {
			this.db.query( `
				INSERT INTO teams( name, division_id, hometown )
				VALUES( ?, ?, ? )
			`, [data.name, data.division, data.hometown] ).then( () => {
				loading.dismiss();
				this.nav.pop();
			} );
		} else {
			this.db.query( `
				UPDATE teams
				SET name = ?, division_id = ?, hometown = ?
				WHERE id = ?
			`, [data.name, data.division, data.hometown, this.id] ).then( () => {
				loading.dismiss();
				this.nav.pop();
			} );
		}
	}

}
