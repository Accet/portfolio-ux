import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostsRoutingModule} from './posts-routing.module';
import {PostsComponent} from './posts.component';
import {PostsListComponent} from './posts-list/posts-list.component';
import {PostDetailsComponent} from './post-details/post-details.component';
import {SharedModule} from '../../../shared/shared.module';
import {AdminModule} from '../../admin.module';
import {EditorComponent} from './editor/editor.component';
import {MediaLibraryModalComponent} from './media-library-modal/media-library-modal.component';
import {MediaLibraryContainerComponent} from './media-library-modal/media-library-container/media-library-container.component';
import {HoverDetectorDirective} from './directives/hover-detector.directive';
import {MatCardModule} from '@angular/material';

@NgModule({
	declarations: [
		PostsComponent,
		PostDetailsComponent,
		PostsListComponent,
		PostsListComponent,
		PostDetailsComponent,
		EditorComponent,
		MediaLibraryModalComponent,
		MediaLibraryContainerComponent,
		HoverDetectorDirective
	],
	imports: [CommonModule, PostsRoutingModule, SharedModule, AdminModule, MatCardModule],
	entryComponents: [MediaLibraryModalComponent]
})
export class PostsModule {}
