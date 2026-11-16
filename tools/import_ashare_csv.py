#!/usr/bin/env python3
"""Convert verified daily A-share CSV to the trainer JSON schema.

Usage:
 python3 tools/import_ashare_csv.py --input prices.csv --output data/600000.SH.json \
   --symbol 600000.SH --source-url https://provider.example/data \
   --retrieved-at 2026-11-16 --adjustment none

Input columns: date,open,high,low,close,volume (UTF-8 CSV).
No synthetic prices, no interpolation, no claims of official verification.
"""
import argparse,csv,json,math,pathlib,datetime,sys
START=datetime.date(2015,1,1)
END=datetime.date(2026,10,31)
def positive(v,name):
    try: n=float(v)
    except (ValueError,TypeError): raise ValueError(f"invalid {name}: {v}")
    if not math.isfinite(n) or n<0: raise ValueError(f"invalid {name}: {v}")
    return n
def convert(args):
    if args.adjustment not in ("none","qfq","hfq"): raise ValueError("invalid adjustment")
    if not args.source_url.startswith("https://"): raise ValueError("source URL must be HTTPS")
    datetime.date.fromisoformat(args.retrieved_at)
    rows=[];last=None
    with open(args.input,encoding="utf-8-sig",newline="") as f:
        for row in csv.DictReader(f):
            d=datetime.date.fromisoformat(row["date"])
            if d<START or d>END: continue
            if last is not None and d<=last: raise ValueError(f"duplicate/unsorted date: {d}")
            last=d
            b={"date":d.isoformat()}
            for k in ("open","high","low","close","volume"):b[k]=positive(row[k],k)
            if b["low"]<=0 or b["high"]<max(b["open"],b["close"]) or b["low"]>min(b["open"],b["close"]):raise ValueError(f"OHLC error {d}")
            rows.append(b)
    if len(rows)<20:raise ValueError("less than 20 valid bars in requested period")
    # verified indicates only structural checks passed; it is NOT provider authenticity.
    out={"schemaVersion":1,"symbol":args.symbol,"adjustment":args.adjustment,
         "verified":True,"verificationLevel":"structural-only",
         "source":{"url":args.source_url,"retrievedAt":args.retrieved_at,
                   "note":"Source declared by importer; provider authenticity not independently verified"},
         "bars":rows}
    target=pathlib.Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(out,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    print(f"Wrote {len(rows)} rows to {target} (structure checked; source unverified)")
def main():
    p=argparse.ArgumentParser(description=__doc__)
    for name in ("input","output","symbol","source-url","retrieved-at"):p.add_argument("--"+name,required=True)
    p.add_argument("--adjustment",choices=("none","qfq","hfq"),default="none")
    try:convert(p.parse_args())
    except (ValueError,KeyError,OSError) as e:sys.exit(f"Import rejected: {e}")
if __name__=="__main__":main()
