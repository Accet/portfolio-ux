import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isStickied = false;

	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
		['linked', 'medium', 'mail'].forEach(icon => {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
			);
		});
	}

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
