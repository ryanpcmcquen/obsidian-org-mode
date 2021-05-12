import './lib/codemirror.js';
import './mode/simple/simple.min.js';
import './mode/orgmode/orgmode-fold.min.js';
import './mode/orgmode/orgmode-mode.min.js';
import { Plugin, WorkspaceLeaf, TextFileView } from 'obsidian';

export default class OrgMode extends Plugin {
    async onload() {
        super.onload();
        console.log('Loading Org Mode plugin ...');

        this.registerView('orgmode', this.orgViewCreator);
        this.registerExtensions(['org'], 'orgmode');
    }

    orgViewCreator = (leaf: WorkspaceLeaf) => {
        return new OrgView(leaf);
    };

    onunload() {
        console.log('Unloading Org Mode plugin ...');
    }
}

// This is the custom view:
class OrgView extends TextFileView {
    // Internal code mirror instance:
    codeMirror: CodeMirror.Editor;

    // this.contentEl is not exposed, so cheat a bit.
    public get extContentEl(): HTMLElement {
        // @ts-ignore
        return this.contentEl;
    }

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        // @ts-ignore
        this.codeMirror = CodeMirror(this.extContentEl, {
            theme: 'obsidian',

            // I am not sure autofocus is necessary ...
            autofocus: true,
            foldGutter: {
                minFoldSize: 1,
            },
            foldOptions: {
                widget: ' ...',
            },
            gutters: ['CodeMirror-foldgutter'],
        });

        this.codeMirror.on('changes', this.changed);
    }

    // When the view is resized, refresh CodeMirror (thanks Licat!).
    onResize() {
        this.codeMirror.refresh();
    }

    changed = async (
        instance: CodeMirror.Editor,
        changes: CodeMirror.EditorChangeLinkedList[]
    ) => {
        this.requestSave();
    };

    getViewData = () => {
        return this.codeMirror.getValue();
    };

    setViewData = (data: string, clear: boolean) => {
        if (clear) {
            // @ts-ignore
            this.codeMirror.swapDoc(CodeMirror.Doc(data, 'orgmode'));
        } else {
            this.codeMirror.setValue(data);
        }
    };

    clear = () => {
        this.codeMirror.setValue('');
        this.codeMirror.clearHistory();
    };

    getDisplayText() {
        if (this.file) {
            return this.file.basename;
        } else {
            return 'org (no file)';
        }
    }

    canAcceptExtension(extension: string) {
        return extension === 'org';
    }

    getViewType() {
        return 'orgmode';
    }
}
