import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {from, Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class FireStorageService {
	constructor(private storage: AngularFireStorage) {}

	getStorageRef(path: string) {
		return this.storage.storage.ref(path);
	}

	ref(path: string): AngularFireStorageReference {
		return this.storage.ref(path);
	}

	upload(path: string, file: File): AngularFireUploadTask {
		return this.storage.upload(path, file);
	}

	uploadAutomatically(path: string, file: File): Observable<string> {
		const fileRef = this.ref(path);
		const currentTask = this.upload(path, file);
		return from(
			currentTask
				.snapshotChanges()
				.toPromise()
				.then(() => fileRef.getDownloadURL().toPromise())
				.catch(() => Promise.resolve(null))
		);
	}

	removeFile(path: string): Observable<any> {
		console.log('Function: removeFile, path: ', path);
		return this.ref(path)
			.delete()
			.pipe(catchError(err => (err.code_ === 'storage/object-not-found' ? of(true) : throwError(err))));
	}
}
