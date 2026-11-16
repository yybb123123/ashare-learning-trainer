"""Offline structural validation tests. Run: python3 -m unittest discover -s tests -v"""
import csv,importlib.util,json,pathlib,tempfile,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("importer",ROOT/"tools/import_ashare_csv.py")
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Args:
    symbol="600000.SH";source_url="https://example.org/declared-source"
    retrieved_at="2026-11-16";adjustment="none"
class TestImport(unittest.TestCase):
    def setup_files(self,rows):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        a=Args();a.input=str(pathlib.Path(self.tmp.name)/"in.csv");a.output=str(pathlib.Path(self.tmp.name)/"out.json")
        with open(a.input,"w",newline="",encoding="utf-8") as f:
            w=csv.DictWriter(f,fieldnames=["date","open","high","low","close","volume"]);w.writeheader();w.writerows(rows)
        return a
    def rows(self):
        import datetime
        return [{"date":(datetime.date(2015,1,1)+datetime.timedelta(days=i)).isoformat(),
                 "open":10,"high":12,"low":9,"close":11,"volume":1000} for i in range(20)]
    def test_valid(self):
        a=self.setup_files(self.rows());m.convert(a)
        d=json.loads(pathlib.Path(a.output).read_text())
        self.assertEqual(len(d["bars"]),20)
        self.assertEqual(d["verificationLevel"],"structural-only")
    def test_reject_unsorted(self):
        r=self.rows();r[1]["date"]=r[0]["date"]
        with self.assertRaises(ValueError):m.convert(self.setup_files(r))
    def test_reject_invalid_ohlc(self):
        r=self.rows();r[2]["high"]=8
        with self.assertRaises(ValueError):m.convert(self.setup_files(r))
    def test_reject_missing_data(self):
        with self.assertRaises(ValueError):m.convert(self.setup_files(self.rows()[:10]))
if __name__=="__main__":unittest.main()
