import './lib/codemirror.js';
import './mode/simple/simple.min.js';
import './mode/orgmode/orgmode-fold.min.js';
import './mode/orgmode/orgmode-mode.min.js';
import { Plugin, WorkspaceLeaf, addIcon, TextFileView } from 'obsidian';

export default class OrgMode extends Plugin {
    settings: any;

    async onload() {
        super.onload();
        console.log('Loading Org Mode plugin ...');

        this.settings = (await this.loadData()) || ({} as any);

        // register the view and extensions
        this.registerView('orgmode', this.orgViewCreator);
        this.registerExtensions(['org'], 'orgmode');
    }

    // function to create the view
    orgViewCreator = (leaf: WorkspaceLeaf) => {
        return new OrgView(leaf);
    };
}

// This is the custom view
class OrgView extends TextFileView {
    // internal code mirror instance
    codeMirror: CodeMirror.Editor;

    // this.contentEl is not exposed, so cheat a bit.
    public get extContentEl(): HTMLElement {
        // @ts-ignore
        return this.contentEl;
    }

    // constructor
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        console.log(this, leaf);
        // create code mirror instance
        // @ts-ignore
        this.codeMirror = CodeMirror(this.extContentEl, {
            theme: 'obsidian',
        });
        // register the changes event
        this.codeMirror.on('changes', this.changed);
    }

    // when the view is resized, refresh CodeMirror (thanks Licat!)
    onResize() {
        this.codeMirror.refresh();
    }

    // called on code mirror changes
    changed = async (
        instance: CodeMirror.Editor,
        changes: CodeMirror.EditorChangeLinkedList[]
    ) => {
        // request a debounced save in 2 seconds from now
        this.requestSave();
    };

    // get the new file contents
    getViewData = () => {
        console.log(this);
        return this.codeMirror.getValue();
    };

    // set the file contents
    setViewData = (data: string, clear: boolean) => {
        console.log('file data: ', data);
        if (clear) {
            // @ts-ignore
            this.codeMirror.swapDoc(CodeMirror.Doc(data, 'text/plain'));
        } else {
            this.codeMirror.setValue(data);
        }
    };

    // clear the view content
    clear = () => {
        this.codeMirror.setValue('');
        this.codeMirror.clearHistory();
    };

    // gets the title of the document
    getDisplayText() {
        console.log(this);
        if (this.file) return this.file.basename;
        else return 'org (no file)';
    }

    // confirms this view can accept org extension
    canAcceptExtension(extension: string) {
        return extension === 'org';
    }

    // the view type name
    getViewType() {
        return 'orgmode';
    }

    // icon for the view
    // getIcon() {
    //     return 'document-org';
    // }
}
