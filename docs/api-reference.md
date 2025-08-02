## Modules

<dl>
<dt><a href="#module_ValidationUtils">ValidationUtils</a></dt>
<dd><p>Validation Utilities for Nagini</p>
<p>Centralized parameter validation functions used across all components
to ensure consistent error handling and type checking.</p></dd>
<dt><a href="#module_ValidationUtils">ValidationUtils</a></dt>
<dd><p>Validation Utilities for Nagini</p>
<p>Centralized parameter validation functions used across all components
to ensure consistent error handling and type checking.</p></dd>
</dl>

## Classes

<dl>
<dt><a href="#BrythonManager">BrythonManager</a></dt>
<dd><p>BrythonManager – Minimal backend for Nagini focused on turtle graphics.
Provides the same public surface as PyodideManager but runs directly in
the main thread with Brython.  Input(), packages, and filesystem are NOT
supported for now.</p></dd>
<dt><a href="#PyodideFileLoader">PyodideFileLoader</a></dt>
<dd><p>PyodideFileLoader class for loading files into Pyodide filesystem</p></dd>
<dt><a href="#PyodideManagerFS">PyodideManagerFS</a></dt>
<dd><p>Static class containing filesystem functionality for PyodideManager</p></dd>
<dt><a href="#PyodideManagerInput">PyodideManagerInput</a></dt>
<dd><p>Static class containing input handling functionality for PyodideManager</p></dd>
<dt><a href="#PyodideManager">PyodideManager</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#createBlobWorkerUrl">createBlobWorkerUrl(workerUrl)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Create a blob worker URL from a bundled worker script</p></dd>
<dt><a href="#createBlobWorker">createBlobWorker(workerUrl)</a> ⇒ <code>Promise.&lt;Worker&gt;</code></dt>
<dd><p>Create a Worker instance using blob URL pattern</p></dd>
<dt><a href="#revokeBlobUrl">revokeBlobUrl(blobUrl)</a></dt>
<dd><p>Cleanup blob URL to prevent memory leaks</p></dd>
<dt><a href="#executeAsync">executeAsync()</a></dt>
<dd><p>Execute Python code with Brython, capturing stdout, stderr and missive.
Renamed from brython-executor.js</p></dd>
<dt><a href="#createBlobWorkerUrl">createBlobWorkerUrl(workerUrl)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Create a blob worker URL from a bundled worker script</p></dd>
<dt><a href="#createBlobWorker">createBlobWorker(workerUrl)</a> ⇒ <code>Promise.&lt;Worker&gt;</code></dt>
<dd><p>Create a Worker instance using blob URL pattern</p></dd>
<dt><a href="#revokeBlobUrl">revokeBlobUrl(blobUrl)</a></dt>
<dd><p>Cleanup blob URL to prevent memory leaks</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FileToLoad">FileToLoad</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#LoadOptions">LoadOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PyodideAPI">PyodideAPI</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#FSOperation">FSOperation</a> : <code>&#x27;writeFile&#x27;</code> | <code>&#x27;readFile&#x27;</code> | <code>&#x27;mkdir&#x27;</code> | <code>&#x27;exists&#x27;</code> | <code>&#x27;listdir&#x27;</code></dt>
<dd></dd>
<dt><a href="#FSOperationParams">FSOperationParams</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#FSOperationResult">FSOperationResult</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ExecutionResult">ExecutionResult</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#FileToLoad">FileToLoad</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#WorkerMessage">WorkerMessage</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ExecutionResult">ExecutionResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_ValidationUtils"></a>

## ValidationUtils
<p>Validation Utilities for Nagini</p>
<p>Centralized parameter validation functions used across all components
to ensure consistent error handling and type checking.</p>


* [ValidationUtils](#module_ValidationUtils)
    * _static_
        * [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
        * [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
    * _inner_
        * [~ValidationError](#module_ValidationUtils..ValidationError) : <code>Object</code>
        * [~ValidationError](#module_ValidationUtils..ValidationError) : <code>Object</code>

<a name="module_ValidationUtils.ValidationUtils"></a>

### ValidationUtils.ValidationUtils
<p>General validation utility class with static methods for parameter validation</p>

**Kind**: static class of [<code>ValidationUtils</code>](#module_ValidationUtils)  

* [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils"></a>

### ValidationUtils.ValidationUtils
<p>General validation utility class with static methods for parameter validation</p>

**Kind**: static class of [<code>ValidationUtils</code>](#module_ValidationUtils)  

* [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils..ValidationError"></a>

### ValidationUtils~ValidationError : <code>Object</code>
**Kind**: inner typedef of [<code>ValidationUtils</code>](#module_ValidationUtils)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>Error message</p> |
| component | <code>string</code> | <p>Component that threw the error</p> |
| parameter | <code>string</code> | <p>Parameter that failed validation</p> |

<a name="module_ValidationUtils..ValidationError"></a>

### ValidationUtils~ValidationError : <code>Object</code>
**Kind**: inner typedef of [<code>ValidationUtils</code>](#module_ValidationUtils)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>Error message</p> |
| component | <code>string</code> | <p>Component that threw the error</p> |
| parameter | <code>string</code> | <p>Parameter that failed validation</p> |

<a name="module_ValidationUtils"></a>

## ValidationUtils
<p>Validation Utilities for Nagini</p>
<p>Centralized parameter validation functions used across all components
to ensure consistent error handling and type checking.</p>


* [ValidationUtils](#module_ValidationUtils)
    * _static_
        * [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
        * [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
            * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
            * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
            * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
            * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
            * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
            * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
            * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
            * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
            * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
            * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
            * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
            * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
            * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
    * _inner_
        * [~ValidationError](#module_ValidationUtils..ValidationError) : <code>Object</code>
        * [~ValidationError](#module_ValidationUtils..ValidationError) : <code>Object</code>

<a name="module_ValidationUtils.ValidationUtils"></a>

### ValidationUtils.ValidationUtils
<p>General validation utility class with static methods for parameter validation</p>

**Kind**: static class of [<code>ValidationUtils</code>](#module_ValidationUtils)  

* [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils"></a>

### ValidationUtils.ValidationUtils
<p>General validation utility class with static methods for parameter validation</p>

**Kind**: static class of [<code>ValidationUtils</code>](#module_ValidationUtils)  

* [.ValidationUtils](#module_ValidationUtils.ValidationUtils)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)
    * [.validateArray(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateArray)
    * [.validateString(value, paramName, [component], [allowEmpty])](#module_ValidationUtils.ValidationUtils.validateString)
    * [.validateBoolean(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateBoolean)
    * [.validateFunction(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateFunction)
    * [.validateObject(value, paramName, [component])](#module_ValidationUtils.ValidationUtils.validateObject)
    * [.validateWorker(worker, [component])](#module_ValidationUtils.ValidationUtils.validateWorker)
    * [.validatePyodide(pyodide, [component])](#module_ValidationUtils.ValidationUtils.validatePyodide)
    * [.validateFilesToLoad(filesToLoad, [component])](#module_ValidationUtils.ValidationUtils.validateFilesToLoad)
    * [.validatePackages(packages, [component])](#module_ValidationUtils.ValidationUtils.validatePackages)
    * [.validateNamespace(namespace, [component])](#module_ValidationUtils.ValidationUtils.validateNamespace)
    * [.validateExecutionParams(filename, code, [namespace], [component])](#module_ValidationUtils.ValidationUtils.validateExecutionParams)
    * [.checkDangerousPatterns(code)](#module_ValidationUtils.ValidationUtils.checkDangerousPatterns) ⇒ <code>Array.&lt;string&gt;</code>
    * [.validateBackend(backend, [component])](#module_ValidationUtils.ValidationUtils.validateBackend)

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateArray"></a>

#### ValidationUtils.validateArray(value, paramName, [component])
<p>Validate that a value is an array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not an array</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateString"></a>

#### ValidationUtils.validateString(value, paramName, [component], [allowEmpty])
<p>Validate that a value is a string</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a string or is empty when not allowed</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |
| [allowEmpty] | <code>boolean</code> | <code>false</code> | <p>Whether to allow empty strings</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBoolean"></a>

#### ValidationUtils.validateBoolean(value, paramName, [component])
<p>Validate that a value is a boolean</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a boolean</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFunction"></a>

#### ValidationUtils.validateFunction(value, paramName, [component])
<p>Validate that a value is a function</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a function</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateObject"></a>

#### ValidationUtils.validateObject(value, paramName, [component])
<p>Validate that a value is an object (not null, not array)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If value is not a plain object</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | <p>Value to validate</p> |
| paramName | <code>string</code> |  | <p>Parameter name for error messages</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateWorker"></a>

#### ValidationUtils.validateWorker(worker, [component])
<p>Validate Worker instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If worker is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| worker | <code>any</code> |  | <p>Worker to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePyodide"></a>

#### ValidationUtils.validatePyodide(pyodide, [component])
<p>Validate Pyodide instance</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If pyodide is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pyodide | <code>any</code> |  | <p>Pyodide instance to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateFilesToLoad"></a>

#### ValidationUtils.validateFilesToLoad(filesToLoad, [component])
<p>Validate file objects array for FileLoader</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any file object is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filesToLoad | <code>Array</code> |  | <p>Array of file objects</p> |
| [component] | <code>string</code> | <code>&quot;PyodideFileLoader&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validatePackages"></a>

#### ValidationUtils.validatePackages(packages, [component])
<p>Validate packages array</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If packages array is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| packages | <code>Array</code> |  | <p>Array of package names</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateNamespace"></a>

#### ValidationUtils.validateNamespace(namespace, [component])
<p>Validate namespace object (optional parameter)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If namespace is provided but invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| namespace | <code>any</code> |  | <p>Namespace to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.validateExecutionParams"></a>

#### ValidationUtils.validateExecutionParams(filename, code, [namespace], [component])
<p>Validate execution parameters</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If any parameter is invalid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| filename | <code>string</code> |  | <p>Filename for execution</p> |
| code | <code>string</code> |  | <p>Python code to execute</p> |
| [namespace] | <code>any</code> |  | <p>Optional namespace</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils.ValidationUtils.checkDangerousPatterns"></a>

#### ValidationUtils.checkDangerousPatterns(code) ⇒ <code>Array.&lt;string&gt;</code>
<p>Check for potentially dangerous Python code patterns</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Array of dangerous patterns found</p>  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | <p>Python code to check</p> |

<a name="module_ValidationUtils.ValidationUtils.validateBackend"></a>

#### ValidationUtils.validateBackend(backend, [component])
<p>Validate backend parameter (must be 'pyodide' or &lt;?&gt;)</p>

**Kind**: static method of [<code>ValidationUtils</code>](#module_ValidationUtils.ValidationUtils)  
**Throws**:

- <code>Error</code> <p>If backend is not valid</p>


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| backend | <code>string</code> |  | <p>Backend to validate</p> |
| [component] | <code>string</code> | <code>&quot;Component&quot;</code> | <p>Component name for error context</p> |

<a name="module_ValidationUtils..ValidationError"></a>

### ValidationUtils~ValidationError : <code>Object</code>
**Kind**: inner typedef of [<code>ValidationUtils</code>](#module_ValidationUtils)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>Error message</p> |
| component | <code>string</code> | <p>Component that threw the error</p> |
| parameter | <code>string</code> | <p>Parameter that failed validation</p> |

<a name="module_ValidationUtils..ValidationError"></a>

### ValidationUtils~ValidationError : <code>Object</code>
**Kind**: inner typedef of [<code>ValidationUtils</code>](#module_ValidationUtils)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | <p>Error message</p> |
| component | <code>string</code> | <p>Component that threw the error</p> |
| parameter | <code>string</code> | <p>Parameter that failed validation</p> |

<a name="BrythonManager"></a>

## BrythonManager
<p>BrythonManager – Minimal backend for Nagini focused on turtle graphics.
Provides the same public surface as PyodideManager but runs directly in
the main thread with Brython.  Input(), packages, and filesystem are NOT
supported for now.</p>

**Kind**: global class  
<a name="PyodideFileLoader"></a>

## PyodideFileLoader
<p>PyodideFileLoader class for loading files into Pyodide filesystem</p>

**Kind**: global class  

* [PyodideFileLoader](#PyodideFileLoader)
    * [new PyodideFileLoader(filesToLoad)](#new_PyodideFileLoader_new)
    * [.loadFiles(pyodide, [options])](#PyodideFileLoader+loadFiles) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_PyodideFileLoader_new"></a>

### new PyodideFileLoader(filesToLoad)
<p>Create a new PyodideFileLoader instance</p>

**Throws**:

- <code>Error</code> <p>If filesToLoad is not an array or contains invalid objects</p>


| Param | Type | Description |
| --- | --- | --- |
| filesToLoad | [<code>Array.&lt;FileToLoad&gt;</code>](#FileToLoad) | <p>Array of file objects to load</p> |

<a name="PyodideFileLoader+loadFiles"></a>

### pyodideFileLoader.loadFiles(pyodide, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
<p>Load files into Pyodide filesystem with retry mechanism</p>

**Kind**: instance method of [<code>PyodideFileLoader</code>](#PyodideFileLoader)  
**Throws**:

- <code>Error</code> <p>If file loading fails after all retries</p>


| Param | Type | Description |
| --- | --- | --- |
| pyodide | [<code>PyodideAPI</code>](#PyodideAPI) | <p>Pyodide instance</p> |
| [options] | [<code>LoadOptions</code>](#LoadOptions) | <p>Loading options</p> |

<a name="PyodideManagerFS"></a>

## PyodideManagerFS
<p>Static class containing filesystem functionality for PyodideManager</p>

**Kind**: global class  

* [PyodideManagerFS](#PyodideManagerFS)
    * [.fs(manager, operation, params)](#PyodideManagerFS.fs) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.writeFile(manager, path, content)](#PyodideManagerFS.writeFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.readFile(manager, path)](#PyodideManagerFS.readFile) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.mkdir(manager, path)](#PyodideManagerFS.mkdir) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.exists(manager, path)](#PyodideManagerFS.exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.listdir(manager, path)](#PyodideManagerFS.listdir) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>

<a name="PyodideManagerFS.fs"></a>

### PyodideManagerFS.fs(manager, operation, params) ⇒ <code>Promise.&lt;any&gt;</code>
<p>Filesystem operations proxy - main public interface</p>

**Kind**: static method of [<code>PyodideManagerFS</code>](#PyodideManagerFS)  
**Returns**: <code>Promise.&lt;any&gt;</code> - <p>Operation result</p>  
**Throws**:

- <code>Error</code> <p>If operation fails or times out</p>


| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| operation | [<code>FSOperation</code>](#FSOperation) | <p>FS operation: 'writeFile', 'readFile', 'mkdir', 'exists', 'listdir'</p> |
| params | [<code>FSOperationParams</code>](#FSOperationParams) | <p>Operation parameters</p> |

<a name="PyodideManagerFS.writeFile"></a>

### PyodideManagerFS.writeFile(manager, path, content) ⇒ <code>Promise.&lt;Object&gt;</code>
<p>Write file to Pyodide filesystem</p>

**Kind**: static method of [<code>PyodideManagerFS</code>](#PyodideManagerFS)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - <p>Operation result</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| path | <code>string</code> | <p>File path</p> |
| content | <code>string</code> | <p>File content</p> |

<a name="PyodideManagerFS.readFile"></a>

### PyodideManagerFS.readFile(manager, path) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Read file from Pyodide filesystem</p>

**Kind**: static method of [<code>PyodideManagerFS</code>](#PyodideManagerFS)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>File content</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| path | <code>string</code> | <p>File path</p> |

<a name="PyodideManagerFS.mkdir"></a>

### PyodideManagerFS.mkdir(manager, path) ⇒ <code>Promise.&lt;Object&gt;</code>
<p>Create directory in Pyodide filesystem</p>

**Kind**: static method of [<code>PyodideManagerFS</code>](#PyodideManagerFS)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - <p>Operation result</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| path | <code>string</code> | <p>Directory path</p> |

<a name="PyodideManagerFS.exists"></a>

### PyodideManagerFS.exists(manager, path) ⇒ <code>Promise.&lt;boolean&gt;</code>
<p>Check if path exists in Pyodide filesystem</p>

**Kind**: static method of [<code>PyodideManagerFS</code>](#PyodideManagerFS)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - <p>True if exists, false otherwise</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| path | <code>string</code> | <p>Path to check</p> |

<a name="PyodideManagerFS.listdir"></a>

### PyodideManagerFS.listdir(manager, path) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
<p>List directory contents in Pyodide filesystem</p>

**Kind**: static method of [<code>PyodideManagerFS</code>](#PyodideManagerFS)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - <p>Array of file/directory names</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| path | <code>string</code> | <p>Directory path</p> |

<a name="PyodideManagerInput"></a>

## PyodideManagerInput
<p>Static class containing input handling functionality for PyodideManager</p>

**Kind**: global class  

* [PyodideManagerInput](#PyodideManagerInput)
    * [.initializeInputState(manager)](#PyodideManagerInput.initializeInputState) ⇒ <code>void</code>
    * [.provideInput(manager, input)](#PyodideManagerInput.provideInput) ⇒ <code>void</code>
    * [.queueInput(manager, input)](#PyodideManagerInput.queueInput) ⇒ <code>void</code>
    * [.setInputCallback(manager, callback)](#PyodideManagerInput.setInputCallback) ⇒ <code>void</code>
    * [.isWaitingForInput(manager)](#PyodideManagerInput.isWaitingForInput) ⇒ <code>boolean</code>
    * [.getCurrentPrompt(manager)](#PyodideManagerInput.getCurrentPrompt) ⇒ <code>string</code>
    * [.handleInputMessage(manager, data)](#PyodideManagerInput.handleInputMessage) ⇒ <code>void</code>
    * [.resetInputState(manager)](#PyodideManagerInput.resetInputState) ⇒ <code>void</code>

<a name="PyodideManagerInput.initializeInputState"></a>

### PyodideManagerInput.initializeInputState(manager) ⇒ <code>void</code>
<p>Initialize input state for a PyodideManager instance</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance to initialize</p> |

<a name="PyodideManagerInput.provideInput"></a>

### PyodideManagerInput.provideInput(manager, input) ⇒ <code>void</code>
<p>Provide input to Python code that's waiting for input</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| input | <code>string</code> | <p>The input value to provide</p> |

<a name="PyodideManagerInput.queueInput"></a>

### PyodideManagerInput.queueInput(manager, input) ⇒ <code>void</code>
<p>Queue input for later provision when Python code requests it</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| input | <code>string</code> | <p>The input value to queue</p> |

<a name="PyodideManagerInput.setInputCallback"></a>

### PyodideManagerInput.setInputCallback(manager, callback) ⇒ <code>void</code>
<p>Set a callback function to be called when input is required</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| callback | <code>function</code> | <p>Function to call when input is needed</p> |

<a name="PyodideManagerInput.isWaitingForInput"></a>

### PyodideManagerInput.isWaitingForInput(manager) ⇒ <code>boolean</code>
<p>Check if Python code is currently waiting for input</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  
**Returns**: <code>boolean</code> - <p>True if waiting for input, false otherwise</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |

<a name="PyodideManagerInput.getCurrentPrompt"></a>

### PyodideManagerInput.getCurrentPrompt(manager) ⇒ <code>string</code>
<p>Get the current input prompt if waiting for input</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  
**Returns**: <code>string</code> - <p>Current input prompt or empty string</p>  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |

<a name="PyodideManagerInput.handleInputMessage"></a>

### PyodideManagerInput.handleInputMessage(manager, data) ⇒ <code>void</code>
<p>Handle input-related message from worker</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |
| data | <code>Object</code> | <p>Message data from worker</p> |

<a name="PyodideManagerInput.resetInputState"></a>

### PyodideManagerInput.resetInputState(manager) ⇒ <code>void</code>
<p>Reset input state (called on execution completion)</p>

**Kind**: static method of [<code>PyodideManagerInput</code>](#PyodideManagerInput)  

| Param | Type | Description |
| --- | --- | --- |
| manager | [<code>PyodideManager</code>](#PyodideManager) | <p>Manager instance</p> |

<a name="PyodideManager"></a>

## PyodideManager
**Kind**: global class  

* [PyodideManager](#PyodideManager)
    * [new PyodideManager(packages, micropipPackages, filesToLoad, workerPath)](#new_PyodideManager_new)
    * [.worker](#PyodideManager+worker) : <code>Worker</code> \| <code>null</code>
    * [.executionHistory](#PyodideManager+executionHistory) : [<code>Array.&lt;ExecutionResult&gt;</code>](#ExecutionResult)
    * [.isReady](#PyodideManager+isReady) : <code>boolean</code>
    * [.packages](#PyodideManager+packages) : <code>Array.&lt;string&gt;</code>
    * [.micropipPackages](#PyodideManager+micropipPackages) : <code>Array.&lt;string&gt;</code>
    * [.filesToLoad](#PyodideManager+filesToLoad) : [<code>Array.&lt;FileToLoad&gt;</code>](#FileToLoad)
    * [.workerPath](#PyodideManager+workerPath) : <code>string</code>
    * [.blobUrl](#PyodideManager+blobUrl) : <code>string</code> \| <code>null</code>
    * [.validateAndFilterPackages(packages)](#PyodideManager+validateAndFilterPackages) ⇒ <code>Array.&lt;string&gt;</code>
    * [.handleMessage(data)](#PyodideManager+handleMessage) ⇒ <code>void</code>
    * [.setHandleMessage([newHandler])](#PyodideManager+setHandleMessage) ⇒ <code>function</code>
    * [.getHandleMessage()](#PyodideManager+getHandleMessage) ⇒ <code>function</code>
    * [.executeFile(filename, code, [namespace])](#PyodideManager+executeFile) ⇒ <code>void</code>
    * [.executeAsync(filename, code, [namespace])](#PyodideManager+executeAsync) ⇒ [<code>Promise.&lt;ExecutionResult&gt;</code>](#ExecutionResult)
    * [.clearExecutionHistory()](#PyodideManager+clearExecutionHistory) ⇒ <code>void</code>
    * [.destroy()](#PyodideManager+destroy) ⇒ <code>void</code>

<a name="new_PyodideManager_new"></a>

### new PyodideManager(packages, micropipPackages, filesToLoad, workerPath)
<p>Create a new PyodideManager instance</p>

**Throws**:

- <code>Error</code> <p>If any parameter has incorrect type or worker is not bundled</p>


| Param | Type | Description |
| --- | --- | --- |
| packages | <code>Array.&lt;string&gt;</code> | <p>Array of Python package names to install</p> |
| micropipPackages | <code>Array.&lt;string&gt;</code> | <p>Array of Python package names to install with micropip</p> |
| filesToLoad | [<code>Array.&lt;FileToLoad&gt;</code>](#FileToLoad) | <p>Array of file objects to load into filesystem</p> |
| workerPath | <code>string</code> | <p>Path to the bundled web worker file (must be worker-dist.js)</p> |

<a name="PyodideManager+worker"></a>

### pyodideManager.worker : <code>Worker</code> \| <code>null</code>
<p>Web worker instance</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+executionHistory"></a>

### pyodideManager.executionHistory : [<code>Array.&lt;ExecutionResult&gt;</code>](#ExecutionResult)
<p>Execution history with results and metadata</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+isReady"></a>

### pyodideManager.isReady : <code>boolean</code>
<p>Whether Pyodide is ready for execution</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+packages"></a>

### pyodideManager.packages : <code>Array.&lt;string&gt;</code>
<p>Python packages to install during initialization - filtered and validated</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+micropipPackages"></a>

### pyodideManager.micropipPackages : <code>Array.&lt;string&gt;</code>
<p>Python packages to install with micropip - filtered and validated</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+filesToLoad"></a>

### pyodideManager.filesToLoad : [<code>Array.&lt;FileToLoad&gt;</code>](#FileToLoad)
<p>Files to load into Pyodide filesystem</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+workerPath"></a>

### pyodideManager.workerPath : <code>string</code>
<p>Path to the bundled web worker file</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+blobUrl"></a>

### pyodideManager.blobUrl : <code>string</code> \| <code>null</code>
<p>Blob URL for cleanup</p>

**Kind**: instance property of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+validateAndFilterPackages"></a>

### pyodideManager.validateAndFilterPackages(packages) ⇒ <code>Array.&lt;string&gt;</code>
<p>Validate and filter Python packages</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
**Returns**: <code>Array.&lt;string&gt;</code> - <p>Validated and filtered package names</p>  

| Param | Type | Description |
| --- | --- | --- |
| packages | <code>Array.&lt;string&gt;</code> | <p>Array of package names to validate</p> |

<a name="PyodideManager+handleMessage"></a>

### pyodideManager.handleMessage(data) ⇒ <code>void</code>
<p>Handle messages from the Pyodide worker
Updates UI status and manages execution context</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  

| Param | Type | Description |
| --- | --- | --- |
| data | [<code>WorkerMessage</code>](#WorkerMessage) | <p>Message from worker</p> |

<a name="PyodideManager+setHandleMessage"></a>

### pyodideManager.setHandleMessage([newHandler]) ⇒ <code>function</code>
<p>Get or set the current message handler</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
**Returns**: <code>function</code> - <p>Current message handler</p>  

| Param | Type | Description |
| --- | --- | --- |
| [newHandler] | <code>function</code> | <p>New message handler to set</p> |

<a name="PyodideManager+getHandleMessage"></a>

### pyodideManager.getHandleMessage() ⇒ <code>function</code>
<p>Get the current message handler</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
**Returns**: <code>function</code> - <p>Current message handler</p>  
<a name="PyodideManager+executeFile"></a>

### pyodideManager.executeFile(filename, code, [namespace]) ⇒ <code>void</code>
<p>Execute Python code in the worker with optional namespace isolation</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
**Returns**: <code>void</code> - <ul>
<li>No return value, sends message to worker</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | <p>Name for this execution (for tracking and debugging)</p> |
| code | <code>string</code> | <p>Python code to execute</p> |
| [namespace] | <code>Object</code> \| <code>undefined</code> | <p>Optional namespace object for Python execution</p> |

<a name="PyodideManager+executeAsync"></a>

### pyodideManager.executeAsync(filename, code, [namespace]) ⇒ [<code>Promise.&lt;ExecutionResult&gt;</code>](#ExecutionResult)
<p>Execute Python code asynchronously and return a Promise with the result</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
**Returns**: [<code>Promise.&lt;ExecutionResult&gt;</code>](#ExecutionResult) - <p>Promise that resolves with execution result</p>  
**Throws**:

- <code>Error</code> <p>If manager is not ready or execution times out</p>


| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | <p>Name for this execution (for tracking and debugging)</p> |
| code | <code>string</code> | <p>Python code to execute</p> |
| [namespace] | <code>Object</code> \| <code>undefined</code> | <p>Optional namespace object for Python execution</p> |

<a name="PyodideManager+clearExecutionHistory"></a>

### pyodideManager.clearExecutionHistory() ⇒ <code>void</code>
<p>Clear execution history context</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
<a name="PyodideManager+destroy"></a>

### pyodideManager.destroy() ⇒ <code>void</code>
<p>Cleanup resources and terminate worker
Call this when the manager is no longer needed to prevent memory leaks</p>

**Kind**: instance method of [<code>PyodideManager</code>](#PyodideManager)  
<a name="createBlobWorkerUrl"></a>

## createBlobWorkerUrl(workerUrl) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Create a blob worker URL from a bundled worker script</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Blob URL that can be used to create a Worker</p>  
**Throws**:

- <code>Error</code> <p>If worker script cannot be fetched</p>


| Param | Type | Description |
| --- | --- | --- |
| workerUrl | <code>string</code> | <p>URL to the bundled worker script (worker-dist.js)</p> |

<a name="createBlobWorker"></a>

## createBlobWorker(workerUrl) ⇒ <code>Promise.&lt;Worker&gt;</code>
<p>Create a Worker instance using blob URL pattern</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;Worker&gt;</code> - <p>Web Worker instance created from blob URL</p>  
**Throws**:

- <code>Error</code> <p>If worker creation fails</p>


| Param | Type | Description |
| --- | --- | --- |
| workerUrl | <code>string</code> | <p>URL to the bundled worker script (worker-dist.js)</p> |

<a name="revokeBlobUrl"></a>

## revokeBlobUrl(blobUrl)
<p>Cleanup blob URL to prevent memory leaks</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| blobUrl | <code>string</code> | <p>Blob URL to revoke</p> |

<a name="executeAsync"></a>

## executeAsync()
<p>Execute Python code with Brython, capturing stdout, stderr and missive.
Renamed from brython-executor.js</p>

**Kind**: global function  
<a name="createBlobWorkerUrl"></a>

## createBlobWorkerUrl(workerUrl) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Create a blob worker URL from a bundled worker script</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>Blob URL that can be used to create a Worker</p>  
**Throws**:

- <code>Error</code> <p>If worker script cannot be fetched</p>


| Param | Type | Description |
| --- | --- | --- |
| workerUrl | <code>string</code> | <p>URL to the bundled worker script (worker-dist.js)</p> |

<a name="createBlobWorker"></a>

## createBlobWorker(workerUrl) ⇒ <code>Promise.&lt;Worker&gt;</code>
<p>Create a Worker instance using blob URL pattern</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;Worker&gt;</code> - <p>Web Worker instance created from blob URL</p>  
**Throws**:

- <code>Error</code> <p>If worker creation fails</p>


| Param | Type | Description |
| --- | --- | --- |
| workerUrl | <code>string</code> | <p>URL to the bundled worker script (worker-dist.js)</p> |

<a name="revokeBlobUrl"></a>

## revokeBlobUrl(blobUrl)
<p>Cleanup blob URL to prevent memory leaks</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| blobUrl | <code>string</code> | <p>Blob URL to revoke</p> |

<a name="FileToLoad"></a>

## FileToLoad : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | <p>URL to fetch the file from (supports S3, HTTP, local paths)</p> |
| path | <code>string</code> | <p>Target path in Pyodide filesystem where file should be saved</p> |

<a name="LoadOptions"></a>

## LoadOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [maxRetries] | <code>number</code> | <code>3</code> | <p>Maximum number of retry attempts for failed downloads</p> |
| [retryDelay] | <code>number</code> | <code>1000</code> | <p>Base delay in milliseconds between retries</p> |

<a name="PyodideAPI"></a>

## PyodideAPI : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| FS | <code>Object</code> | <p>Pyodide filesystem interface</p> |
| FS.writeFile | <code>function</code> | <p>Write file to filesystem</p> |
| FS.analyzePath | <code>function</code> | <p>Analyze path existence</p> |
| FS.mkdir | <code>function</code> | <p>Create directory</p> |

<a name="FSOperation"></a>

## FSOperation : <code>&#x27;writeFile&#x27;</code> \| <code>&#x27;readFile&#x27;</code> \| <code>&#x27;mkdir&#x27;</code> \| <code>&#x27;exists&#x27;</code> \| <code>&#x27;listdir&#x27;</code>
**Kind**: global typedef  
<a name="FSOperationParams"></a>

## FSOperationParams : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | <p>File or directory path</p> |
| [content] | <code>string</code> | <p>File content (for writeFile operation)</p> |

<a name="FSOperationResult"></a>

## FSOperationResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [success] | <code>boolean</code> | <p>Whether operation succeeded</p> |
| [content] | <code>string</code> | <p>File content (for readFile)</p> |
| [exists] | <code>boolean</code> | <p>Whether file/directory exists</p> |
| [files] | <code>Array.&lt;string&gt;</code> | <p>Directory contents (for listdir)</p> |

<a name="ExecutionResult"></a>

## ExecutionResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | <p>Name of the executed file</p> |
| time | <code>number</code> | <p>Execution time in milliseconds</p> |
| stdout | <code>string</code> | <p>Standard output from Python execution</p> |
| stderr | <code>string</code> | <p>Standard error from Python execution</p> |
| missive | <code>Object</code> \| <code>null</code> | <p>Structured JSON data from Python</p> |
| figures | <code>Array.&lt;string&gt;</code> | <p>Base64 encoded matplotlib figures</p> |
| error | <code>Object</code> \| <code>null</code> | <p>JavaScript execution error object</p> |
| timestamp | <code>string</code> | <p>ISO timestamp of execution</p> |
| [executedWithNamespace] | <code>boolean</code> | <p>Whether execution used namespace</p> |

<a name="FileToLoad"></a>

## FileToLoad : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | <p>Path where file should be saved in filesystem</p> |
| content | <code>string</code> | <p>File content to write</p> |
| [encoding] | <code>string</code> | <p>File encoding (default: 'utf8')</p> |

<a name="WorkerMessage"></a>

## WorkerMessage : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>&#x27;ready&#x27;</code> \| <code>&#x27;error&#x27;</code> \| <code>&#x27;warning&#x27;</code> \| <code>&#x27;info&#x27;</code> \| <code>&#x27;result&#x27;</code> \| <code>&#x27;fs\_result&#x27;</code> \| <code>&#x27;fs\_error&#x27;</code> | <p>Message type</p> |
| [message] | <code>string</code> | <p>Message content</p> |
| [error] | <code>string</code> | <p>Error message</p> |
| [filename] | <code>string</code> | <p>Filename for execution results</p> |
| [time] | <code>number</code> | <p>Execution time in milliseconds</p> |
| [stdout] | <code>string</code> | <p>Standard output</p> |
| [stderr] | <code>string</code> | <p>Standard error</p> |
| [missive] | <code>Object</code> \| <code>null</code> | <p>Structured data from Python</p> |
| [error] | <code>Object</code> \| <code>null</code> | <p>Execution error object</p> |
| [result] | <code>any</code> | <p>Filesystem operation result</p> |

<a name="ExecutionResult"></a>

## ExecutionResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | <p>Name of the executed file</p> |
| time | <code>number</code> | <p>Execution time in milliseconds</p> |
| stdout | <code>string</code> | <p>Standard output from Python execution</p> |
| stderr | <code>string</code> | <p>Standard error from Python execution</p> |
| missive | <code>Object</code> \| <code>null</code> | <p>Structured JSON data from Python</p> |
| error | <code>Object</code> \| <code>null</code> | <p>JavaScript execution error object</p> |
| timestamp | <code>string</code> | <p>ISO timestamp of execution</p> |
| [executedWithNamespace] | <code>boolean</code> | <p>Whether execution used namespace</p> |

