class _Value(str):
    pass

class _Action(str):
    def __call__(self, condition: str, handler: str = None) -> str:
        return conditional(self, condition, handler_name=handler)

ANY = _Value("any")
EMPTY = _Value("empty")

SHOW = _Action("show")
HIDE = _Action("hide")
FSHOW = _Action("fshow")
FHIDE = _Action("fhide")

def classname(*args: str) -> str:
    args = filter(None, args)
    return " ".join(args)

def handler(name: str) -> str:
    return f"gcf gcf-handler--{name}"

def parent(querySelectorType: str, name: str) -> str:
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


