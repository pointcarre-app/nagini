# =============================================================================
# Code transformation for async input support
# =============================================================================
# Le builtin input() est remplacé côté worker par une coroutine asynchrone
# (voir worker-input.js). Il faut donc préfixer d'un await les vrais appels
# input(). La détection et la réécriture se font sur l'AST : seuls les appels
# au builtin input sont touchés, jamais un identifiant comme some_func__input
# ni une méthode obj.input(). Le code est exécuté par runPythonAsync, qui
# autorise le await de premier niveau, donc on n'enveloppe pas le code dans une
# fonction : les variables de niveau module restent dans les globals.

import ast


class _AwaitInputTransformer(ast.NodeTransformer):
    """Préfixe d'un await chaque appel au builtin input() exécutable au niveau
    module ou dans une fonction async. Les appels situés dans une fonction
    synchrone ou un lambda sont laissés tels quels : un await y serait invalide
    et casserait tout le programme."""

    def __init__(self):
        self.inserted = False
        self._sync_scope_depth = 0

    def visit_FunctionDef(self, node):
        self._sync_scope_depth += 1
        self.generic_visit(node)
        self._sync_scope_depth -= 1
        return node

    def visit_Lambda(self, node):
        self._sync_scope_depth += 1
        self.generic_visit(node)
        self._sync_scope_depth -= 1
        return node

    def visit_ClassDef(self, node):
        # un corps de classe est un scope propre où await est toujours
        # invalide, même au niveau module
        self._sync_scope_depth += 1
        self.generic_visit(node)
        self._sync_scope_depth -= 1
        return node

    def visit_AsyncFunctionDef(self, node):
        # await redevient valide ici, même quand la fonction async est définie
        # à l'intérieur d'une fonction synchrone : on repart de zéro
        saved = self._sync_scope_depth
        self._sync_scope_depth = 0
        self.generic_visit(node)
        self._sync_scope_depth = saved
        return node

    def visit_Call(self, node):
        self.generic_visit(node)
        is_input_builtin = isinstance(node.func, ast.Name) and node.func.id == "input"
        if is_input_builtin and self._sync_scope_depth == 0:
            self.inserted = True
            return ast.Await(value=node)
        return node


def _rewrite_input_calls(code):
    """Renvoie le code réécrit (await input) si au moins un appel a été
    transformé, sinon None. Laisse remonter SyntaxError si le code ne parse
    pas, pour que l'erreur soit reportée telle quelle à l'exécution."""
    tree = ast.parse(code)
    transformer = _AwaitInputTransformer()
    new_tree = transformer.visit(tree)
    if not transformer.inserted:
        return None
    ast.fix_missing_locations(new_tree)
    return ast.unparse(new_tree)


def prepare_code_for_async_input(code):
    """Réécrit les appels input() en await input(). Renvoie le code inchangé si
    aucun vrai appel input() n'est présent ou si le code ne parse pas."""
    try:
        rewritten = _rewrite_input_calls(code)
    except SyntaxError:
        return code
    return code if rewritten is None else rewritten


def transform_code_for_execution(code):
    """Transforme le code utilisateur pour le support de input() asynchrone.

    Idempotent vis-à-vis du code sans input() : il est renvoyé inchangé."""
    return prepare_code_for_async_input(code)
