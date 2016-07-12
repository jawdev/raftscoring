import {Injectable} from "@angular/core";
import {Platform, Storage, SqlStorage, NavController} from 'ionic-angular';
import {Query} from './dbcore';
import {DBStructure} from './dbstructure';
export {Query} from './dbcore';

@Injectable()
export class DB {

	private dbg: boolean = true;
	private stor: any;
	private dbname: string;

	/*
	 * init
	 */

	constructor( private platform: Platform ) {}

	public init( n: string = 'default' ): void {
		this.dbname = n;
		this.platform.ready().then( () => {
			this.stor = new Storage( SqlStorage, {
				name: 'rr_' + this.dbname
			} );
			let struc = new DBStructure;
			if( struc.rebuild() )
				this.multiQuery( struc.base() );
			else
				this.query( struc.existence() ).then( ( resp ) => {
					if( resp.res.rows.length > 0 )
						return;
					this.multiQuery( struc.base() );
				} );
		} );
	}
	
	public debug( b: boolean = true ): void {
		this.dbg = b;
	};

	/*
	 * query
	 */

	public query( inp: any, params: any = null ): any {
		var q: Query;
		if( typeof inp == "string" ) {
			q = {q: inp, p: null};
			if( params != null )
				q.p = params;
		} else
			q = inp;
		return this.platform.ready().then( () => {
			return this.stor.query( q.q, q.p ).then( ( resp ) => {
				if( this.dbg )
					console.log( "[DB SUCCESS] " + q.q, resp );
				return resp;
			}, ( resp ) => {
				console.error( "[DB ERROR] " + q.q, resp );
				return resp;
			} );
		} );
	}

	public multiQuery( qs: Array<any> ): any {
		return this.multiQueryRecurse( qs, 0 );
	}

	private multiQueryRecurse( arr: Array<any>, idx: number): any {
		if( idx == arr.length - 1)
			return this.query( arr[idx] );
		return this.query( arr[idx] ).then( ( resp ) => {
			return this.multiQueryRecurse( arr, ++idx );
		} );
	}

}
