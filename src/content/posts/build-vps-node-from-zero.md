---
title: 从零搭建 VPS 节点
published: 2026-05-11
description: 面向新手的 VPS 初始化思路，记录系统更新、安全配置、防火墙和服务部署的基本流程。
tags: [VPS, Linux, 自建服务, 技术折腾]
category: 技术笔记
draft: false
---

# 从零搭建 VPS 节点

拿到一台新的 VPS 后，不建议直接部署业务。先做基础初始化，后面维护会轻松很多，也能避免一些低级安全问题。

## 1. 登录并更新系统

第一次登录通常使用服务商提供的 root 密码或 SSH Key。

```bash
ssh root@your_server_ip
apt update
apt upgrade -y
```

如果是 Debian 或 Ubuntu，先把系统包更新到最新，再继续配置用户和防火墙。

## 2. 创建普通用户

日常运维尽量不要一直使用 root。

```bash
adduser mizuki
usermod -aG sudo mizuki
```

之后可以把本机公钥放到新用户的 `~/.ssh/authorized_keys` 里，并测试能否正常登录。

## 3. 配置 SSH

确认普通用户可登录后，再考虑关闭密码登录和 root 远程登录。

```bash
nano /etc/ssh/sshd_config
```

常见配置项：

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

修改后重启 SSH 服务：

```bash
systemctl restart ssh
```

重启前最好保留一个已登录窗口，避免配置错误后把自己锁在服务器外。

## 4. 开启防火墙

只放行必要端口。

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
ufw status
```

如果你改了 SSH 端口，记得先放行新端口再启用防火墙。

## 5. 部署服务前的检查清单

- 域名 DNS 是否已经解析到 VPS。
- 服务器时间和时区是否正确。
- 是否需要 Docker 或反向代理。
- 日志、备份和自动续期证书是否安排好。

## 小结

VPS 折腾的重点不是一次性跑起来，而是让它稳定、可恢复、可迁移。先把初始化流程写成笔记，之后每换一台机器都能少踩很多坑。
