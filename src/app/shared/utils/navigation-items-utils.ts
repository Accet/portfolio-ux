export interface NavItem {
	name: string;
	url: string;
	selected?: boolean;
}

export class NavigationItemsUtils {
	public static getNavItems(id?: string): NavItem[] {
		return [
			{
				name: 'Profile',
				url: 'me',
				selected: true
			},
			{
				name: 'Posts',
				url: id ? `posts/${id}` : 'posts',
				selected: false
			}
		];
	}
}
