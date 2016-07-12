import {Component} from '@angular/core';
import {Modal, NavController, ViewController} from 'ionic-angular';

@Component( {
	templateUrl: 'build/pages/teams/info.html'
} )

export class InfoModal {

	constructor(private view: ViewController ){}

	close() {
		this.view.dismiss();
	}

}
