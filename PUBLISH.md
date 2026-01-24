# 发布指南

本文档说明如何将项目发布到 GitHub Pages（文档）和 NPM（包）。

## 项目结构

```
resin-hooks/
├── docs/              # 文档目录（部署到 GitHub Pages）
├── packages/
│   └── hooks/         # Hooks 包（发布到 NPM）
└── .github/
    └── workflows/     # GitHub Actions 工作流
```

## 一、文档部署到 GitHub Pages

### 自动部署（推荐）

1. **配置 GitHub Pages**
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 设置
   - Source 选择 "GitHub Actions"

2. **推送代码触发部署**
   - 当 `docs/` 目录、`rspress.config.ts` 或相关配置文件有变更时
   - 推送到 `main` 或 `master` 分支
   - GitHub Actions 会自动构建并部署文档

3. **手动触发**
   - 在 GitHub Actions 页面找到 "Deploy Docs to GitHub Pages" 工作流
   - 点击 "Run workflow" 手动触发

### 文档访问地址

部署成功后，文档将发布到：

```
https://codebyresin.github.io/resin-hooks/
```

### 本地测试文档

```bash
# 开发模式
pnpm rspress:dev

# 构建
pnpm rspress:build

# 预览构建结果
pnpm rspress:preview
```

## 二、Hooks 包发布到 NPM

### 准备工作

1. **创建 NPM 账号**
   - 访问 https://www.npmjs.com/ 注册账号

2. **配置 NPM Token**
   - 登录 NPM，进入 Access Tokens：https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - 创建 "Automation" 类型的 token
   - 在 GitHub 仓库设置中添加 Secret：
     - Settings → Secrets and variables → Actions
     - 新建 secret，名称为 `NPM_TOKEN`，值为刚才创建的 token

3. **更新版本号**
   ```bash
   cd packages/hooks
   # 手动编辑 package.json 中的 version，或使用 npm version
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

### 发布方式

#### 方式一：通过 GitHub Release（推荐）

1. **创建 Release**
   - 在 GitHub 仓库页面，点击 "Releases" → "Create a new release"
   - 选择或创建新标签（如 `v1.0.0`）
   - 填写 Release 标题和描述
   - 点击 "Publish release"

2. **自动发布**
   - GitHub Actions 会自动检测到 Release 创建
   - 自动构建并发布到 NPM

#### 方式二：手动触发 GitHub Actions

1. 进入 GitHub Actions 页面
2. 选择 "Publish to NPM" 工作流
3. 点击 "Run workflow"
4. 输入版本号
5. 点击 "Run workflow" 执行

#### 方式三：本地发布（不推荐，仅用于测试）

```bash
# 1. 登录 NPM
npm login

# 2. 构建包
cd packages/hooks
pnpm build

# 3. 发布
pnpm publish --access public
```

### 发布检查清单

- [ ] 更新 `packages/hooks/package.json` 中的版本号
- [ ] 确保 `packages/hooks/README.md` 存在且内容完整
- [ ] 运行 `pnpm build` 确保构建成功
- [ ] 检查 `dist/` 目录包含所有必要文件
- [ ] 检查 `.npmignore` 确保不会发布不必要的文件
- [ ] 提交并推送代码到 GitHub

### 发布后验证

1. **检查 NPM 包**

   ```bash
   npm view @resin-hooks/core
   ```

2. **测试安装**
   ```bash
   npm install @resin-hooks/core@latest
   ```

## 三、工作流说明

### deploy-docs.yml

- **触发条件**：
  - 推送到 `main`/`master` 分支
  - `docs/` 目录或相关配置文件变更
  - 手动触发

- **执行步骤**：
  1. 检出代码
  2. 安装依赖
  3. 构建文档
  4. 部署到 GitHub Pages

### publish-npm.yml

- **触发条件**：
  - 创建 GitHub Release
  - 手动触发

- **执行步骤**：
  1. 检出代码
  2. 安装依赖
  3. 构建包
  4. 运行测试（如果有）
  5. 发布到 NPM

## 四、常见问题

### 1. GitHub Pages 部署失败

- 检查仓库设置中的 Pages 配置
- 确保工作流有正确的权限（`pages: write`）
- 检查构建日志中的错误信息

### 2. NPM 发布失败

- 检查 `NPM_TOKEN` secret 是否正确配置
- 确保版本号已更新且不与已发布版本冲突
- 检查包名 `@resin-hooks/core` 是否可用（需要 npm 组织或已注册的 scope）

### 3. 文档构建失败

- 检查 `rspress.config.ts` 配置是否正确
- 确保所有依赖已安装
- 检查 Markdown 文件语法是否正确

## 五、最佳实践

1. **版本管理**
   - 遵循语义化版本（Semantic Versioning）
   - 重大变更使用 major 版本
   - 新功能使用 minor 版本
   - 修复使用 patch 版本

2. **发布前测试**
   - 本地构建测试
   - 运行所有测试用例
   - 检查类型定义是否正确

3. **文档同步**
   - 发布新版本时同步更新文档
   - 确保文档中的示例代码可用

4. **变更日志**
   - 在 GitHub Release 中记录变更内容
   - 保持清晰的版本历史
