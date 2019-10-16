import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {User} from '../models/user';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {finalize, map, switchMap} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {UploadType} from '../../admin/components/file-upload/file-upload.component';

@Injectable({
	providedIn: 'root'
})
export class UserDataManagerService {
	uploadPercent: Observable<number>;
	downloadURL: Observable<string>;

	constructor(private db: AngularFirestore, private storage: AngularFireStorage) {}

	getUser(uid): Observable<User> {
		return this.db.doc<User>(`users/${uid}`).valueChanges();
	}

	updateUserData(user: User, force = false): Observable<void> {
		// Sets user data to firestore on login
		console.log('Function: updateUserData, user: ', user);
		const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
		return from(userRef.set(user, {merge: !force}));
	}

	getUserData(): Observable<User> {
		return this.db
			.collection('users/')
			.valueChanges()
			.pipe(map(users => (users.length ? (users[0] as User) : null)));
	}
}
