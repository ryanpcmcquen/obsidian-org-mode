import './lib/codemirror.js';
import './mode/simple/simple.min.js';
import './mode/orgmode/orgmode-fold.min.js';
import './mode/orgmode/orgmode-mode.min.js';
import { Plugin } from 'obsidian';

export default class OrgMode extends Plugin {
    async onload() {
        super.onload();

        // Register the view and extensions:
        this.registerExtensions(['org'], 'orgmode');
    }
}
