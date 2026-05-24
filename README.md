# 🛋️ 家居购置清单 Furniture Wishlist

一个 AI 驱动的家居购置清单应用，拍照上传即可自动识别家具信息。

## ✨ 功能特点

- **📷 拍照识别** — 上传家具图片，AI 自动填充名称、分类、预估价格
- **📝 结构化记录** — 每件家具包含：购买理由、现有替代品、备注
- **💰 预算追踪** — 实时计算待购总额、已购花费、预算余量
- **🏷️ 状态管理** — 待购买 / 高优先级 / 考虑中 / 已购买
- **⭐ 优先级排序** — 三级优先级标注
- **✏️ 随时编辑** — 点击任意条目展开编辑

## 🚀 使用方式

直接在 [Claude.ai](https://claude.ai) 中作为 Artifact 运行，无需安装。

或在本地运行：

```bash
# 需要 React 环境
npm create vite@latest furniture-wishlist -- --template react
cd furniture-wishlist
cp src/App.jsx ./src/App.jsx  # 替换为本项目的 App.jsx
npm install
npm run dev
```

## 📋 使用流程

1. 点击右下角 **+** 按钮
2. 上传家具图片（拍照或从相册选择）
3. 点击 **✨ AI 智能识别**
4. 确认/修改识别结果后加入清单
5. 设置总预算，实时查看余量

## 🛠️ 技术栈

- React (Hooks)
- Anthropic Claude API (claude-sonnet-4-20250514)
- 纯 CSS-in-JS，无外部 UI 库依赖

---

*Built with Claude AI*
