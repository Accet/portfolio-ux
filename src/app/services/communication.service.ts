import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export enum MessageType {
	HIGHLIGHT_SCROLL_SECTION = 'HIGHLIGHT_SCROLL_SECTION',
	SCROLL_TO_SECTION = 'SCROLL_TO_SECTION'
}

export interface Message {
	type: MessageType;
	data?: any;
}

@Injectable({
	providedIn: 'root'
})
export class CommunicationService {
	private messageHandler = new Subject<Message>();

	constructor() {}

	sendMessage(message: Message) {
		this.messageHandler.next(message);
	}

	clearMessage() {
		this.messageHandler.next();
	}

	getMessage(type: MessageType): Observable<any> {
		return this.messageHandler.pipe(
			filter((message: Message) => message.type === type),
			map((message: Message) => message.data)
		);
	}
}
