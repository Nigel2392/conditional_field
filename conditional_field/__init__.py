class _Value(str):
    pass

ANY = _Value("any")
EMPTY = _Value("empty")

def handler(name: str) -> str:
    return f"gcf gcf-handler--{name}"

def conditional(
        action: str,
        condition: str,
    ):
    
    if condition is ANY or condition is EMPTY:
        return f"gcf-action-{condition}--{action}"
    
    return f"gcf-action--{action}--{condition}"
    


