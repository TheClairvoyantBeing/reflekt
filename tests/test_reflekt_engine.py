#!/usr/bin/env python3
"""
Unit Test Suite for Reflekt Journaling Engine, Security Rules, and Data Helpers
"""

import unittest
import json
import re
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent


class TestReflektEngine(unittest.TestCase):

    def test_firestore_rules_security(self):
        rules_path = ROOT_DIR / "firestore.rules"
        self.assertTrue(rules_path.exists(), "firestore.rules must be present in root")

        with open(rules_path, "r", encoding="utf-8") as f:
            rules = f.read()

        # Check version and security primitives
        self.assertIn("rules_version = '2'", rules)
        self.assertIn("request.auth != null", rules)
        self.assertIn("match /entries/{entryId}", rules)
        self.assertIn("resource.data.user_id == request.auth.uid", rules)
        self.assertIn("request.resource.data.user_id == request.auth.uid", rules)
        # Default deny
        self.assertIn("allow read, write: if false;", rules)

    def test_filter_entries_logic(self):
        # Python mirror of filterEntries in src/lib/entries.js
        entries = [
            {"id": "1", "title": "Morning Coffee Thoughts", "content": "Reflecting on daily goals", "tags": ["mindfulness", "routine"]},
            {"id": "2", "title": "Sprint Review", "content": "Delivered features on time", "tags": ["work", "dev"]},
            {"id": "3", "title": "Book Notes", "content": "Deep work and flow states", "tags": ["reading"]}
        ]

        def filter_entries(items, query):
            if not query or not query.strip():
                return items
            term = query.lower().strip()
            return [
                e for e in items
                if term in e.get("title", "").lower()
                or term in e.get("content", "").lower()
                or any(term in t.lower() for t in e.get("tags", []))
            ]

        # Query by title
        res = filter_entries(entries, "coffee")
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0]["id"], "1")

        # Query by content
        res = filter_entries(entries, "flow states")
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0]["id"], "3")

        # Query by tag
        res = filter_entries(entries, "dev")
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0]["id"], "2")

        # Case insensitive
        res = filter_entries(entries, "MINDFULNESS")
        self.assertEqual(len(res), 1)

    def test_license_and_anonymity(self):
        lic_file = ROOT_DIR / "LICENSE"
        self.assertTrue(lic_file.exists(), "LICENSE file must exist")

        with open(lic_file, "r", encoding="utf-8") as f:
            content = f.read()
            self.assertIn("TheClairvoyantBeing", content)
            self.assertNotIn("Evion", content)
            self.assertNotIn("Cutinha", content)

        readme_file = ROOT_DIR / "README.md"
        with open(readme_file, "r", encoding="utf-8") as f:
            readme = f.read()
            self.assertNotIn("Evion", readme)
            self.assertNotIn("Cutinha", readme)

    def test_css_design_tokens(self):
        # Verify styles directory has css files
        styles_dir = ROOT_DIR / "src" / "styles"
        self.assertTrue(styles_dir.exists(), "src/styles directory must exist")
        css_files = list(styles_dir.glob("*.css"))
        self.assertGreater(len(css_files), 0, "Expected CSS files in src/styles")

    def test_package_json(self):
        pkg_path = ROOT_DIR / "package.json"
        self.assertTrue(pkg_path.exists(), "package.json must exist")
        with open(pkg_path, "r", encoding="utf-8") as f:
            pkg = json.load(f)
        self.assertIn("dependencies", pkg)
        self.assertIn("firebase", pkg["dependencies"])
        self.assertIn("react", pkg["dependencies"])


if __name__ == "__main__":
    unittest.main()
