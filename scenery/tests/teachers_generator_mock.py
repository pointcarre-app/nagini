import random

import teachers.maths as tm


class MathsGenerator:
    def __init__(self, seed=None):
        if seed is not None:
            random.seed(seed)

    @staticmethod
    def random_integer(min_val=0, max_val=100):
        n = random.randint(min_val, max_val)
        return tm.Integer(n=n)
