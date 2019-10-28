import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Post} from '../models/post';
import {from, Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PostsManagerService {
	private postsCollection: AngularFirestoreCollection<Post>;
	private posts: Observable<Post[]>;

	constructor(private db: AngularFirestore) {
		this.postsCollection = this.db.collection<Post>('posts');
	}

	get getPosts(): Observable<Post[]> {
		return this.posts ? this.posts : (this.posts = this.getPostsData().pipe(shareReplay(1)));
	}

	private getPostsData(): Observable<Post[]> {
		return this.postsCollection.valueChanges();
	}

	createId(): string {
		return this.db.createId();
	}

	writePost(post: Post): Observable<void> {
		return from(this.postsCollection.doc(post.id).set(post, {merge: false}));
	}

	getPost(id: string) {
		return this.postsCollection.doc<Post>(id).valueChanges();
	}
}
