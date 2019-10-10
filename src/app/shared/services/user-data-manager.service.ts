import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {User} from '../models/user';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UserDataManagerService {
	constructor(private db: AngularFirestore) {}

	getUser(uid): Observable<User> {
		return this.db.doc<User>(`users/${uid}`).valueChanges();
	}

	updateUserData(user: User): Observable<void> {
		// Sets user data to firestore on login
		console.log('Function: updateUserData, user: ', user);
		const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
		return from(userRef.set(user, {merge: true}));
	}

	getUserData(): Observable<User> {
		return this.db
			.collection('users/')
			.valueChanges()
			.pipe(map(users => (users.length ? (users[0] as User) : null)));
	}
}
