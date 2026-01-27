# Resin Hooks Playground

这是一个用于演示和测试 Resin Hooks 的 React 应用。

## 功能

- 交互式演示各种 Hooks
- 实时查看 Hooks 的行为和效果
- 代码示例和使用说明

## 开发

```bash
# 从根目录运行
pnpm play:dev

# 或者进入 play 目录
cd packages/play
pnpm dev
```

应用将在 http://localhost:3000 启动。

## 构建

```bash
pnpm play:build
```

## 预览构建结果

```bash
pnpm play:preview
```

## 项目结构

```
packages/play/
├── src/
│   ├── demos/          # 各个 Hooks 的演示组件
│   ├── App.tsx        # 主应用组件
│   ├── main.tsx       # 入口文件
│   └── index.css      # 全局样式
├── index.html         # HTML 模板
├── vite.config.ts     # Vite 配置
└── package.json       # 项目配置
```

## 添加新的 Demo

1. 在 `src/demos/` 目录下创建新的 Demo 组件
2. 在 `src/App.tsx` 中导入并添加到 `demos` 数组
3. 确保导入样式文件 `./demo.css`
