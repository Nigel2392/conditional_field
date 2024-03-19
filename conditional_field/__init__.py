class _Value(str):
    pass

class _Action(str):
    """
        General utility class for generating handler actions.
        Creates CSS classnames.

        Example:
        >>> SHOW("any") == "gcf-action-any--show"
        >>> SHOW("any", "my_handler") == "gcf gcf-handler--my_handler gcf-action-any--show"

        >>> classname(handler("my_handler"), SHOW("any")) == "gcf gcf-handler--my_handler gcf-action-any--show"
        
        # WRONG: we are using a handler twice.
        >>> classname(handler("my_handler"), SHOW("any", "my_handler")) == "gcf gcf-handler--my_handler gcf gcf-handler--my_handler gcf-action-any--show"
    """
    def __call__(self, condition: str, handler: str = None) -> str:
        return conditional(self, condition, handler_name=handler)


ANY = _Value("any")
EMPTY = _Value("empty")

SHOW = _Action("show")
HIDE = _Action("hide")
FSHOW = _Action("fshow")
FHIDE = _Action("fhide")


def classname(*args: str) -> str:
    """
        Utility method; joins classnames together.
    """
    args = filter(None, args)
    return " ".join(args)


def handler(name: str) -> str:
    """
        Create a handler selector for a field.
    """
    return f"gcf gcf-handler--{name}"


def parent(querySelectorType: str, name: str) -> str:
    """
        Select from a parent element to search for a handler.
        This is useful for coniditional fields inside of embedded blocks
        like list or streamblocks.

        Example:
        ```python

        class FlatMenuItem(blocks.StructBlock):
        
            # Only shows if the second template choice (zero indexed) is selected.
            image = ImageChooserBlock(
                classname=make_classname(
                    SHOW(1, "custom_template"),
                    parent_queryselector("class", "example-wrapper-for-FlatMenu")
                )
            )

        class FlatMenu(ToggleableBlock, TemplateBlock):
            templates = (
                ("globlocks/blocks/components/menus/flat/vertical.html", _("Vertical")),
                ("globlocks/blocks/components/menus/flat/horizontal.html", _("Horizontal")),
            )

            custom_template = blocks.ChoiceBlock(
                required=False,
                help_text=_("A custom template to use for the menu."),
                choices=templates,
                classname="gcf gcf-handler--custom_template",
            )
        ```
    """
    return f"gcf-parent--{querySelectorType}--{name}"

def conditional(
        action: str,
        condition: str,
        handler_name = None,
    ):
    
    if condition is ANY or condition is EMPTY:
        s = f"gcf-action-{condition}--{action}"
    else:
        s = f"gcf-action--{action}--{condition}"

    if handler_name:
        s = f"{handler(handler_name)} {s}"

    return s


