"""Setup configuration for PCA Graph Visualization package."""

from setuptools import setup, find_packages

with open("requirements.txt") as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]

setup(
    name="pca-graph-viz",
    version="0.1.0",
    description="Mathematical visualizations with LaTeX annotations for Pyodide/browser",
    author="PCA Nagini Project",
    packages=find_packages(),
    install_requires=requirements,
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Education",
        "Topic :: Scientific/Engineering :: Visualization",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    package_data={
        "pca_graph_viz": [
            "static/*.html",
            "static/*.js",
            "docs/*.md",
            "docs/*.py",
        ]
    },
)
