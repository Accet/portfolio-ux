import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../services/spinner.service';
import {Observable} from 'rxjs';

@Component({
	selector: 'app-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
	public lottieConfig: any;
	private anim: any;
	message: Observable<string>;

	constructor(private spinnerService: SpinnerService) {
		this.lottieConfig = {
			path: 'assets/cloud-loader.json',
			autoplay: true,
			loop: true
		};
	}

	ngOnInit() {
		this.message = this.spinnerService.getMessage;
	}

	handleAnimation(anim) {
		this.anim = anim;
	}
}
