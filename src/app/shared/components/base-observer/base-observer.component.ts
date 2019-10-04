import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export abstract class BaseObserverComponent implements OnDestroy {
	destroy$: Subject<void> = new Subject();

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
