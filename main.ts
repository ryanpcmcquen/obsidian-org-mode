import { Plugin } from 'obsidian';

export default class OrgMode extends Plugin {
	async onload() {
		super.onload();

		// Register the view and extensions:
		this.registerExtensions(['org'], 'orgmode');
	}
}
