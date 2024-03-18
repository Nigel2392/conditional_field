# conditional_field

Allows for arbitrary showing and hiding of fields in the admin based on certain user input.
Idea based on [Wagtail UI+](https://pypi.org/project/wagtailuiplus/#description)'s conditional visibility fields.

## Installations

1. Add conditional field to your `INSTALLED_APPS`
   ```
   INSTALLED_APPS = [
       ...
       'conditional_field'
       ...
   ]
   ```
   
2. Run `python3 ./manage.py collectstatic`

## Example usage of the gcf conditional fields.

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
        # Works with radios; selects and other input types.
        widget=forms.RadioSelect,
    )


hide_animation_fields_classname = (
    'gcf '
    'gcf-handler--animation '
    'gcf-action-empty--hide '
    'gcf-action-any--show'
)

class AnimatorBlock(blocks.StructBlock):
    animation = blocks.ChoiceBlock(
        choices=animations_choices,
        required=False,
        label=_("Animation"),
        translatable=False,
        classname=(
            'gcf-handler '
            'gcf-handler--animation'
        ),
    )

    duration = blocks.IntegerBlock(
        default=1000,
        required=True,
        translatable=False,
        label=_("Duration"),
        classname=hide_animation_fields_classname,
    )

    delay = blocks.IntegerBlock(
        default=0,
        required=True,
        translatable=False,
        label=_("Delay"),
        classname=hide_animation_fields_classname,
    )
```
