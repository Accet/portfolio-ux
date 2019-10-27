import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable, of, throwError} from 'rxjs';
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

	removeFile(path: string): Observable<any> {
		return this.ref(path)
			.delete()
			.pipe(catchError(err => (err.code_ === 'storage/object-not-found' ? of(true) : throwError(err))));
	}
}
