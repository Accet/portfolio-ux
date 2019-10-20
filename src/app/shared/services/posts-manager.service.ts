import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Post} from '../models/post';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PostsManagerService {
	private postsCollection: AngularFirestoreCollection<Post>;
	private posts: Observable<Post[]>;

	constructor(private db: AngularFirestore) {}

	get getPosts(): Observable<Post[]> {
		return this.posts ? this.posts : (this.posts = this.getPostsData().pipe(shareReplay(1)));
	}

	private getPostsData(): Observable<Post[]> {
		this.postsCollection = this.db.collection<Post>('posts');
		return this.postsCollection.valueChanges();
	}
}
