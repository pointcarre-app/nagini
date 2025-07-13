# Third-Party Dependencies

## License Compatibility Matrix

| Dependency | License | Runtime Usage | Compatibility with AGPL v3.0 |
|------------|---------|---------------|-------------------------------|
| **Pyodide** | Mozilla Public License 2.0 | Python runtime via WebAssembly | ✅ Compatible |
| **Brython** | BSD 3-Clause | Python-to-JavaScript transpilation | ✅ Compatible |

## Usage Model

**Important**: Nagini uses both dependencies **at runtime only** - we do not modify, fork, or redistribute the source code of these projects. This significantly simplifies license compliance requirements.

### Runtime Usage Implications
- **No source code modification**: We use these tools as-is without changes
- **No redistribution**: Dependencies are loaded independently by end users
- **Minimal compliance burden**: Only basic attribution requirements apply

## License Requirements

### Pyodide (MPL 2.0)
- **Project**: pyodide/pyodide
- **Usage**: Python runtime environment via WebAssembly
- **Integration**: Loaded at runtime in browser environments
- **Compliance Requirements**:
  - ✅ Preserve copyright notices (already handled by runtime loading)
  - ✅ No source disclosure required (runtime-only usage)
  - ✅ No copyleft obligations for our code

### Brython (BSD 3-Clause)
- **Project**: brython-dev/brython  
- **Copyright**: Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
- **Usage**: Python-to-JavaScript transpilation capabilities
- **Integration**: Used as runtime transpiler, not embedded in our codebase
- **Compliance Requirements**:
  - ✅ Preserve copyright notice (satisfied by runtime loading)
  - ✅ Include disclaimer (handled by original distribution)
  - ✅ No restrictions on our code licensing

## License Compatibility Analysis

### AGPL v3.0 Compatibility
Both dependencies are fully compatible with AGPL v3.0 licensing:
- **MPL 2.0**: Explicitly compatible with GPL/AGPL (weak copyleft)
- **BSD 3-Clause**: Permissive license, no restrictions on derivative licensing

## Nagini AGPL v3.0 Licensing

Our runtime-only usage model is fully compatible with AGPL v3.0:

### ✅ **AGPL v3.0 Distribution**
- No license conflicts with runtime dependencies
- All copyleft requirements satisfied
- Users receive full source code access
- Network use provisions apply

## Compliance Checklist

- [x] **Attribution**: Copyright notices preserved through runtime loading
- [x] **No Modification**: Using dependencies as-is without changes
- [x] **No Redistribution**: Dependencies loaded independently
- [x] **License Compatibility**: All licenses compatible with AGPL v3.0
- [x] **Documentation**: This file serves as license compliance documentation
- [x] **Source Availability**: Full source code available under AGPL v3.0
- [x] **Network Use**: AGPL network use provisions documented

## Full License References

For complete license texts:
- **MPL 2.0**: https://mozilla.org/MPL/2.0/
- **BSD 3-Clause**: https://opensource.org/licenses/BSD-3-Clause
- **AGPL v3.0**: https://www.gnu.org/licenses/agpl-3.0.html

## Legal Disclaimer

This analysis is based on our understanding of the licenses and usage patterns. For critical applications, consult with qualified legal counsel to ensure compliance with all applicable licenses and regulations.