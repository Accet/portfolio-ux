import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
	private _currentUser$: Observable<User>;

	get currentUser$(): Observable<User> {
		return this._currentUser$ ? this._currentUser$ : (this._currentUser$ = this.getMe().pipe(shareReplay(1)));
	}
	constructor(private afAuth: AngularFireAuth) {}

	private getMe(): Observable<User> {
		return this.afAuth.authState.pipe(
			tap(user => {
				if (user) {
					localStorage.setItem('user', JSON.stringify(user));
				} else {
					localStorage.setItem('user', null);
				}
			})
		);
	}

	login(email, password): Observable<User> {
		return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
			map(userCredentials => {
				console.log('Function: , userCredentials: ', userCredentials);
				return userCredentials.user;
			})
		);
	}

	logout(): Observable<any> {
		return from(this.afAuth.auth.signOut()).pipe(
			switchMap(() => {
				localStorage.removeItem('user');
				this.resetMeCache();
				return this.currentUser$;
			})
		);
	}

	resetPasswordInit(email: string) {
		return this.afAuth.auth.sendPasswordResetEmail(email, {url: 'http://localhost:4200/admin'});
	}

	confirmPasswordReset(code: string, newPassword: string) {
		return this.afAuth.auth.confirmPasswordReset(code, newPassword);
	}

	verifyPasswordResetCode(code: string): Observable<string> {
		return from(this.afAuth.auth.verifyPasswordResetCode(code));
	}

	resetMeCache() {
		this._currentUser$ = null;
	}
}
