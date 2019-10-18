import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {concatMap, map, shareReplay, switchMap, take} from 'rxjs/operators';
import {User} from '../../shared/models/user';
import {UserDataManagerService} from '../../shared/services/user-data-manager.service';

@Injectable()
export class AuthService {
	private _currentUser$: Observable<User>;

	get currentUser$(): Observable<User> {
		return this._currentUser$ ? this._currentUser$ : (this._currentUser$ = this.getMe().pipe(shareReplay(1)));
	}
	constructor(private afAuth: AngularFireAuth, private userDataManager: UserDataManagerService) {}

	private getMe(): Observable<User> {
		return this.afAuth.authState.pipe(switchMap(user => (user ? this.userDataManager.getUser(user.uid) : of(null))));
	}

	login(email, password): Observable<void> {
		return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
			map(userCredentials => userCredentials.user),
			concatMap(user => {
				console.log('Function: , user: ', user);
				const data: User = {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					contacts: {
						email: user.email
					}
				};
				return this.userDataManager.updateUserData(data);
			})
		);
	}

	logout(): Observable<any> {
		return from(this.afAuth.auth.signOut()).pipe(
			switchMap(() => {
				this.resetMeCache();
				return this.currentUser$;
			})
		);
	}

	resetPasswordInit(email: string) {
		return this.afAuth.auth.sendPasswordResetEmail(email);
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

	setNewEmail(email: string): Observable<any> {
		return this.currentUser$.pipe(
			take(1),
			switchMap(user => this.userDataManager.updateUserData({...user, ...{email, contacts: {email}}})),
			concatMap(() => from(this.afAuth.auth.currentUser.updateEmail(email)))
		);
	}

	setNewPassword(password: string): Observable<any> {
		return from(this.afAuth.auth.currentUser.updatePassword(password));
	}

	setNewDisplayName(name: string): Observable<any> {
		return from(this.afAuth.auth.currentUser.updateProfile({displayName: name})).pipe(
			switchMap(() => this.currentUser$),
			concatMap(user => this.userDataManager.updateUserData({...user, ...{displayName: name}}))
		);
	}

	setNewProfilePicture(photoURL: string = null): Observable<any> {
		return from(this.afAuth.auth.currentUser.updateProfile({photoURL}));
	}
}
