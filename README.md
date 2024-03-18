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
    text = CharblockWithPlaceholder(
        required=False,
        label=_("Text"),
    )

    page = blocks.PageChooserBlock(
        required=False,
        label=_("Page"),
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
            "gcf-action--show--document"
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

    email = blocks.EmailBlock(
        required=False,
        label=_("Email"),
        classname=(
            "gcf "
            "gcf-handler--choice "
            "gcf-action--show--email"
        ),
    )

    phone = blocks.CharBlock(
        required=False,
        label=_("Tel"),
        placeholder=_("123-456-7890"),
        validators=[
            RegexValidator(
                regex=r"^\+?[0-9\-\s\(\)]+$",
                message=_("Enter a valid phone number."),
            )
        ],
        min_length=7,
        max_length=14,
        classname=(
            # Example of multiple allowed
            # choices for a single block
            # We introduce fshow and fhide,
            # these do not automatically do the opposite for false values.
            # You would not want to use this in this context; it is just an example.
            "gcf "
            "gcf-handler--choice "
            "gcf-action-any--fhide "
            "gcf-action--fshow--email "
            "gcf-action--fshow--tel"
        ),
    )

    choice = blocks.ChoiceBlock(
        required=True,
        choices=[
             ("page", "Page")
             ("document", "Document")
             ("external_link", "External")
             ("email", "Email Link")
             ("tel", "Telephone Link")
        ],
        default="page",
        label=_("Link Type"),
        classname=(
            "gcf "
            "gcf-handler--choice"
        ),
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
            'gcf '
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
