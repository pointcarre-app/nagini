# =============================================================================
# Code Transformation for Async Input Support
# =============================================================================
# This module handles transforming Python code to support async input() calls
# when input handling is detected in user code


def prepare_code_for_async_input(code):
    """
    Transform code to support async input handling.
    This replaces input() calls with await input() calls since we'll replace
    the built-in input function with an async version.
    """
    lines = []
    for line in code.split("\n"):
        # Make sure input() uses await, but don't modify comments
        has_input = "input(" in line
        no_await = "await input(" not in line
        not_comment = not line.strip().startswith("#")
        if has_input and no_await and not_comment:
            # Replace the input call with await input
            line = line.replace("input(", "await input(")
        lines.append(line)
    return "\n".join(lines)


def transform_code_for_execution(code):
    """
    Transform user code to support input handling only when needed.
    If code doesn't contain input() calls, execute it directly without transformation.
    """
    try:
        print("🔧 [Python] Transforming code with input() calls")
        # Check if code contains input() calls
        if "input(" in code:
            # Only transform if input() is present
            prepared = prepare_code_for_async_input(code)

            # Properly indent the user code for the async function (8 spaces for try block)
            indented_code = ""
            for line in prepared.split("\n"):
                if line.strip():  # Skip empty lines for indentation
                    indented_code += "        " + line + "\n"  # 8 spaces for try block
                else:
                    indented_code += "\n"  # Keep empty lines

            transformed = f"""import asyncio

async def __run_code():
    try:
{indented_code}
    except Exception as e:
        import traceback
        error_type = type(e).__name__
        error_msg = str(e)
        print(f"Error occurred: " + error_type + ": " + error_msg)
        traceback.print_exc()

# Execute the async code
await __run_code()
"""
            print(f"🔧 [Python] Transformation complete, code length: {len(transformed)}")
            return transformed
        else:
            # No input() calls, execute code directly without transformation
            print("🔧 [Python] No input() calls found, returning original code")
            return code
    except Exception as e:
        print(f"🔧 [Python] Error during transformation: {e}")
        import traceback

        traceback.print_exc()
        return code  # Return original code if transformation fails
