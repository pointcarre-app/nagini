#!/usr/bin/env python3
"""Debug script to test the missive system"""

print("=== MISSIVE DEBUG TEST ===")

# First, let's check if the missive function is available
try:
    print("Checking if missive function exists...")
    print(f"missive function: {missive}")
    print(f"get_missive function: {get_missive}")

    # Check initial state
    print(f"Initial current_missive: {current_missive}")
    print(f"Initial missive_already_called: {missive_already_called}")

    # Test calling missive
    print("\nCalling missive with test data...")
    test_data = {"test": "debug_data", "value": 42}
    missive(test_data)

    print(f"After missive call - current_missive: {current_missive}")
    print(f"After missive call - missive_already_called: {missive_already_called}")

    # Test get_missive
    print("\nTesting get_missive...")
    missive_result = get_missive()
    print(f"get_missive() returned: {missive_result}")
    print(f"Type of result: {type(missive_result)}")

    # Check globals one more time
    print(f"\nFinal check - current_missive: {current_missive}")

except Exception as e:
    print(f"Error during debug: {e}")
    import traceback

    traceback.print_exc()

print("=== END DEBUG TEST ===")
