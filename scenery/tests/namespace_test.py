print(f"custom_var from namespace: {custom_var}")
print(f"custom_name from namespace: {custom_name}")
namespace_result = custom_var * 2
missive(
    {
        "namespace_custom_var": custom_var,
        "namespace_custom_name": custom_name,
        "namespace_result": namespace_result,
    }
)
