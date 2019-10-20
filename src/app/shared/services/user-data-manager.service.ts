import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {User} from '../models/user';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {map, shareReplay, tap} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UserDataManagerService {
	constructor(private db: AngularFirestore) {}

	private _currentUser$: Observable<User>;

	getUser(uid): Observable<User> {
		return this.db.doc<User>(`users/${uid}`).valueChanges();
	}

	updateUserData(user: User, force = false): Observable<void> {
		// Sets user data to firestore on login
		const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
		return from(userRef.set(user, {merge: !force}));
	}

	private getUserData(): Observable<User> {
		return this.db
			.collection('users/')
			.valueChanges()
			.pipe(
				tap(() => this.resetMeCache()),
				map(users => (users.length ? (users[0] as User) : null))
			);
	}

	get userInfo$(): Observable<User> {
		return this._currentUser$ ? this._currentUser$ : (this._currentUser$ = this.getUserData().pipe(shareReplay(1)));
	}

	resetMeCache() {
		this._currentUser$ = null;
	}
}
