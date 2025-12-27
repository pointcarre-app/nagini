#!/usr/bin/env python3
"""
Create a minimal Pyodide folder with only the files needed for:
- Core Pyodide runtime
- SymPy + dependencies
- Pydantic + dependencies
- Support for micropip.install() at runtime (keeps metadata files)

Usage:
    python scripts/create_minimal_pyodide.py
"""

import shutil
from pathlib import Path

# Configuration
SOURCE_DIR = Path("pyodide-local")
DEST_DIR = Path("pyodide-local-needed-for-app")

# Core Pyodide files (always required)
CORE_FILES = [
    "pyodide.js",
    "pyodide.js.map",
    "pyodide.mjs",
    "pyodide.mjs.map",
    "pyodide.asm.js",
    "pyodide.asm.wasm",
    "pyodide.d.ts",
    "python_stdlib.zip",
    "pyodide-lock.json",
    "pyodide_py.tar",
    "ffi.d.ts",
    "console.html",  # Optional but useful for debugging
    "packages.json",  # Package index
]

# Package prefixes to include (will match any version)
PACKAGES_TO_INCLUDE = [
    # SymPy + dependencies
    "sympy",
    "mpmath",
    # Pydantic + dependencies
    "pydantic",
    "pydantic_core",
    "annotated_types",
    "typing_extensions",
    # Micropip support (for runtime installs)
    "micropip",
    "packaging",
    # Common utilities often needed
    "pyparsing",  # Used by many packages
]


def matches_package(filename: str, packages: list[str]) -> bool:
    """Check if a filename matches any of the package prefixes."""
    filename_lower = filename.lower()
    for pkg in packages:
        pkg_lower = pkg.lower().replace("-", "_")
        # Match: package-version.whl or package_version.whl
        if filename_lower.startswith(pkg_lower + "-") or filename_lower.startswith(pkg_lower + "_"):
            return True
    return False


def main():
    if not SOURCE_DIR.exists():
        print(f"❌ Source directory '{SOURCE_DIR}' not found!")
        print("   Run this script from the project root after downloading Pyodide.")
        return 1

    # Clean destination
    if DEST_DIR.exists():
        print(f"🗑️  Removing existing '{DEST_DIR}'...")
        shutil.rmtree(DEST_DIR)

    DEST_DIR.mkdir(parents=True)
    print(f"📁 Created '{DEST_DIR}'")

    copied_files = []
    total_size = 0

    # Copy core files
    print("\n📦 Copying core Pyodide files...")
    for filename in CORE_FILES:
        src = SOURCE_DIR / filename
        if src.exists():
            shutil.copy2(src, DEST_DIR / filename)
            size = src.stat().st_size
            total_size += size
            copied_files.append((filename, size))
            print(f"   ✅ {filename} ({size / 1024:.1f} KB)")
        else:
            print(f"   ⚠️  {filename} (not found)")

    # Copy package wheels and metadata
    print("\n📦 Copying package wheels...")
    for src_file in sorted(SOURCE_DIR.iterdir()):
        if not src_file.is_file():
            continue

        filename = src_file.name

        # Skip if already copied (core files)
        if filename in CORE_FILES:
            continue

        # Check if it's a wheel or metadata for our packages
        if filename.endswith(".whl") or filename.endswith(".whl.metadata"):
            if matches_package(filename, PACKAGES_TO_INCLUDE):
                shutil.copy2(src_file, DEST_DIR / filename)
                size = src_file.stat().st_size
                total_size += size
                copied_files.append((filename, size))
                print(f"   ✅ {filename} ({size / 1024:.1f} KB)")

    # Summary
    print("\n" + "=" * 60)
    print(f"✅ Copied {len(copied_files)} files to '{DEST_DIR}'")
    print(f"📊 Total size: {total_size / 1024 / 1024:.2f} MB")
    print("=" * 60)

    print("\n📋 Packages included:")
    for pkg in PACKAGES_TO_INCLUDE:
        print(f"   • {pkg}")

    print(f"\n💡 To use in your app, set pyodideCdnUrl to point to '{DEST_DIR}/'")
    print("   For Capacitor: capacitor://localhost/pyodide-local-needed-for-app/")

    return 0


if __name__ == "__main__":
    exit(main())
