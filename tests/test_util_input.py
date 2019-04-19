import unittest

from datetime import datetime, timedelta

from aetherya.util.input import parse_duration


class TestRuleMatcher(unittest.TestCase):
    def test_basic_durations(self):
        dt = parse_duration('1w2d3h4m5s')
        self.assertTrue(dt < (datetime.utcnow() + timedelta(days=10)))
        self.assertTrue(dt > (datetime.utcnow() + timedelta(days=7)))

    def test_source_durations(self):
        origin = datetime.utcnow() + timedelta(days=17)
        dt = parse_duration('1w2d3h4m5s', source=origin)
        compare = (origin - datetime.utcnow()) + datetime.utcnow()
        self.assertTrue(dt < (compare + timedelta(days=10)))
        self.assertTrue(dt > (compare + timedelta(days=7)))

    def test_invalid_duration(self):
        self.assertEquals(parse_duration('mmmmm', safe=True), None)
