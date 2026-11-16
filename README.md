# A 股学习课堂 · GitHub Pages 预览版

面向零基础学习者的简体中文 A 股技术分析教学网页。包含 24 节互动课程：K 线、趋势、均线、成交量、VCP、J Law 公开理念、A 股交易制度与风险管理。

## 已有功能
- 24 课选择题、即时反馈、完成进度、错题、笔记
- 本地自动保存、JSON 进度导入导出
- 真实历史行情 JSON 导入与逐根 K 线回放框架（严格拒绝无来源标记的数据）
- Supabase 邮箱登录与手动云端上传接口（未配置、未完成跨设备恢复测试）

## 尚未完成
- 2015-01-01 至 2026-10-31 全市场沪深京真实历史行情采集、验证和发布
- Supabase 云端同步完整配置、跨设备冲突合并、测试
- DeepSeek AI 教师后端接入
- 历史涨跌停制度、复权和模拟交易撮合的完整验证
- 浏览器端到端验收

**当前为开发预览版，不是投资建议，也不能宣称真实行情已上线。**

## GitHub Pages
Settings → Pages → Deploy from a branch → main → /(root) → Save。

## 云端配置（未来）
1. 创建 Supabase 项目并在 SQL Editor 执行 `schema.sql`。
2. 在 `src/config.js` 填写项目 URL 和 publishable key。不得填写 service_role 或任何 DeepSeek 私密密钥。
3. 需要先验证登录、RLS、跨设备同步与冲突恢复。

## 行情数据
`data/manifest.json` 默认 verified=false 且 datasets 为空。严禁使用随机 K 线冒充历史行情。导入文件必须包含 symbol、adjustment、source.url、source.retrievedAt、verified:true 和按日期升序的 bars（open/high/low/close/volume）。

## 版权与定位
J Law 相关内容仅借鉴其公开讨论的趋势/VCP/多重证据理念，不代表其本人授权、背书或专有策略复刻。仅供教育使用。

## 已准备好的数据工程（2026-11）
- `tools/import_ashare_csv.py`：将有明确来源的 CSV 日线转换为 JSON，拒绝日期乱序、重复日期、非法 OHLC 和少于 20 条的数据。
- `tests/test_import.py`：导入器的离线回归测试（测试夹具为虚构数值，仅用于测试，不进入学习行情）。
- `.github/workflows/check.yml`：提交时运行 Python 单元测试与 JS 语法检查。
- 导入器的 `verificationLevel: structural-only` 表示**仅结构校验**，不能代表数据供应商真实性、复权正确性或全市场覆盖已核验。
- 真实数据仍需获得合法来源、核对许可、交易日历、股票上市退市与停牌记录，再逐批发布。
