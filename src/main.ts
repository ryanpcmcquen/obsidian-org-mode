import "./lib/codemirror.js";
import "./mode/simple/simple.js";
import "./mode/orgmode/orgmode-fold.js";
import "./mode/orgmode/orgmode-mode.js";
import { Plugin, TextFileView, WorkspaceLeaf } from "obsidian";

export default class OrgMode extends Plugin {
    async onload() {
        super.onload();
        console.log("Loading Org Mode plugin ...");

        this.registerView("orgmode", this.orgViewCreator);
        this.registerExtensions(["org"], "orgmode");
    }

    orgViewCreator = (leaf: WorkspaceLeaf) => {
        return new OrgView(leaf);
    };

    onunload() {
        console.log("Unloading Org Mode plugin ...");
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
            theme: "obsidian",

            // I am not sure autofocus is necessary ...
            autofocus: true,
            foldGutter: {
                minFoldSize: 1,
            },
            foldOptions: {
                widget: " ...",
            },
            gutters: ["CodeMirror-foldgutter"],
        });

        this.codeMirror.on("changes", this.changed);
    }

    // When the view is resized, refresh CodeMirror (thanks Licat!).
    onResize() {
        this.codeMirror.refresh();
    }

    changed = async (
        _instance: CodeMirror.Editor,
        _changes: CodeMirror.EditorChangeLinkedList[]
    ) => {
        this.requestSave();
    };

    getViewData = () => {
        return this.codeMirror.getValue();
    };

    setViewData = (data: string, clear: boolean) => {
        if (clear) {
            // @ts-ignore
            this.codeMirror.swapDoc(CodeMirror.Doc(data, "orgmode"));
        } else {
            this.codeMirror.setValue(data);
        }

        // HACK:
        // Ideally this would actually be able to find the user defined
        // keyMap, and not just check the 'vimMode' boolean.
        // @ts-ignore
        if (this.app?.vault?.config?.vimMode) {
            this.codeMirror.setOption("keyMap", "vim");
        }

        // This seems to fix some odd visual bugs:
        this.codeMirror.refresh();

        // This focuses the editor, which is analogous to the
        // default Markdown behavior in Obsidian:
        this.codeMirror.focus();
    };

    clear = () => {
        this.codeMirror.setValue("");
        this.codeMirror.clearHistory();
    };

    getDisplayText() {
        if (this.file) {
            return this.file.basename;
        } else {
            return "org (No File)";
        }
    }

    canAcceptExtension(extension: string) {
        return extension === "org";
    }

    getViewType() {
        return "orgmode";
    }
}
