import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';
import {ScrollSpyDirective} from './directives/scroll-spy.directive';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	isStickied: Observable<boolean>;
	@ViewChild(ScrollSpyDirective, {static: false}) spy: ScrollSpyDirective;

	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
		['linked', 'medium', 'mail', 'media'].forEach(icon => {
			this.matIconRegistry.addSvgIcon(
				icon,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
			);
		});
	}

	ngOnInit() {}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.isStickied = this.spy.stickySet.asObservable();
		});
	}
}
