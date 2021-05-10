import './assets/lib/codemirror.js';
import './assets/mode/simple/simple.min.js';
import './assets/mode/orgmode/orgmode-fold.min.js';
import './assets/mode/orgmode/orgmode-mode.min.js';
import { Plugin } from 'obsidian';

export default class OrgMode extends Plugin {
    async onload() {
        super.onload();

        // Register the view and extensions:
        this.registerExtensions(['org'], 'orgmode');
    }
}
