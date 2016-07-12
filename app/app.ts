import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav, MenuController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {DB} from './data/db';
import {HomePage} from './pages/home/home';
import {TeamsPage} from './pages/teams/teams';
import {EventsPage} from './pages/events/events';
/*
import {ScoringPage} from './pages/scoring/scoring';
*/

@Component( {
	templateUrl: "build/app.html",
	providers: [DB]
} )
export class RaftScoring {
	@ViewChild( Nav ) nav;
	private root_page: any = HomePage;
	private pages: Array<{title: string, icon:string, component: any}>;

	constructor( private platform: Platform, private menu: MenuController, private db: DB ) {
		this.db.init();
		this.platform.ready().then( () => {
			StatusBar.styleDefault();
		});
		this.pages = [
			{title: 'Home', icon: 'home', component: HomePage},
			{title: 'Teams', icon: 'contacts', component: TeamsPage},
			{title: 'Events', icon: 'calendar', component: EventsPage},
/*
			{title: 'Scoring', icon: 'podium', component: ScoringPage}
*/
		];
	}

	openPage( page ) {
		this.menu.close();
		this.nav.setRoot( page.component );
	}

}

ionicBootstrap( RaftScoring );
