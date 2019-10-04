import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material';
import {NotificationData} from '../../services/notification.service';

@Component({
	selector: 'custom-toast-notification',
	templateUrl: './custom-notification.component.html',
	styleUrls: ['./custom-notification.component.scss']
})
export class CustomNotificationComponent {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: NotificationData, public snackBar: MatSnackBar) {}

	close(): void {
		if (this.data) {
			if (this.data.enableClose) {
				this.snackBar.dismiss();
				return;
			}
		}
	}
}
