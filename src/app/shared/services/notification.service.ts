import {Injectable, NgZone} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {CustomNotificationComponent} from '../components/custom-notification/custom-notification.component';
import {MatSnackBarVerticalPosition} from '@angular/material/snack-bar/typings/snack-bar-config';

export enum NotificationType {
	DEFAULT = 'default',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error'
}

export interface NotificationData {
	message: string;
	enableClose?: boolean;
	duration?: number;
}

@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

	private showNotification(type: NotificationType, messageData: NotificationData, override?: any): any {
		const snackBarConfig = {
			...new MatSnackBarConfig(),
			...{verticalPosition: 'top' as MatSnackBarVerticalPosition},
			...{
				announcementMessage: messageData.message,
				panelClass: [type],
				data: messageData,
				duration: messageData.duration ? messageData.duration : null
			},
			...{override}
		};

		this.zone.run(() => {
			return this.snackBar.openFromComponent(CustomNotificationComponent, snackBarConfig);
		});
	}

	show(messageData: NotificationData, override?: any): any {
		return this.showNotification(NotificationType.DEFAULT, messageData, override);
	}

	showWarning(messageData: NotificationData, override?: any): any {
		return this.showNotification(NotificationType.WARNING, messageData, override);
	}

	showError(messageData: NotificationData, override?: any): any {
		return this.showNotification(NotificationType.ERROR, messageData, override);
	}

	showSuccess(messageData: NotificationData, override?: any): any {
		return this.showNotification(NotificationType.SUCCESS, messageData, override);
	}
}
