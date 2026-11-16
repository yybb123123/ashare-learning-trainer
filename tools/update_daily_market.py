#!/usr/bin/env python3
"""Fetch daily OHLCV from AKShare; fail closed if sources are unavailable."""
import datetime,json,math,pathlib,sys
import akshare as ak
ROOT=pathlib.Path(__file__).resolve().parents[1]
CONFIG=ROOT/'data'/'daily-symbols.json'
OUTPUT=ROOT/'data'/'daily-market.json'
TODAY=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date()
START=(TODAY-datetime.timedelta(days=460)).strftime('%Y%m%d')
END=TODAY.strftime('%Y%m%d')
def number(value):
 v=float(value)
 if not math.isfinite(v) or v<0:raise ValueError('invalid numeric field')
 return round(v,4)
def rows(frame):
 out=[]
 frame=frame.tail(260)
 for _,r in frame.iterrows():
  d=str(r['日期'])[:10]
  o,h,l,c=map(lambda k:number(r[k]),('开盘','最高','最低','收盘'))
  vol=number(r['成交量'])
  if min(o,h,l,c)<=0 or h<max(o,c) or l>min(o,c):raise ValueError('invalid OHLC '+d)
  out.append(dict(date=d,open=o,high=h,low=l,close=c,volume=vol))
 out.sort(key=lambda x:x['date'])
 if len(out)<50 or len({x['date'] for x in out})!=len(out):raise ValueError('insufficient or duplicate history')
 return out[-250:]
def main():
 cfg=json.loads(CONFIG.read_text(encoding='utf-8'))
 stocks=cfg.get('stocks',[])
 if len(stocks)>4 or any(not isinstance(x,str) or len(x)!=6 or not x.isdigit() or x[0] not in '036' for x in stocks):raise ValueError('stock codes must be up to four A-share symbols')
 items=[]
 for symbol,name in [('sh000001','上证指数'),('sz399001','深证成指')]:
  df=ak.stock_zh_index_daily_em(symbol=symbol)
  if df is None or df.empty:raise ValueError('empty index '+symbol)
  # Index endpoint uses date/open/close/high/low/volume English column labels.
  df=df.rename(columns={'date':'日期','open':'开盘','high':'最高','low':'最低','close':'收盘','volume':'成交量'})
  items.append(dict(symbol=symbol,name=name,kind='index',adjustment='none',source='AKShare stock_zh_index_daily_em / Eastmoney',bars=rows(df)))
 for symbol in stocks:
  df=ak.stock_zh_a_hist(symbol=symbol,period='daily',start_date=START,end_date=END,adjust='qfq')
  if df is None or df.empty:raise ValueError('empty stock '+symbol)
  items.append(dict(symbol=symbol,name=symbol,kind='stock',adjustment='qfq',source='AKShare stock_zh_a_hist / Eastmoney',bars=rows(df)))
 # Avoid writing partial or fabricated results.
 payload=dict(schemaVersion=1,generatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),asOf=max(x['bars'][-1]['date'] for x in items),verificationLevel='structural-only',items=items,notice='第三方数据，结构已校验，未独立核验来源真实性；指数与个股数据口径可能不同。')
 OUTPUT.write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print('Saved',len(items),'symbols, latest dates:',[(x['symbol'],x['bars'][-1]['date']) for x in items])
if __name__=='__main__':
 try:main()
 except Exception as e:sys.exit('Market update failed; existing data unchanged: '+str(e))
