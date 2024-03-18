from wagtail import hooks
from django.templatetags.static import static
from django.utils.safestring import mark_safe

@hooks.register("insert_global_admin_js")
def global_admin_js():
    return mark_safe(f"""
        <script src="{static('conditional_field/js/conditional_field.js')}"></script>""")
