import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-ghost-block',
	templateUrl: './ghost-block.component.html',
	styleUrls: ['./ghost-block.component.scss']
})
export class GhostBlockComponent implements OnInit {
	@Input() w: number;
	@Input() h: number;

	constructor() {}

	ngOnInit() {}
}
