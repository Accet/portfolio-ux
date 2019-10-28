import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class SpinnerService {
	private _spinnerStatus = new Subject<boolean>();
	private _spinnerMessageChanged: BehaviorSubject<string> = new BehaviorSubject('');

	get isShown(): Observable<boolean> {
		return this._spinnerStatus.asObservable();
	}

	get getMessage(): Observable<string> {
		return this._spinnerMessageChanged.asObservable().pipe(tap(msg => console.log('Function: , msg: ', msg)));
	}

	constructor() {}

	showSpinner(message: string) {
		this._spinnerStatus.next(true);
		console.log('Function: showSpinner, : ');
		this._spinnerMessageChanged.next(message);
	}

	hideSpinner() {
		this._spinnerStatus.next(false);
		this._spinnerMessageChanged.next('');
	}
}
