# blowfish-shore

`长滩后院` 自定义版 · 基于 [Blowfish](https://github.com/nunocoracao/blowfish) v2.104+，主题上游保持同步追踪。

## 主题 fork 在做什么

- 在 stock Blowfish 基础上叠加中文 typography / 蒸汽波背景 / DotField 雾气 / ASCII noise 诗签。
- 5 个全新 shortcode：`bandcamp` / `music163` / `strava` / `friendlink` / `rss-episode`。
- 主列表/分类视图的 `view: timeline` 变体（站点级 frontmatter 切换）。
- `taxonomy/terms.html` 三视图：`CLOUD`（字号加权）+ `HIERARCHY`（父子层级）+ `DISTRIBUTION`（数量对比上次 build）。
- `params.themeDisplayName` 通用化（替代上游硬编码 `Blowfish` 字面量）。
- 中文调色板 `schemes/shore.css`（扎染蓝 #0900A7 / 电光蓝 #00D4FF / 荧光绿提示）。
- 中文 webfont（Noto Sans SC + Source Han Serif SC + Hack Mono）静态嵌入。

## 不属于这个 fork

- 文章内容 / frontmatter —— 留主仓库。
- 站点身份（avatar / socials / 友链）—— 留主仓库。
- 部署 / CI —— 留主仓库 `.github/workflows/hugo.yml`。

## 与上游同步

```bash
git remote add upstream https://github.com/nunocoracao/blowfish.git
git fetch upstream
git rebase upstream/main
# 解决冲突时关注：
#   layouts/partials/article-link/{card,timeline}.html
#   layouts/partials/extend-head.html
#   layouts/partials/footer.html  (含 themeDisplayName 替换)
#   assets/css/custom.css         (1987 行本地版)
#   layout 0f: i18n/zh.yaml
```

rebase 后跑 `hugo --templateMetrics --minify` 与 `hugo --printPathWarnings` 验证。

## 设计 token 与类命名

`assets/css/custom.css` 是 1987 行主体；BEM 命名空间：

- `entrance-hero__*` 首页 hero 区块
- `entrance-recent*` / `entrance-card-meta*` 列表卡片
- `entrance-podcast__*` 首页播客卡
- `entrance-cat-badge` / `card-associate` 关联与分类小标识
- `article-link--timeline__*` 时间轴列表项
- `terms__chip*` / `terms__group*` / `terms__tree*` / `categories__bar*` / `terms__cloud*` taxonomy 三视图

`assets/css/components/*.css` 拆分了小粒度组件：`breathing-dot`、`terms`、`a11y`、`card`、`tabs`、`gallery`、`admonition`、`carousel`。

**修改前**先看 `docs/CSS_REFACTOR_PLAN.md`（主仓库 `docs/`，写的是拆分路线图）。

## 主题用法

被主仓库以 git submodule 引用：

```
[submodule "themes/blowfish-shore"]
  path = themes/blowfish-shore
  url  = https://github.com/shinonome-shizuka/blowfish-shore.git
```

主仓库 `config.toml` 设 `theme = 'blowfish-shore'` + `params.themeDisplayName = 'Blowfish Shore'`。其他主题可换：直接改 `theme = '...'` 即可。

## 配套文档

| 文件 | 写什么 |
|------|-------|
| 主仓库 `docs/STRUCTURE.md` | 抽取后仓库目录树 |
| 主仓库 `docs/MIGRATION.md` | 抽取步骤日志 |
| 主仓库 `docs/PORTABILITY.md` | "换 theme" 配方 |
| 主仓库 `docs/HUGO_STANDARDS.md` | Hugo v0.158+ 规范对账 |
| 主仓库 `docs/REACT_VS_HUGO.md` | 是否引 React 的评估（结论：不引） |
| 主仓库 `docs/TAGS_SCHEMA.md` | `data/tags.yaml` schema |
| 主仓库 `docs/CONTENT_GUIDE.md` | 作者侧 frontmatter 写作规范 |

## License

继承 Blowfish 上游的 MIT License。贡献者见 `CODE_OF_CONDUCT.md`。
