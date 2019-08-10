import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isStickied = false;

	constructor() {}

	ngOnInit() {}

	setSticky(isStickied: boolean): void {
		this.isStickied = isStickied;
		if (this.isStickied) {
			document.body.classList.add('stickied');
		} else {
			document.body.classList.remove('stickied');
		}
	}
}
