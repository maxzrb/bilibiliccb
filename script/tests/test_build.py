import importlib.util
import pathlib
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("ccb_build", ROOT / "build.py")
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class BuildTests(unittest.TestCase):
    def test_reject_invalid_payload(self):
        for data in [{"深圳": "invalid"}, {"深圳": [None]}, {"深圳": ["evil/<script>"]}, {}]:
            with self.assertRaises(ValueError):
                build.validate_data(["深圳"], data)

    def test_deterministic_and_complete_bundle(self):
        with tempfile.TemporaryDirectory() as temp:
            a, b = pathlib.Path(temp) / "a.js", pathlib.Path(temp) / "b.js"
            build.build(str(a))
            build.build(str(b))
            self.assertEqual(a.read_bytes(), b.read_bytes())
            content = a.read_text(encoding="utf-8")
            self.assertIn("function ccbWorkerRuntime", content)
            self.assertIn("const engine = Core.create", content)
            self.assertIn("const openPanel", content)
            self.assertNotIn("no-cors", content)
            self.assertNotIn("location.reload() }, 2000)", content)

    def test_missing_marker_fails(self):
        with self.assertRaises(ValueError):
            build.replace_block("missing", "CORE", "source")


if __name__ == "__main__":
    unittest.main()
