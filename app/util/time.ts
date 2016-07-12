export let MONTH: Array<string> = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

export let MONTH_SHORT: Array<string> = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];

export namespace DateX {

	export function ymd(d: Date): string {
		let str = "" + d.getFullYear() + "-"
		str += ( (d.getMonth() + 1) < 10 ? "0" : "" );
		str += ( d.getMonth() + 1) + "-";
		str += ( d.getDate() < 10 ? "0" : "" );
		str += d.getDate();
		return str;
	}

	export function ts(d: Date): number {
		return Math.floor( d.getTime() / 1000 );
	}

	export function canonical(d: string): string {
		let parts = d.split( '-' );
		return "" + parts[2] + " " + MONTH_SHORT[parseInt( parts[1] ) - 1];
	}

	export function canonicalY(d: string): string {
		let parts = d.split( '-' );
		let str = "" + parts[2] + " " + MONTH_SHORT[parseInt( parts[1] ) - 1];
		str += " " + parts[0];
		return str;
	}

}
