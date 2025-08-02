import subprocess


def on_config(config):
    """
    Injects the latest Git tag into the site name.
    This is called by the mkdocs-simple-hooks plugin during the build process.
    """
    try:
        # Get the latest git tag
        tag = (
            subprocess.check_output(["git", "describe", "--tags", "--abbrev=0"])
            .decode("utf-8")
            .strip()
        )

        # Append the tag to the site name with a custom badge
        config["site_name"] += f' <span class="version-badge">{tag}</span>'
    except Exception as e:
        print(f"Warning: Could not get git tag, using default site name. Error: {e}")

    return config
