# 仓库迁移与更名说明

[中文](#中文) | [English](#english)

## 中文

### 变更概要（2026 年 11 月）

本项目仓库已迁移并更名：

| | 旧 | 新 |
| --- | --- | --- |
| 仓库地址 | `github.com/zfg5118/DeepImage2-Video` | `github.com/wiltchang/DeepImage-Video` |
| 账号 | `zfg5118` | `wiltchang` |
| 仓库名 | `DeepImage2-Video` | `DeepImage-Video` |

### 原因

原 GitHub 账号 `zfg5118` 已被 GitHub 暂停，原仓库随之不可访问。项目已整体迁移到新账号 `wiltchang` 下，并将仓库名由 `DeepImage2-Video` 调整为 `DeepImage-Video`。

### 影响

- **旧地址已失效**：GitHub 不会为跨账号迁移提供自动重定向，指向旧仓库的链接、克隆地址和书签将无法打开，请改用新地址。
- **提交历史完整保留**：新仓库包含自 2026-07-27 初始提交以来的全部提交记录。
- **产品本身不变**：产品名称仍为 DeepImage2-Video，在线站点仍为 [https://d.hdgsb.com](https://d.hdgsb.com)，功能与数据不受本次迁移影响。

### 已克隆旧仓库的用户

在本地仓库目录执行一次即可切换到新地址：

```bash
git remote set-url origin git@github.com:wiltchang/DeepImage-Video.git
# 或使用 HTTPS：
# git remote set-url origin https://github.com/wiltchang/DeepImage-Video.git
git pull
```

---

## English

### Summary (November 2026)

This repository has been moved and renamed:

| | Before | After |
| --- | --- | --- |
| Repository | `github.com/zfg5118/DeepImage2-Video` | `github.com/wiltchang/DeepImage-Video` |
| Account | `zfg5118` | `wiltchang` |
| Repo name | `DeepImage2-Video` | `DeepImage-Video` |

### Reason

The previous GitHub account `zfg5118` was suspended by GitHub, which made the original repository inaccessible. The project has been moved in full to the new account `wiltchang`, and the repository name was adjusted from `DeepImage2-Video` to `DeepImage-Video`.

### Impact

- **The old URL is dead**: GitHub does not redirect across accounts, so links, clone URLs and bookmarks pointing to the old repository no longer work. Please use the new address.
- **Full history preserved**: the new repository contains the complete commit history since the initial commit on 2026-07-27.
- **The product is unchanged**: the product name remains DeepImage2-Video, the live site remains [https://d.hdgsb.com](https://d.hdgsb.com), and functionality and data are unaffected by this move.

### If you cloned the old repository

Run this once in your local clone to switch to the new address:

```bash
git remote set-url origin git@github.com:wiltchang/DeepImage-Video.git
# or with HTTPS:
# git remote set-url origin https://github.com/wiltchang/DeepImage-Video.git
git pull
```
