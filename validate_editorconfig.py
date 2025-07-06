#!/usr/bin/env python3
"""
EditorConfig validation script for git hooks.
Validates all files against .editorconfig rules.
"""

import os
import sys
from pathlib import Path


class EditorConfigValidator:
    def __init__(self, root_path="."):
        self.root_path = Path(root_path)
        self.config = self._parse_editorconfig()
        self.errors = []

    def _parse_editorconfig(self):
        """Parse .editorconfig file."""
        config_path = self.root_path / ".editorconfig"
        if not config_path.exists():
            print("No .editorconfig file found")
            return {}

        config = {}
        current_section = None

        with open(config_path, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue

                if line.startswith("[") and line.endswith("]"):
                    # Section header
                    current_section = line[1:-1]
                    config[current_section] = {}
                elif "=" in line and current_section:
                    # Key-value pair
                    key, value = line.split("=", 1)
                    config[current_section][key.strip()] = value.strip()
                elif "=" in line:
                    # Global setting (like root = true)
                    key, value = line.split("=", 1)
                    if "global" not in config:
                        config["global"] = {}
                    config["global"][key.strip()] = value.strip()

        return config

    def _get_file_config(self, file_path):
        """Get applicable config for a specific file."""
        file_config = {}

        # Check each section in .editorconfig
        for section, settings in self.config.items():
            if section == "*":
                # Apply to all files
                file_config.update(settings)
            elif section != "global" and self._matches_pattern(file_path, section):
                # Apply pattern-specific rules
                file_config.update(settings)

        return file_config

    def _matches_pattern(self, file_path, pattern):
        """Check if file path matches the pattern."""
        # Convert glob pattern to regex
        if pattern.startswith("*."):
            # Handle *.py, *.js, etc.
            ext = pattern[2:]
            return file_path.suffix[1:] == ext
        elif pattern.startswith("*.{") and pattern.endswith("}"):
            # Handle *.{js,mjs,ts}
            exts = pattern[3:-1].split(",")
            return file_path.suffix[1:] in exts
        elif pattern == "Makefile":
            return file_path.name == "Makefile"
        else:
            # Use glob matching
            return file_path.match(pattern)

    def validate_file(self, file_path):
        """Validate a single file against .editorconfig rules."""
        file_path = Path(file_path)

        if not file_path.exists() or file_path.is_dir():
            return True

        # Skip binary files
        if self._is_binary_file(file_path):
            return True

        config = self._get_file_config(file_path)
        if not config:
            return True

        try:
            with open(file_path, "rb") as f:
                content = f.read()

            # Check charset
            if "charset" in config and config["charset"] == "utf-8":
                try:
                    content.decode("utf-8")
                except UnicodeDecodeError:
                    self.errors.append(f"{file_path}: Not valid UTF-8")
                    return False

            # Convert to text for other checks
            try:
                text = content.decode("utf-8")
            except UnicodeDecodeError:
                return True  # Skip non-UTF-8 files

            lines = text.splitlines(keepends=True)

            # Check end_of_line
            if "end_of_line" in config and config["end_of_line"] == "lf":
                if "\r\n" in text:
                    self.errors.append(f"{file_path}: Contains CRLF line endings (should be LF)")
                    return False

            # Check insert_final_newline
            if "insert_final_newline" in config and config["insert_final_newline"] == "true":
                if text and not text.endswith("\n"):
                    self.errors.append(f"{file_path}: Missing final newline")
                    return False

            # Check trim_trailing_whitespace
            if (
                "trim_trailing_whitespace" in config
                and config["trim_trailing_whitespace"] == "true"
            ):
                for i, line in enumerate(lines, 1):
                    if line.rstrip("\r\n").endswith((" ", "\t")):
                        self.errors.append(f"{file_path}:{i}: Trailing whitespace")
                        return False

            # Check indentation
            if "indent_style" in config:
                indent_style = config["indent_style"]
                indent_size = int(config.get("indent_size", 4))

                for i, line in enumerate(lines, 1):
                    if not line.strip():  # Skip empty lines
                        continue

                    leading_ws = len(line) - len(line.lstrip(" \t"))
                    if leading_ws == 0:
                        continue

                    if indent_style == "space":
                        if "\t" in line[:leading_ws]:
                            self.errors.append(f"{file_path}:{i}: Uses tabs instead of spaces")
                            return False
                        if leading_ws % indent_size != 0:
                            self.errors.append(
                                f"{file_path}:{i}: Incorrect indentation (expected multiple of {indent_size})"
                            )
                            return False
                    elif indent_style == "tab":
                        if " " in line[:leading_ws]:
                            self.errors.append(f"{file_path}:{i}: Uses spaces instead of tabs")
                            return False

            # Check max_line_length
            if "max_line_length" in config:
                max_length = int(config["max_line_length"])
                for i, line in enumerate(lines, 1):
                    if len(line.rstrip("\r\n")) > max_length:
                        self.errors.append(
                            f"{file_path}:{i}: Line too long ({len(line.rstrip())} > {max_length})"
                        )
                        return False

            return True

        except Exception as e:
            self.errors.append(f"{file_path}: Error reading file: {e}")
            return False

    def _is_binary_file(self, file_path):
        """Check if file is binary."""
        try:
            with open(file_path, "rb") as f:
                chunk = f.read(1024)
                return b"\0" in chunk
        except:
            return True

    def validate_all(self, paths=None):
        """Validate all files in the repository."""
        if paths is None:
            # Find all non-ignored files
            paths = []
            for root, dirs, files in os.walk(self.root_path):
                # Skip common ignore patterns
                dirs[:] = [
                    d
                    for d in dirs
                    if not d.startswith(".") and d not in ["node_modules", "__pycache__"]
                ]

                for file in files:
                    if not file.startswith(".") and not file.endswith(".pyc"):
                        paths.append(Path(root) / file)

        all_valid = True
        for path in paths:
            if not self.validate_file(path):
                all_valid = False

        return all_valid

    def print_errors(self):
        """Print all validation errors."""
        for error in self.errors:
            print(f"❌ {error}")


def main():
    """Main function for command line usage."""
    validator = EditorConfigValidator()

    # If arguments provided, validate specific files
    if len(sys.argv) > 1:
        paths = [Path(arg) for arg in sys.argv[1:]]
        valid = validator.validate_all(paths)
    else:
        # Validate all files
        valid = validator.validate_all()

    if not valid:
        print(f"\n❌ Found {len(validator.errors)} EditorConfig violations:")
        validator.print_errors()
        sys.exit(1)
    else:
        print("✅ All files comply with .editorconfig rules")
        sys.exit(0)


if __name__ == "__main__":
    main()
