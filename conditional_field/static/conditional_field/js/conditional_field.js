/* 
    Copyright (C) 2024, Good Advice IT - All Rights Reserved
    Proprietary, but not confidential
    Written by Nigel van Keulen <nigel@goodadvice.it>, March 2024

    Example usage of the gcf conditional fields.
    Allows for arbitrary showing and hiding of fields in the admin based on certain user input.
        
    ```python
    from wagtail import blocks
    
    
    class Link(blocks.StructBlock):
        text = blocks.CharBlock(
            required=False,
            label=_("Link"),
            help_text=_("The text to be displayed."),
        )
        page = blocks.PageChooserBlock(
            required=False,
            label=_("Link"),
            classname=(
                "gcf "
                "gcf-handler--choice "
                "gcf-action--show--page "
            ),
        )
        document = DocumentChooserBlock(
            required=False,
            label=_("Document"),
            classname=(
                "gcf "
                "gcf-handler--choice "
                "gcf-action--show--document "
            ),
        )
        external_link = blocks.URLBlock(
            required=False,
            label=_("External Link"),
            classname=(
                "gcf "
                "gcf-handler--choice "
                "gcf-action--show--external_link"
            ),
        )
        choice = blocks.ChoiceBlock(
            required=True,
            choices=[
                ("page", _("Page")),
                ("document", _("Document")),
                ("external_link", _("External Link")),
            ],
            default="page",
            label=_("Link Type"),
            classname=(
                "gcf "
                "gcf-handler--choice "
            ),
            widget=forms.RadioSelect,
        )
            
    ```
*/
const fieldNameRegex = /gcf-handler--([a-zA-Z\-\_\d]+)/;
const targetActionValueRegex = /gcf-action--([a-zA-Z\-\_\d]+)--([a-zA-Z\-\_\d]+)/;
const targetActionNoValueRegex = /gcf-action-empty--([a-zA-Z\-\_\d]+)/;
const targetActionAnyValueRegex = /gcf-action-any--([a-zA-Z\-\_\d]+)/;

// parent queryselector regex, example: class:goodadvice-collapsible, id:goodadvice-collapsible
const querySelectorGeneratorFuncs = {
    "class": (name) => `.${name}`,
    "id": (name) => `#${name}`,
    "data-attribute": (name) => `[data-${name}]`,
}

const parentQuerySelectorRegex = /gcf-parent--([a-zA-Z\-\_\d]+)--([a-zA-Z\-\_\d]+)/;


const execRegexes = [
    {
        regex: targetActionValueRegex,
        execute: (block, actions) => {
            for (let i = 0; i < actions.length; i++) {
                let obj = actions[i];
                let action = obj[0];
                let value = obj[1];

                
                // Make sure the action is valid
                let execute = globalActions[action];
                if (!execute) {
                    throw new Error(`Conditional field ${block.field.id} has an invalid action: ${action}`);
                }
    
                // Check if the value matches according to the target input type
                let cmpValue = block.getValue();

                if (["number", "range"].includes(block.target.type.toLowerCase())) {
                    if (isNaN(cmpValue)) {
                        cmpValue = 0;
                    } else {
                        cmpValue = parseInt(cmpValue);
                    }
                }

                if (cmpValue === null) {
                    cmpValue = "";
                }

                let valueToStringLower = value.toString().toLowerCase();
                let cmpValueToStringLower = cmpValue.toString().toLowerCase();
                let typLower = block.target.type.toLowerCase();

                let matchVal = false;
                if (["checkbox", "select"].includes(typLower)) {
                    if (cmpValue instanceof Array) {
                        if (cmpValue === null || cmpValue === undefined) {
                            matchVal = false;
                        } else {
                            matchVal = cmpValue.map(x => x.toLowerCase()).includes(valueToStringLower);
                        }
                    } else {
                        matchVal = cmpValueToStringLower === valueToStringLower ||
                                   valueToStringLower == block.target.selectedIndex;
                    }
                } else if (typLower === "number") {
                    matchVal = cmpValue === parseInt(value);
                } else if (typLower === "range") {
                    matchVal = cmpValue === parseInt(value);
                } else {
                    matchVal = cmpValueToStringLower === valueToStringLower;
                }

                // Execute the action
                execute(block, matchVal);
            }
        },
    },
    {
        regex: targetActionAnyValueRegex,
        execute: (block, actions) => {
            for (let i = 0; i < actions.length; i++) {
                let obj = actions[i];
                let action = obj[0];
                
                // Make sure the action is valid
                let execute = globalActions[action];
                if (!execute) {
                    throw new Error(`Conditional field ${block.field.id} has an invalid action: ${action}`);
                }
    
                let chk = block.getValue()

                if (
                    (chk)
                ) {

                    if (["number", "range"].includes(block.target.type.toLowerCase())) {
                        if (isNaN(chk)) {
                            chk = 0;
                        } else {
                            chk = parseInt(chk);
                        }
                    }

                    // return if python None
                    if (chk == "None" || !chk) {
                        return;
                    }

                    if (execute) {
                        execute(block, !!chk);
                    }
                }
            }
        },
    },
    {
        regex: targetActionNoValueRegex,
        execute: (block, actions) => {
            for (let i = 0; i < actions.length; i++) {
                let obj = actions[i];
                let action = obj[0];
                
                // Make sure the action is valid
                let execute = globalActions[action];
                if (!execute) {
                    throw new Error(`Conditional field ${block.field.id} has an invalid action: ${action}`);
                }
    
                let chk = block.getValue()
                if (
                    (!chk)
                ) {
                    if (execute) {
                        execute(block, !chk);
                    }
                }
            }
        },
    },
]

// Possibly match a bootstrap column class.
const col_class_regex = /col-(\d+|[a-zA-Z]+)(-(\d+|[a-zA-Z]+)$)?/;

// Actions to perform on the block
const globalActions = {
    show: (conditionalBlock, match=false) => {
        let parent = conditionalBlock.block.parentElement;
        let classname = parent.className;
        let match_col = col_class_regex.exec(classname);
        if (match_col && parent.children.length === 1) {
            parent.style.display = match ? "block" : "none";
        } else {
            conditionalBlock.block.style.display = match ? "block" : "none";
        }
    },
    hide: (conditionalBlock, match=false) => {
        let parent = conditionalBlock.block.parentElement;
        let classname = parent.className;
        let match_col = col_class_regex.exec(classname);
        if (match_col && parent.children.length === 1) {
            parent.style.display = match ? "none" : "block";
        } else {
            conditionalBlock.block.style.display = match ? "none" : "block";
        }
    },
    fshow: (conditionalBlock, match=false) => {
        if (match) {
            let parent = conditionalBlock.block.parentElement;
            let classname = parent.className;
            let match_col = col_class_regex.exec(classname);
            if (match_col && parent.children.length === 1) {
                parent.style.display = "block";
            } else {
                conditionalBlock.block.style.display = "block";
            }
        }
    },
    fhide: (conditionalBlock, match=false) => {
        if (match) {
            let parent = conditionalBlock.block.parentElement;
            let classname = parent.className;
            let match_col = col_class_regex.exec(classname);
            if (match_col && parent.children.length === 1) {
                parent.style.display = "none";
            } else {
                conditionalBlock.block.style.display = "none";
            }
        }
    },
};


class RadioProxy {
    // Turns a group of radio buttons into the same interface as a select element
    constructor(radios) {
        this.radios = radios;
    }

    get tagName() {
        return "SELECT";
    }

    get value() {
        for (let i = 0; i < this.radios.length; i++) {
            if (this.radios[i].checked) {
                return this.radios[i].value;
            }
        }
        return null;
    }

    set value(val) {
        for (let i = 0; i < this.radios.length; i++) {
            if (this.radios[i].value === val) {
                this.radios[i].checked = true;
            }
        }
    }

    addEventListener(event, callback) {
        for (let i = 0; i < this.radios.length; i++) {
            this.radios[i].addEventListener(event, callback);
        }
    }

    removeEventListener(event, callback) {
        for (let i = 0; i < this.radios.length; i++) {
            this.radios[i].removeEventListener(event, callback);
        }
    }

    focus() {
        this.radios[0].focus();
    }

    blur() {
        this.radios[0].blur();
    }

    dispatchEvent(event) {
        for (let i = 0; i < this.radios.length; i++) {
            this.radios[i].dispatchEvent(event);
        }
    }

    get checked() {
        for (let i = 0; i < this.radios.length; i++) {
            if (this.radios[i].checked) {
                return true;
            }
        }
        return false;
    }

    set checked(val) {
        for (let i = 0; i < this.radios.length; i++) {
            this.radios[i].checked = val;
        }
    }

    get name() {
        return this.radios[0].name;
    }

    set name(val) {
        for (let i = 0; i < this.radios.length; i++) {
            this.radios[i].name = val;
        }
    }

    get type() {
        if (this.radios.length && this.radios[0].type == "checkbox") {
            return "checkbox";
        }
        return "select";
    }

    get values() {
        let values = [];
        for (let i = 0; i < this.radios.length; i++) {
            values.push(this.radios[i].value);
        }
        return values;
    }

    get selectedIndex() {
        for (let i = 0; i < this.radios.length; i++) {
            if (this.radios[i].checked) {
                return i;
            }
        }
        return -1;
    }

    set selectedIndex(val) {
        for (let i = 0; i < this.radios.length; i++) {
            this.radios[i].checked = i === val;
        }
    }

    get selectedOptions() {
        let selected = [];
        for (let i = 0; i < this.radios.length; i++) {
            if (this.radios[i].checked) {
                selected.push(this.radios[i]);
            }
        }
        return selected;
    }

    get options() {
        return this.radios;
    }

    get length() {
        return this.radios.length;
    }


}


/**
 * ConditionalBlock
 * 
 * @property {HTMLElement} field
 * @property {HTMLElement} block
 * @property {HTMLElement} target
 * @property {string} targetFieldName
 * @property {string[]} actions
 * @property {string[]} values
*/
class ConditionalBlock {
    /**
     * @param {HTMLElement} field
    */
    constructor(field) {
        let targetFieldName = fieldNameRegex.exec(field.className);

        // Make sure the field has a target field name
        if (!targetFieldName) {
            throw new Error(`Conditional field ${field.id} is missing a required class name.
            Required class names are:
            gcf-handler--[field name]: ${targetFieldName}`);
        }

        // Setup the block attributes
        this.field = field;
        this.block = field.closest("div[data-contentpath]");
        this.targetFieldName = targetFieldName[1];
        
        // Setup the actions and values
        this.actionsForRegex = {}

        for (let i = 0; i < field.classList.length; i++) {
            for (let j = 0; j < execRegexes.length; j++) {
                let execRegex = execRegexes[j];
                let match = execRegex.regex.exec(field.classList[i]);
                if (match && match.length > 1) {
                    if (!this.actionsForRegex[execRegex.regex]) {
                        this.actionsForRegex[execRegex.regex] = [];
                    }
                    let matchList = [];
                    for (let k = 1; k < match.length; k++) {
                        matchList.push(match[k]);
                    }
                    this.actionsForRegex[execRegex.regex].push(
                        matchList   
                    );
                }
            }
        }

        if (!this.actionsForRegex) {
            throw new Error(`Conditional field ${field.id} is missing a required class name.
            Required class names are:
            gcf-action--[action]--[value]: ${targetFieldName}`);
        }

        let parentQuerySelector = "div.w-panel__content";
        for (let i = 0; i < field.classList.length; i++) {
            let match = parentQuerySelectorRegex.exec(field.classList[i]);
            if (match && match.length > 1) {
                let parentQuerySelectorType = match[1];
                let parentQuerySelectorName = match[2];
                parentQuerySelector = querySelectorGeneratorFuncs[parentQuerySelectorType](parentQuerySelectorName);
                break;
            }
        }

        // Setup the target field
        const panel_content = field.closest(parentQuerySelector);

        this.target = panel_content.querySelectorAll(`div[data-contentpath="${this.targetFieldName}"] .gcf-handler--${this.targetFieldName} *:is(input, select)`);
        

        if (this.target.length === 0) {
            throw new Error(`Conditional field ${field.id} is missing a target field with the name ${this.targetFieldName}`);
        } else if (this.target.length > 1) {
            // Radios and checkboxes are a special case
            // We need to proxy them to make them behave like a select element
            this.target = new RadioProxy(this.target);
        } else {
            this.target = this.target[0];
        }

        // Load the initial state
        this.execute();
        
        // Add the event listener
        if (this.target.tagName === "SELECT") {
            this.target.addEventListener("change", this.execute.bind(this));
        } else if (this.target.tagName === "BUTTON") {
            //  No clue why this might be useful, but hey; might as well include it.
            this.target.addEventListener("click", this.execute.bind(this));
        } else {
            this.target.addEventListener("input", this.execute.bind(this));
        }
    }

    execute() {
        for (let regex in this.actionsForRegex) {
            let actions = this.actionsForRegex[regex];
            let execRegex = execRegexes.find(function(element) {
                return `${element.regex}` == regex;
            });
            if (!execRegex) {
                throw new Error(`Conditional field ${this.field.className} has an invalid regex: ${regex}`);
            }

            execRegex.execute(this, actions);
        }
    }

    getValue() {
        let chk;
        if (["select", "checkbox", "radio"].includes(this.target.tagName.toLowerCase())) {
            if (this.target.selectedOptions.length) {
                chk = Array.from(this.target.selectedOptions).map((x) => x.value);
            } else {
                chk = null;
            }
        } else if (
            (this.target.type === "number") || 
            (this.target.type === "range")
        ) {
            chk = parseInt(this.target.value);
        } else {
            chk = this.target.value;
        }
        return chk;
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // Make sure all the blocks are initialized
    function makeBlocks() {
        let fields = document.querySelectorAll(".gcf:not(.gcf--initialized)");
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            
            // Add the initialized class to prevent double initialization
            field.classList.add("gcf--initialized");
    
            try {
                // Initialize the block
                new ConditionalBlock(field);
            } catch (e) {
                console.error(e);
            }
        }
    }

    // MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                for (let node of mutation.addedNodes) {
                    if (
                        (node.classList && node.classList.contains("gcf")) ||
                        (node.querySelectorAll && node.querySelectorAll(".gcf").length > 0)
                    ) {
                        console.log('A new conditional field has been added');
                        makeBlocks();
                        break;
                    }
                }
            }
        }
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document, config);

    makeBlocks();
});
