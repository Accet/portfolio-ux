import {Component, OnInit, ViewChild} from '@angular/core';
import {LottieAnimationViewComponent} from 'ng-lottie/dist/esm/src/lottieAnimationView.component';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
	public lottieConfig: any;
	private anim: any;
	@ViewChild(LottieAnimationViewComponent, {static: true}) lottie: LottieAnimationViewComponent;
	private viewWidth: number;
	private viewHeight: number;
	constructor() {
		this.viewHeight = window.innerHeight * 0.66;
		this.viewWidth = window.innerWidth > 600 ? window.innerWidth * 0.5 : window.innerWidth * 0.9;
		this.lottieConfig = {
			path: 'assets/404.json',
			autoplay: true,
			loop: true
		};
	}

	ngOnInit() {
		console.log('Function: ngOnInit, this.lottie: ', this.lottie);
	}

	handleAnimation(anim) {
		this.anim = anim;
	}
}
