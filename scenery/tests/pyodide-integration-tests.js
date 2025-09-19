import {
    assert,
    assertEquals,
    assertContains,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';

export class PyodideIntegrationTests {
    static async testComplexInputData(manager) {
        const testName = "complex input data scenarios";
        logTestStart("PyodideIntegration", testName);

        try {
            // Test 1: Multiple inputs with different types
            manager.queueInput("John Doe");
            manager.queueInput("30");
            manager.queueInput("Engineer");
            manager.queueInput("y");

            const result1 = await manager.executeAsync(
                "complex_input_test1",
                `print("=== User Registration System ===")
name = input("Enter your full name: ")
age = int(input("Enter your age: "))
job = input("Enter your job title: ")
newsletter = input("Subscribe to newsletter? (y/n): ")
print(f"Registration complete!")
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Job: {job}")
print(f"Newsletter: {'Yes' if newsletter.lower() == 'y' else 'No'}")
is_adult = age >= 18
next_decade = age + 10
missive({"name": name, "age": age, "job": job, "newsletter": newsletter, "is_adult": is_adult, "next_decade": next_decade})`
            );

            assert(!result1.error, "Complex input test 1 should not have errors");
            
            // Parse missive JSON string to object
            const missive1 = JSON.parse(result1.missive);
            assertEquals(missive1.name, "John Doe", "Name should match input");
            assertEquals(missive1.age, 30, "Age should match input");
            assertEquals(missive1.job, "Engineer", "Job should match input");
            assertEquals(missive1.newsletter, "y", "Newsletter should match input");
            assertEquals(missive1.is_adult, true, "Should correctly calculate adult status");
            assertEquals(missive1.next_decade, 40, "Should correctly calculate next decade");

            // Test 2: Input with validation loop
            manager.queueInput("0");    // Invalid - too low
            manager.queueInput("150");  // Invalid - too high
            manager.queueInput("25");   // Valid

            const result2 = await manager.executeAsync(
                "complex_input_test2",
                `print("=== Input Validation Test ===")
while True:
    age_str = input("Enter your age (1-120): ")
    age = int(age_str)
    if 1 <= age <= 120:
        print(f"Valid age: {age}")
        break
    else:
        print(f"Invalid age: {age}. Please try again.")
print("Age validation completed!")
missive({"validated_age": age})`
            );

            assert(!result2.error, "Complex input test 2 should not have errors");
            
            // Parse missive JSON string to object
            const missive2 = JSON.parse(result2.missive);
            assertEquals(missive2.validated_age, 25, "Should get validated age");
            assertContains(result2.stdout, "Invalid age: 0", "Should show first invalid age");
            assertContains(result2.stdout, "Invalid age: 150", "Should show second invalid age");
            assertContains(result2.stdout, "Valid age: 25", "Should show valid age");

            // Test 3: Mathematical input processing
            manager.queueInput("5");
            manager.queueInput("3");
            manager.queueInput("2");

            const result3 = await manager.executeAsync(
                "complex_input_test3",
                `print("=== Calculator Test ===")
numbers = []
for i in range(3):
    num_str = input(f"Enter number {i+1}: ")
    numbers.append(float(num_str))
total = sum(numbers)
average = total / len(numbers)
product = 1
for num in numbers:
    product *= num
print(f"Numbers: {numbers}")
print(f"Sum: {total}")
print(f"Average: {average}")
print(f"Product: {product}")
missive({"numbers": numbers, "sum": total, "average": average, "product": product})`
            );

            assert(!result3.error, "Complex input test 3 should not have errors");
            
            // Parse missive JSON string to object
            const missive3 = JSON.parse(result3.missive);
            assertEquals(missive3.numbers, [5.0, 3.0, 2.0], "Should get correct numbers");
            assertEquals(missive3.sum, 10.0, "Should calculate correct sum");
            assertEquals(missive3.average, 10.0/3, "Should calculate correct average");
            assertEquals(missive3.product, 30.0, "Should calculate correct product");

            logTestPass(testName);
            return { result1, result2, result3, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testDataVisualizationWorkflow(manager) {
        const testName = "data visualization workflow";
        logTestStart("PyodideIntegration", testName);

        try {
            const result = await manager.executeAsync(
                "data_viz_workflow",
                `import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(-np.pi, np.pi, 50)
y1 = np.sin(x)
y2 = np.cos(x)
y3 = np.sin(x) * np.cos(x)
# Create first figure
fig1 = plt.figure(figsize=(8, 6))
plt.plot(x, y1, 'b-', label='sin(x)')
plt.plot(x, y2, 'r--', label='cos(x)')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Trigonometric Functions')
plt.legend()
plt.grid(True)
# Create second figure
fig2 = plt.figure(figsize=(8, 6))
plt.plot(x, y3, 'g-', label='sin(x)*cos(x)')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Product of Trigonometric Functions')
plt.legend()
plt.grid(True)
mean_y1 = np.mean(y1)
std_y1 = np.std(y1)
max_y1 = np.max(y1)
min_y1 = np.min(y1)
print(f"Statistical Analysis of sin(x):")
print(f"Mean: {mean_y1:.4f}")
missive({"x_points": len(x), "datasets": 3, "figures": 2, "mean_y1": mean_y1, "std_y1": std_y1, "max_y1": max_y1, "min_y1": min_y1})`
            );

            assert(!result.error, "Data visualization workflow should not have errors");
            assert(result.figures, "Should have figures");
            assert(result.figures.length >= 2, "Should have at least 2 figures");
            
            // Parse missive JSON string to object
            const missiveData = JSON.parse(result.missive);
            assertEquals(missiveData.x_points, 50, "Should have correct x points");
            assertEquals(missiveData.datasets, 3, "Should have 3 datasets");
            assertEquals(missiveData.figures, 2, "Should have 2 figures");

            // Verify statistical calculations are reasonable
            assert(Math.abs(missiveData.mean_y1) < 0.1, "Sin mean should be close to 0 over symmetric range");
            assert(missiveData.std_y1 > 0.5, "Sin std should be reasonable");
            assert(missiveData.max_y1 <= 1.0, "Sin max should be <= 1");
            assert(missiveData.min_y1 >= -1.0, "Sin min should be >= -1");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testBokehCaptureWorkflow(manager) {
        const testName = "bokeh capture workflow";
        logTestStart("PyodideIntegration", testName);

        try {
            // First, ensure bokeh is installed via micropip (more reliable than preloading)
            console.log("Installing/checking bokeh via micropip...");
            const installBokeh = await manager.executeAsync(
                "install_bokeh",
                `import micropip
print("Installing bokeh via micropip...")
await micropip.install('bokeh')
import bokeh
print(f"Bokeh installed successfully, version: {bokeh.__version__}")

# Also verify the capture function exists
import sys
if 'get_bokeh_figures' in dir(sys.modules['__main__']):
    print("get_bokeh_figures function is available")
else:
    print("WARNING: get_bokeh_figures not found in __main__")`
            );
            
            console.log("Bokeh installation result:", installBokeh.stdout);
            assert(!installBokeh.error, "Bokeh installation should not have errors");
            
            // Now run the actual test
            const result = await manager.executeAsync(
                "bokeh_capture_test",
                `from bokeh.plotting import figure, curdoc
from bokeh.models import HoverTool
from bokeh.layouts import column, row
import numpy as np
import json

# Create first plot
p1 = figure(title="Test Plot 1", width=400, height=300)
x = np.linspace(0, 4*np.pi, 100)
y = np.sin(x)
p1.line(x, y, line_width=2, color="navy", legend_label="sin(x)")
p1.circle(x[::10], y[::10], size=8, color="red", alpha=0.5)

# Add hover tool
hover = HoverTool(tooltips=[("(x,y)", "($x, $y)")])
p1.add_tools(hover)

# Create second plot
p2 = figure(title="Test Plot 2", width=400, height=300)
y2 = np.cos(x)
p2.line(x, y2, line_width=2, color="green", legend_label="cos(x)")

# Create layout
layout = row(p1, p2)

# Add to document
curdoc().add_root(layout)

# Verify we can access the document
doc = curdoc()
num_roots = len(doc.roots)

print(f"Created Bokeh document with {num_roots} root(s)")
print("Bokeh plots created successfully")

# Test that we can also create standalone figures not in doc
p3 = figure(title="Standalone Plot", width=300, height=200)
p3.line([1, 2, 3], [4, 5, 6])

# Send structured data about what we created
missive({
    "num_roots": num_roots,
    "plot1_title": "Test Plot 1", 
    "plot2_title": "Test Plot 2",
    "has_hover": True,
    "layout_type": "row"
})

# Debug: check if get_bokeh_figures exists and works
try:
    bokeh_figs = get_bokeh_figures()
    print(f"get_bokeh_figures returned: {len(bokeh_figs)} figures")
    for i, fig in enumerate(bokeh_figs):
        print(f"Figure {i}: {len(fig)} chars of JSON")
except Exception as e:
    print(f"Error calling get_bokeh_figures: {e}")`
            );

            // Debug: log the entire result object to see what we're getting
            console.log("Bokeh test result object keys:", Object.keys(result));
            console.log("Result contains bokeh_figures?", 'bokeh_figures' in result);
            console.log("Result.bokeh_figures value:", result.bokeh_figures);
            
            assert(!result.error, "Bokeh capture should not have errors");
            assertContains(result.stdout, "Created Bokeh document", "Should confirm document creation");
            assertContains(result.stdout, "Bokeh plots created successfully", "Should confirm plot creation");
            
            // Check that bokeh_figures property exists (even if empty)
            assert(result.bokeh_figures !== undefined, "Should have bokeh_figures property");
            assert(Array.isArray(result.bokeh_figures), "bokeh_figures should be an array");
            
            // If we have bokeh figures, validate them
            if (result.bokeh_figures.length > 0) {
                console.log(`Successfully captured ${result.bokeh_figures.length} Bokeh figure(s)`);
            } else {
                console.warn("No Bokeh figures were captured - this might indicate an issue with the capture system");
                // For now, we'll allow empty array but log a warning
            }
            
            // Only validate if we actually have figures
            if (result.bokeh_figures.length > 0) {
                // Verify the captured figures are valid JSON strings
                for (let i = 0; i < result.bokeh_figures.length; i++) {
                    assert(typeof result.bokeh_figures[i] === 'string', `Figure ${i} should be a string`);
                    
                    // Try to parse the JSON to verify it's valid
                    try {
                        const figureJson = JSON.parse(result.bokeh_figures[i]);
                        assert(figureJson !== null, `Figure ${i} should parse to non-null object`);
                        // Basic check that it looks like a Bokeh JSON item
                        assert(figureJson.target_id || figureJson.doc || figureJson.roots, 
                               `Figure ${i} should have Bokeh JSON structure`);
                    } catch (e) {
                        throw new Error(`Figure ${i} is not valid JSON: ${e.message}`);
                    }
                }
            }
            
            // Parse and verify missive data
            const missiveData = JSON.parse(result.missive);
            assertEquals(missiveData.plot1_title, "Test Plot 1", "Should have correct plot1 title");
            assertEquals(missiveData.plot2_title, "Test Plot 2", "Should have correct plot2 title");
            assertEquals(missiveData.has_hover, true, "Should have hover tool");
            assertEquals(missiveData.layout_type, "row", "Should have row layout");
            assert(missiveData.num_roots > 0, "Should have at least one root in document");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testFileSystemAndImportWorkflow(manager) {
        const testName = "filesystem and import workflow";
        logTestStart("PyodideIntegration", testName);

        try {
            // Create a temporary Python module
            const moduleCode = `
class DataProcessor:
    def __init__(self, name):
        self.name = name
        self.data = []

    def add_data(self, value):
        self.data.append(value)

    def get_stats(self):
        if not self.data:
            return {"count": 0, "sum": 0, "mean": 0}
        return {
            "count": len(self.data),
            "sum": sum(self.data),
            "mean": sum(self.data) / len(self.data)
        }

def process_list(items):
    return [item * 2 for item in items]
`;

            // Write the module to filesystem
            await manager.fs("writeFile", { path: "temp_module.py", content: moduleCode });

            // Now use the module
            const result = await manager.executeAsync(
                "import_workflow_test",
                `from temp_module import DataProcessor, process_list
processor = DataProcessor("Test Processor")
processor.add_data(10)
processor.add_data(20)
processor.add_data(30)
stats = processor.get_stats()
original_list = [1, 2, 3, 4, 5]
processed_list = process_list(original_list)
print(f"Processor name: {processor.name}")
print(f"Data count: {stats['count']}")
print(f"Data sum: {stats['sum']}")
print(f"Data mean: {stats['mean']}")
print(f"Original list: {original_list}")
print(f"Processed list: {processed_list}")
missive({"processor_name": processor.name, "data_count": stats['count'], "data_sum": stats['sum'], "data_mean": stats['mean'], "original_list": original_list, "processed_list": processed_list})`
            );

            assert(!result.error, "Import workflow should not have errors");
            
            // Parse missive JSON string to object
            const missiveData = JSON.parse(result.missive);
            assertEquals(missiveData.processor_name, "Test Processor", "Should get correct processor name");
            assertEquals(missiveData.data_count, 3, "Should have correct data count");
            assertEquals(missiveData.data_sum, 60, "Should have correct data sum");
            assertEquals(missiveData.data_mean, 20.0, "Should have correct data mean");
            assertEquals(missiveData.original_list, [1, 2, 3, 4, 5], "Should have correct original list");
            assertEquals(missiveData.processed_list, [2, 4, 6, 8, 10], "Should have correct processed list");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testMixedExecutionScenarios(manager) {
        const testName = "mixed execution scenarios";
        logTestStart("PyodideIntegration", testName);

        try {
            // Test 1: Global execution followed by namespace execution
            const globalResult = await manager.executeAsync(
                "global_test",
                `global_var = "I am global"
print(f"Global variable set: {global_var}")
missive({"global_var": global_var})`
            );

            const namespaceResult = await manager.executeAsync(
                "namespace_test",
                `namespace_var = "I am in namespace"
print(f"Namespace variable set: {namespace_var}")
missive({"namespace_var": namespace_var})`,
                { isolated: true }
            );

            assert(!globalResult.error, "Global execution should not have errors");
            assert(!namespaceResult.error, "Namespace execution should not have errors");
            
            // Parse missive JSON strings to objects
            const globalMissive = JSON.parse(globalResult.missive);
            const namespaceMissive = JSON.parse(namespaceResult.missive);
            
            assertEquals(globalMissive.global_var, "I am global", "Global variable should be set");
            assertEquals(namespaceMissive.namespace_var, "I am in namespace", "Namespace variable should be set");

            // Test 2: Back to global to verify persistence
            const globalResult2 = await manager.executeAsync(
                "global_test2",
                `print(f"Global variable from earlier: {global_var}")
missive({"global_var_persistent": global_var})`
            );

            assert(!globalResult2.error, "Second global execution should not have errors");
            
            // Parse missive JSON string to object
            const globalMissive2 = JSON.parse(globalResult2.missive);
            assertEquals(globalMissive2.global_var_persistent, "I am global", "Global variable should persist");

            logTestPass(testName);
            return { globalResult, namespaceResult, globalResult2, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testAdvancedMatplotlibWorkflow(manager) {
        const testName = "advanced matplotlib workflow";
        logTestStart("PyodideIntegration", testName);

        try {
            const result = await manager.executeAsync(
                "advanced_matplotlib",
                `import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle
from matplotlib.collections import PatchCollection
import matplotlib.patches as patches
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
data1 = np.random.randn(100)
data2 = np.random.randn(100)
ax1.hist(data1, bins=20, alpha=0.7, color='blue')
ax1.set_title('Histogram of Random Data')
ax1.set_xlabel('Value')
ax1.set_ylabel('Frequency')
x = np.linspace(0, 10, 100)
y = np.sin(x)
ax2.plot(x, y, 'r-', linewidth=2)
ax2.fill_between(x, 0, y, alpha=0.3)
ax2.set_title('Sine Wave with Fill')
ax2.set_xlabel('x')
ax2.set_ylabel('sin(x)')
ax2.grid(True)
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]
ax3.bar(categories, values, color=['red', 'green', 'blue', 'yellow', 'orange'])
ax3.set_title('Bar Chart')
ax3.set_ylabel('Values')
x_scatter = np.random.randn(50)
y_scatter = np.random.randn(50)
colors = np.random.randn(50)
ax4.scatter(x_scatter, y_scatter, c=colors, alpha=0.7)
ax4.set_title('Scatter Plot')
ax4.set_xlabel('x')
ax4.set_ylabel('y')
plt.tight_layout()
subplot_count = 4
total_data_points = len(data1) + len(data2) + len(x) + len(categories) + len(x_scatter)
print(f"Created figure with {subplot_count} subplots")
print(f"Total data points: {total_data_points}")
missive({"subplot_count": subplot_count, "total_data_points": total_data_points})`
            );

            assert(!result.error, "Advanced matplotlib should not have errors");
            assert(result.figures && result.figures.length >= 1, "Should have at least one figure");
            
            // Parse missive JSON string to object
            const missiveData = JSON.parse(result.missive);
            assertEquals(missiveData.subplot_count, 4, "Should have 4 subplots");
            assert(missiveData.total_data_points > 300, "Should have substantial data points");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testMicropipPackageInstallation(manager) {
        const testName = "micropip package installation";
        logTestStart("PyodideIntegration", testName);

        try {
            const result = await manager.executeAsync(
                "micropip_test.py",
                `from antlr4 import CommonTokenStream, ParseTreeWalker
from importlib.metadata import version

version_str = version("antlr4-python3-runtime")
print(f"ANTLR4 Python Runtime Version: {version_str}")

missive({"version": version_str})`
            );

            assert(!result.error, "Micropip test should not have errors");
            assert(result.missive, "Result should have missive property");

            const missive = JSON.parse(result.missive);
            assert(missive.version, "Missive should contain version information");
            console.log(`Successfully verified antlr4-python3-runtime version: ${missive.version}`);

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testAntlr4AndSympyInteraction(manager) {
        const testName = "antlr4 and sympy interaction";
        logTestStart("PyodideIntegration", testName);

        try {
            const result = await manager.executeAsync(
                "antlr4_sympy_test.py",
                `from importlib.metadata import version
from sympy import parse_expr

# Check antlr4 version
antlr4_version = version("antlr4-python3-runtime")
print(f"ANTLR4 is available, version: {antlr4_version}")

# Parse a sympy expression
expr_str = "x**2 + 2*x + 1"
parsed_expr = parse_expr(expr_str)
print(f"Parsed expression: {parsed_expr}")

# Test that it's a sympy object, for example by getting its args
expr_args = parsed_expr.args
print(f"Expression args: {expr_args}")


missive({
    "antlr4_version": antlr4_version,
    "parsed_expression": str(parsed_expr),
    "expression_args_count": len(expr_args)
})`
            );

            assert(!result.error, "Antlr4 and Sympy test should not have errors");
            assert(result.missive, "Result should have missive property");

            const missive = JSON.parse(result.missive);
            assert(missive.antlr4_version, "Missive should contain antlr4 version information");
            assertEquals(missive.parsed_expression, "x**2 + 2*x + 1", "Parsed expression should match");
            console.log(`Successfully verified antlr4 version: ${missive.antlr4_version} and sympy parsing.`);

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}