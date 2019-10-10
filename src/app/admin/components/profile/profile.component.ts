import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

	handleSave(event: MouseEvent) {
		// const values = this.userForm.value;
		// const newEmail$ = this.userForm.get('email').value
		// 	? this.authService.setNewEmail(this.userForm.get('email').value)
		// 	: of(null);
		// const newName$ = this.userForm.get('displayName').value
		// 	? this.authService.setNewDisplayName(this.userForm.get('displayName').value)
		// 	: of(null);
		//
		// newEmail$
		// 	.pipe(
		// 		take(1),
		// 		concatMap(() => newName$)
		// 	)
		// 	.subscribe(
		// 		() => {
		// 			console.log('Function: DONE, : ');
		// 		},
		// 		error => {
		// 			console.log('Function: , error: ', error);
		// 		}
		// 	);
	}
}
