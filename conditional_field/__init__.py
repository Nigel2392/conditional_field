class _Value(str):
    pass

class _Action(str):
    pass

ANY = _Value("any")
EMPTY = _Value("empty")

SHOW = _Action("show")
HIDE = _Action("hide")
FSHOW = _Action("fshow")
FHIDE = _Action("fhide")

def classname(*args: str) -> str:
    return " ".join(args)

def handler(name: str) -> str:
    return f"gcf gcf-handler--{name}"

def conditional(
        action: str,
        condition: str,
    ):
    
    if condition is ANY or condition is EMPTY:
        return f"gcf-action-{condition}--{action}"
    
    return f"gcf-action--{action}--{condition}"
    


