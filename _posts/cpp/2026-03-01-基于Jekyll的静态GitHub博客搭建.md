---

title:              "基于Jekyll的静态GitHub博客搭建" 
date:               2026-02-24 11:20:00              
last_modified_at:   2026-02-25 15:30:00           
author:             "rock"                         
toc:                true                           
categories:         [Blog, Jekyll]                  
tags:               [blog]                           

---

<font size=4 color=blue>
“Jekyll is everything that I ever wanted in a blogging engine. Really. It isn’t perfect, but what’s excellent about it is that if there’s something wrong, I know exactly how it works and how to fix it. It runs on the your machine only, and is essentially an added “build” step between you and the browser. I coded this entire site in TextMate using standard HTML5 and CSS3, and then at the end I added just a few little variables to the markup. Presto-chango, my site is built and I am at peace with the world.”
——by Carter Allen
</font>

---

我是Fedora KDE43操作系统:

```bash
             .',;::::;,'.                 username@hostname
         .';:cccccccccccc:;,.             --------
      .;cccccccccccccccccccccc;.          OS: Fedora Linux 43 (KDE Plasma Desktop Edition) x86_64
    .:cccccccccccccccccccccccccc:.        Host: HP ZBook Power 16 inch G11 A Mobile Workstation PC (SBKPFV3)
  .;ccccccccccccc;.:dddl:.;ccccccc;.      Kernel: Linux 6.18.13-200.fc43.x86_64
 .:ccccccccccccc;OWMKOOXMWd;ccccccc:.     Uptime: 10 hours, 42 mins
.:ccccccccccccc;KMMc;cc;xMMc;ccccccc:.    Packages: 3410 (rpm), 16 (flatpak), 9 (snap)
,cccccccccccccc;MMM.;cc;;WW:;cccccccc,    Shell: bash 5.3.0
:cccccccccccccc;MMM.;cccccccccccccccc:    Display (AUOA0A9): 2560x1600 @ 1.5x in 16", 120 Hz [Built-in]
:ccccccc;oxOOOo;MMM000k.;cccccccccccc:    DE: KDE Plasma 6.6.1
cccccc;0MMKxdd:;MMMkddc.;cccccccccccc;    WM: KWin (Wayland)
ccccc;XMO';cccc;MMM.;cccccccccccccccc'    WM Theme: Breeze
ccccc;MMo;ccccc;MMW.;ccccccccccccccc;     Theme: Breeze (Dark) [Qt], Breeze-Dark [GTK2], Breeze [GTK3]
ccccc;0MNc.ccc.xMMd;ccccccccccccccc;      Icons: breeze-dark [Qt], breeze-dark [GTK2/3/4]
cccccc;dNMWXXXWM0:;cccccccccccccc:,       Font: Noto Sans (10pt) [Qt], Noto Sans (10pt) [GTK2/3/4]
cccccccc;.:odl:.;cccccccccccccc:,.        Cursor: breeze (24px)
ccccccccccccccccccccccccccccc:'.          Terminal: konsole 25.12.2
:ccccccccccccccccccccccc:;,..             CPU: AMD Ryzen 7 8845HS (16) @ 5.10 GHz
 ':cccccccccccccccc::;,.                  GPU 1: NVIDIA GeForce RTX 4050 Max-Q / Mobile [Discrete]
                                          GPU 2: AMD Radeon 780M Graphics [Integrated]
                                          Memory: 7.41 GiB / 30.62 GiB (24%)
                                          Swap: 0 B / 8.00 GiB (0%)
                                          Disk (/): 85.79 GiB / 951.27 GiB (9%) - btrfs
                                          Battery (Primary): 98% [AC Connected]
                                          Locale: en_US.UTF-8
```



个人博客搭建指南[Chirpy](https://chirpy.cotes.page/)

---

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

---

# 第二步：项目初始化与本地预览

使用现成的[chirpy-starter](https://github.com/cotes2020/chirpy-starter)的模板创建自己的库, 点击Use this template.
将新仓库命名Repository name为`<username>`.github.io，其中Owner:`<username>`是你的GitHub用户名，如果包含大写字母需要转换为小写， 然后点击Create repository就可以创建仓库Create repository。
比如我的用户名是rockosdev,则仓库名为rockosdev.github.io。
可选择Choose visibility: Public, Add README:On, Add license: MIT License

然后打开该仓库的Actions工作流。 在该仓库， Settings->左侧栏Pages->Build and deployment->选择GitHub Actions, 上面会显示“Your site is live at https://rockosdev.github.io/”， 通过Visit site访问。


点击自己仓库绿色Code--复制仓库路径(以下操作）,复制HTTPS的路径

```bash
克隆仓库
# 在Bash上使用git clone 后面复制刚才的路径
git clone https://github.com/你的用户名/你的用户名.github.io.git
cd 你的用户名.github.io

安装项目依赖
# 根据项目根目录下的 Gemfile 自动安装插件
bundle install

启动本地服务器
# 启动预览模式
bundle exec jekyll serve
```

> 例如我的:(使用GitHub下载大概率会超时: 设置http.sslVerify为 "false"，临时禁用SSL验证)
> ```bash
> $ git config --global http.sslVerify "false"
> $ git clone https://github.com/rockosdev/rockosdev.github.io.git
> $ cd rockosdev.github.io
> ```
>
> 进入rockosdev.github.io(仓库根目录)之后会有很多文件, 在下运行`bundle install`命令以安装依赖项。
> 看到`....looking for funding`就成功了
>
> 然后使用`bundle exec jekyll serve`命令启动本地 Jekyll 服务器, 按住Ctrl使用鼠标点击链接（例如http://127.0.0.1:xxx)访问, 使用Ctrl+c关闭服务
>
> 设置一些基本配置, 如下:
> **`_config.yml` 变量详解**
> | 变量 | 含义 | 示例值 |
> |:--- |:---  |:---   |
> | `url` | 网站的完整域名地址（用于生成绝对链接、RSS、SEO） | `https://rockosdev.github.io` |
> | `avatar` | 个人头像图片的路径或 URL | ` /assets/img/common/avatar.png` |
> | `timezone` | 网站使用的时区，影响文章发布时间显示 | `Asia/Shanghai` |
> | `lang` | 网站的主要语言代码，用于 HTML 语言属性 | `zh-CN` |
> **配置示例**
> ```yaml
> # _config.yml
> # 网站地址（必须填写，RSS/SEO 需要）
> url: https://<username>.github.io
> # 头像路径（相对于网站根目录，或填完整 URL）
> avatar: /assets/img/common/avatar.png
> # 时区 - 中国用户使用 Asia/Shanghai
> timezone: Asia/Shanghai
> # 语言 - 中文站点用 zh-CN，英文用 en
> lang: zh-CN
> ```
>
> 实战:使用编辑器(我使用vim)打开仓库根目录下的_config.yml文件,
> ```bash
> ~/rockosdev.github.io$ vim _config.yml
> ```
> 使用`/url`定位到`url`处,将`https://rockosdev.github.io`添入双引号中。
> 使用`/avatar`定位到`avatar`处, 冒号后面添加` /assets/img/common/avatar.png`(前面有空格）。
> 我只修改了这两处,其他地方再说,然后`:wq`保存退出。
>
>
> 头像需要在相应目录下新建文件,添加图片。
> ```bash
> ~/rockosdev.github.io$ cd assets
> ~/rockosdev.github.io/assets$ ls
> lib
> ~/rockosdev.github.io/assets$ mkdir img
> ~/rockosdev.github.io/assets$ cd img
> ~/rockosdev.github.io/assets/img$ mkdir common
> ~/rockosdev.github.io/assets/img$ cd common
> ~/rockosdev.github.io/assets/img/common$(比如我把Home目录下修改为`avatar.png`的头像图片移到此处）
> ~/rockosdev.github.io/assets/img/common$ mv ~/avatar.png ./
> ~/rockosdev.github.io/assets/img/common$ ls
> avatar.png
> ```
> 当再次启动本地服务器的时候就可以看到改变了

---

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
填写你的的github账户密码`<password>`

会发现GitHub已经不支持密码授权了，我们换一种方式，使用个人令牌访问。按下Ctrl, 点击GitHub链接，

点击右上角头像 → Settings， 左侧最下方 → Developer settings → Personal access tokens → Tokens (classic)

点击 Generate new token (classic)， Note随便写，过期时间(Expiration)可以选择更久，Scopes勾选 repo获得完整仓库权限, 然后点击Generate token

复制令牌（token),注意只出现一次， 可以保存在电脑其他地方，以便再登陆使用。

再次执行自动部署脚本`./deploy.sh`, 只是输出输入账户密码是输入刚才复制的令牌就行了。

打开GitHub, 博客已经更新，浏览器输入‘https://username.github.io`，发现已经可以访问了。

---

# 第四步:文章撰写模板

[jekyll官方](https://jekyllrb.com/docs/structure/)

| 文件/目录 | 描述 |
|:---|:---|
| `_config.yml` | 存储 Jekyll 站点的全局配置数据，是网站的核心配置文件。包含网站标题（`title`）、描述（`description`）、作者信息（`author`）、时区（`timezone`）、分页设置（`paginate`）、插件列表（`plugins`）、主题配置（`theme`）等。修改此文件后通常需要重启本地服务器才能生效。 |
| `_posts` | 存放博客文章的核心目录。文件名**必须**遵循 `YYYY-MM-DD-title.md` 格式，例如 `2026-02-24-hello-world.md`。文件中的日期和标记语言由文件名决定，文章正文使用 Markdown 语法编写，顶部需包含 [YAML Front Matter](https://jekyllrb.com/docs/front-matter/) 配置。Jekyll 会自动根据文件名中的日期排序并生成文章页面。 |
| `_data` | 存放格式化的数据文件，支持 `.yml`、`.yaml`、`.json`、`.csv`、`.tsv` 等格式。Jekyll 会自动加载此目录下的所有文件，可通过 Liquid 标签 `{{ site.data.filename }}` 访问。常用于存储导航菜单、友情链接、技能列表等结构化数据，方便在模板中循环渲染。 |
| `_site` | Jekyll 构建后生成的**静态网站输出目录**，包含所有转换后的 HTML、CSS、JavaScript 文件。该目录由 Jekyll 自动生成，**不应手动修改其中的内容**。在本地开发时可通过 `--destination` 指定其他路径，部署时通常会将此目录内容上传到服务器。必须添加到 `.gitignore` 中避免提交到版本控制。 |
| `_plugins` | 存放自定义 Jekyll 插件的 Ruby 脚本文件（`.rb`），用于扩展 Jekyll 的核心功能。例如自定义标签、过滤器、生成器等。注意：GitHub Pages 默认不支持自定义插件（出于安全考虑），如需使用需在本地构建后上传 `_site` 目录，或使用 GitHub Actions 工作流。 |
| `_tabs` | **Chirpy 主题特有目录**，用于存放顶部导航栏的标签页面。每个 `.md` 文件对应一个导航标签，如 `about.md`（关于）、`archives.md`（归档）、`categories.md`（分类）、`tags.md`（标签）等。文件需包含 `icon` 和 `order` 等 Front Matter 参数控制显示图标和排序。 |
| `assets` | 存放网站静态资源文件，是前端资源的核心目录。Chirpy 主题中通常包含：<br>- `img/`：图片文件，文章配图、封面图、头像等<br>- `css/`：样式表文件（通常由 Sass 编译生成）<br>- `js/`：JavaScript 脚本文件<br>- `fonts/`：自定义字体文件<br>这些文件会被 Jekyll 原封不动地复制到生成的网站中，引用路径以 `/assets/` 开头。 |
| `tools` | **Chirpy 主题提供的工具脚本目录**，包含项目初始化、部署、测试等辅助脚本。常见文件包括：<br>- `init.sh`：项目初始化脚本<br>- `deploy.sh`：一键部署脚本<br>- `run.sh`：本地开发服务器启动脚本<br>- `test.sh`：代码测试脚本<br>简化日常开发运维操作，可直接在终端执行。 |
| `index.html` | 网站首页文件，Jekyll 会对其进行转换处理。Chirpy 主题中通常使用布局（`layout: home`）自动渲染最新文章列表，无需手动编写 HTML。也可使用 `index.md`，只要包含 Front Matter 即可被 Jekyll 处理。 |
| `Gemfile` | Ruby 的依赖管理文件，定义项目所需的 Gem 包及其版本范围。包含 Jekyll 核心版本、主题（如 `jekyll-theme-chirpy`）、插件（如 `jekyll-paginate`、`jekyll-sitemap` 等）。通过运行 `bundle install` 安装所有依赖，确保开发环境与生产环境一致。 |
| `Gemfile.lock` | 锁定依赖版本的文件，由 Bundler 自动生成。记录了当前使用的每个 Gem 包的确切版本号，确保团队成员或部署环境使用完全相同的依赖版本，避免因版本差异导致的兼容性问题。不应手动修改，通过 `bundle update` 更新。 |
| `LICENSE` | 项目开源许可证文件，说明该项目的使用、修改、分发权限。Chirpy 主题通常使用 [MIT License](https://opensource.org/licenses/MIT)，允许自由使用、修改和商业用途，但需保留版权声明。 |
| `README.md` | 项目说明文档，使用 Markdown 编写，是项目的"门面"。通常包含：项目简介、在线演示链接、功能特性、安装步骤、配置说明、目录结构、更新日志、贡献指南、许可证信息等。GitHub 会自动渲染此文件显示在项目主页。 |

```txt
assets/
└── img/
    ├── common/                          # 网站通用图片（非文章相关）
    │   ├── avatar.png                   # 个人头像
    │   ├── favicon.ico                  # 网站图标
    │   ├── logo.png                     # 站点 Logo
    │   ├── banner-home.jpg              # 首页横幅
    │   └── 404-bg.png                   # 404页面背景
    │
    ├── posts/                           # 文章专用图片（核心目录）
    │   ├── cpp/                         # 第一部分：C++部分
    │   │   ├── 2026-02-24-jekyll-setup/
    │   │   │   ├── cover.png            # 文章封面
    │   │   │   ├── step1-install.png    # 步骤截图
    │   │   │   └── step2-config.png
    │   │   ├── 2026-02-25-chirpy-theme/
    │   │   │   ├── cover.png
    │   │   │   ├── preview-desktop.png
    │   │   │   └── preview-mobile.png
    │   │   └── 2026-02-26-giscus-comment/
    │   │       ├── cover.png
    │   │       └── comment-demo.png
    │   │
    │   ├── vim/                        # 第二部分：VIM部分
    │   │   ├── 2026-03-01-git-basics/
    │   │   │   ├── cover.png
    │   │   │   ├── git-flow.png
    │   │   │   └── merge-conflict.png
    │   │   └── 2026-03-05-github-actions/
    │   │       ├── cover.png
    │   │       └── workflow-diagram.png
    │   │
    │   └── linux/                     # 第三部分：Linux部分
    │       ├── 2026-01-15-travel-beijing/
    │       │   ├── cover.png
    │       │   ├── forbidden-city.jpg
    │       │   └── great-wall.jpg
    │       └── 2026-01-20-reading-list/
    │           ├── cover.png
    │           └── book-covers/
    │               ├── book1.jpg
    │               └── book2.jpg
    │
    └── diagrams/                        # 跨文章复用的图表（可选）
        ├── architecture-common.png
        └── flowchart-template.png
```


新文章请放置于 _posts/ 目录，文件需命名为 YYYY-MM-DD-filename.md。

文章中插入图片示例：比如C++文章封面图片([Chirpy主题的CSS类标记语法](https://chirpy.cotes.page/posts/write-a-new-post/)）
```
# 普通样式
![photo-name](assets/img/posts/cpp/2026-02-24-jekyll-setup/cover.png)
# 特别样式（Chirpy主题常用的 CSS 类标记语法：.shadow添加阴影效果，.rounded-1010px 圆角）
![photo-name](assets/img/posts/cpp/2026-02-24-jekyll-setup/cover.png){: .shadow .rounded-10 }
```

```bash
~/rockosdev.github.io/_posts$ vim 2026-02-24-基于Jekyll的静态GitHub博客搭建.md
```

```yaml

---

title:              "基于Jekyll的静态GitHub博客搭建"    # 文章标题（必需）
date:               2026-02-24 11:20:00              # 发布时间（必需）
last_modified_at:   2026-02-25 15:30:00              # 更新时间
author:             "rock"                           # 作者名称
toc:                true                             # 显示文章目录
categories:         [Blog, Jekyll]                   # 文章分类（一级目录， 二级目录， 最多支持二级目录，首字母大写）
tags:               [blog]                           # 文章标签（可多个, 全部小写）
---


正文从这里开始
```

