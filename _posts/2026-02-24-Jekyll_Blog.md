我是Fedora KDE43操作系统:

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260223211254647-490320003.png)

个人博客搭建指南[Chirpy](https://chirpy.cotes.page/)
# 第一步：准备环境 (Fedora)

其他系统按照 [Jekyll 官方文档](https://jekyllrb.com/docs/installation/) 中的说明完成基础环境的安装。同时还需要安装 [Git](https://git-scm.com/)。

Jekyll 是基于 Ruby 语言的，所以我们需要先安装 Ruby 和相关的开发工具。

在 **Konsole** 中执行以下命令安装 Ruby 及其开发环境：

```bash
# 1. 安装系统依赖
sudo dnf install ruby ruby-devel git gcc gcc-c++ make zlib-devel

# 2. 配置环境变量（避免权限问题，将 Gem 安装在用户目录）
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 3. 安装 Jekyll 和 Bundler
gem install bundler jekyll
```

# 第二步：项目初始化与本地预览

使用现成的[chirpy-starter](https://github.com/cotes2020/chirpy-starter)的模板创建自己的库
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224011334358-182141133.png)
将新仓库命名为`<username>`.github.io，其中`<username>`是你的GitHub用户名，如果包含大写字母需要转换为小写。
比如我的用户名是rockosdev,则仓库名为rockosdev.github.io。
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224015114276-1301143251.png)

```bash
克隆仓库
# 建议先在 GitHub 上 Fork 目标仓库，然后克隆你自己的版本
git clone https://github.com/你的用户名/你的用户名.github.io.git
cd 你的用户名.github.io

安装项目依赖
# 根据项目根目录下的 Gemfile 自动安装插件
bundle install

启动本地服务器
# 启动预览模式
bundle exec jekyll serve
```

> 例如我的:(使用GitHub下载大概率会超时: 设置http.sslVerify为 "false")
> ```bash
> $ git config --global http.sslVerify "false"
> $ git clone https://github.com/rockosdev/rockosdev.github.io.git
> $ cd rockosdev.github.io
> ```
>
> 进入rockosdev.github.io(仓库根目录)之后会有很多文件, 在下运行`bundle install`命令以安装依赖项。
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224074906484-1762868793.png)
> 看到`....looking for funding`就成功了
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224075748410-412454045.png)
>
> 然后使用`bundle exec jekyll serve`命令启动本地 Jekyll 服务器, 按住Ctrl使用鼠标点击链接访问, 使用Ctrl+c关闭服务
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224094107237-1481239910.png)
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224080419236-1623300896.png)
> 设置一些基本配置, 如下:
> **`_config.yml` 变量详解**
> | 变量 | 含义 | 示例值 |
> |:---|:---|:---|
> | `url` | 网站的完整域名地址（用于生成绝对链接、RSS、SEO） | `https://rockosdev.github.io` |
> | `avatar` | 个人头像图片的路径或 URL | `/assets/img/avatar.jpg` |
> | `timezone` | 网站使用的时区，影响文章发布时间显示 | `Asia/Shanghai` |
> | `lang` | 网站的主要语言代码，用于 HTML 语言属性 | `zh-CN` |
> **配置示例**
> ```yaml
> # _config.yml
> # 网站地址（必须填写，RSS/SEO 需要）
> url: https://<username>.github.io
> # 头像路径（相对于网站根目录，或填完整 URL）
> avatar: /assets/images/avatar.png
> # 时区 - 中国用户使用 Asia/Shanghai
> timezone: Asia/Shanghai
> # 语言 - 中文站点用 zh-CN，英文用 en
> lang: zh-CN
> ```
> 示例:使用编辑器(我使用vim)打开仓库根目录下的_config.yml文件,
> ```bash
> ~/rockosdev.github.io$ vim _config.yml
> ```
> 使用`/url`定位到`url`处,将`https://rockosdev.github.io`添入双引号中。
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224093727178-1528783947.png)
> 使用`/avatar`定位到`avatar`处, 冒号后面添加` /assets/images/avatar.png`(前面有空格）。
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224093622431-1340409779.png)
> 我只修改了这两处,其他地方再说,然后`:wq`保存退出。
> 头像需要在相应目录下新建文件,添加图片。
> ```bash
> ~/rockosdev.github.io$ cd assets
> ~/rockosdev.github.io/assets$ ls
> lib
> ~/rockosdev.github.io/assets$ mkdir images
> ~/rockosdev.github.io/assets$ cd images
> ~/rockosdev.github.io/assets/images$(比如我把Home目录下修改为`avatar.png`的头像图片移到此处）
> ~/rockosdev.github.io/assets/images$ mv ~/avatar.png ./
> ~/rockosdev.github.io/assets/images$ ls
> avatar.png
> ```
> 当再次启动本地服务器的时候就可以看到改变了
> ![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224094704175-1592333269.png)

# 第三步自动化发布脚本 (deploy.sh)

此时我们只能在电脑本地访问，要想在网上访问，就需要部署到GitHub平台上去， 这样谁都可以就能通过`https://username.github.io`访问你的网站了。
在你的博客根目录下创建一个名为 deploy.sh 的文件，它可以帮你一键完成“添加、提交、推送”三连：
```bash
~/rockosdev.github.io$ vim deploy.sh
```
将以下内容粘贴到deploy.sh里面， 然后`:wq`保存退出

```sh
#!/bin/bash

# 获取提交信息，默认为当前日期时间
msg=${1:-"Update blog $(date +'%Y-%m-%d %H:%M:%S')"}

echo -e "\033[0;32m>> 开始部署到 GitHub...\033[0m"

# 1. 暂存所有更改
git add .

# 2. 提交更改
git commit -m "$msg"

# 3. 推送到远程仓库 (请确认你的主分支名为 master 或 main)
git push origin main

echo -e "\033[0;32m>> 部署完成！GitHub Pages 正在构建中...\033[0m"
```

赋予权限与使用：

```bash
chmod +x deploy.sh
./deploy.sh 
```
填写你的的github用户名`<username>`
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224100951344-1020488216.png)
填写你的的github账户密码`<password>`
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224101124748-1576739512.png)

会发现GitHub已经不支持密码授权了，我们换一种方式，使用个人令牌访问。按下Ctrl, 点击GitHub链接，
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224102123041-478665228.png)
点击右上角头像 → Settings， 左侧最下方 → Developer settings → Personal access tokens → Tokens (classic)
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224102336657-476425420.png)
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224102551188-841185222.png)
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224102701309-1979543874.png)
点击 Generate new token (classic)， Note随便写，过期时间(Expiration)可以选择更久，Scopes勾选 repo获得完整仓库权限, 然后点击Generate token
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224103141890-1949622882.png)
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224104339644-1338865115.png)
复制令牌（token),注意只出现一次， 可以保存在电脑其他地方，以便再登陆使用。
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224104458177-1865639906.png)
再次执行自动部署脚本`./deploy.sh`, 只是输出输入账户密码是输入刚才复制的令牌就行了。
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224105037966-919199536.png)
打开GitHub, 博客已经更新，浏览器输入‘https://username.github.io`，发现已经可以访问了。
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224105253294-1073139326.png)
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260224105652524-1755923924.png)

第四步:文章撰写模板

新文章请放置于 _posts/ 目录，文件需命名为 YYYY-MM-DD-filename.md。

```bash
~/rockosdev.github.io/_posts$ vim 2026-02-24-Jekyll_Blog.md
```

```yaml
---
layout:     post
title:      "基于Jekyll的静态GitHub博客搭建"
date:       2026-02-24 11:20:00
author:     "rock"
toc:        true
tags:
    - Blog

---

正文从这里开始
```
