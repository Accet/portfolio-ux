import {Component, Input, OnInit} from '@angular/core';
import {CarouselData} from '../../models/carousel-data';
import {Router} from '@angular/router';
import {WorksItems} from '../../models/works-provider';

@Component({
	selector: 'app-carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
	data: CarouselData[];

	constructor(private router: Router) {}

	ngOnInit() {
		const currentItem = WorksItems.find(item => item.url === this.router.url);
		if (currentItem && currentItem.carousel) {
			this.data = currentItem.carousel;
		}
	}
}
