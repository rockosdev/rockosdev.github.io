---
title:              "《Learn C++》笔记 0.6 安装集成开发环境(IDE)"
date:               2026-03-23 06:38:00
last_modified_at:   2026-03-23 07:39:00
toc:                true
categories:         [C++, Introduction/Getting Started]
tags:               [cpp, introduction getting-started, ide]
---

**集成开发环境**`Integrated Development Environment`（IDE）是一种旨在简化程序开发、构建和调试流程的软件工具。

典型的现代IDE通常包含以下功能：

* 便捷的代码文件加载与保存机制
* 具备编程友好特性的代码编辑器，例如行号显示、语法高亮、集成帮助、名称补全及自动代码格式化
* 基础构建系统：可将程序编译链接为可执行文件并运行。
* 集成调试器：便于定位和修复软件缺陷。
* 插件安装机制：支持扩展IDE功能或添加版本控制等特性。

部分C++ IDE会自动安装配置C++编译器和链接器，另一些则支持接入您自行安装的编译器/链接器。

虽然这些功能可分别实现，但安装IDE后通过统一界面操作显然更为便捷。

现在就来安装吧！

---

# 选择集成开发环境

接下来的问题显然是：“该选哪个？”。许多集成开发环境都是免费的（价格上），如果你想尝试多个，可以同时安装多个。下面我们将推荐几个我们最喜欢的。

若您已有心仪的其他IDE也完全没问题。本教程所展示的概念通常适用于任何优秀的现代IDE。不过不同IDE在功能名称、界面布局、快捷键映射等方面存在差异，您可能需要在所选IDE中稍作探索才能找到对应功能。

> **提示**:
> 为充分利用本网站资源，建议安装配备至少支持C++17编译器的集成开发环境（IDE）。
>
> 若因教育或商业限制只能使用仅支持C++14的编译器，多数课程和示例仍可正常运行。但若遇到使用C++17（或更高版本）特性的课程，而您使用的是旧版语言编译器，则需跳过该课程或将其转换为您的版本——此过程可能存在难度。
>
> 请勿使用低于C++11标准的编译器（该标准通常被视为现代C++的最低规范要求）。
>
> 我们建议安装最新版编译器。若无法使用最新版，以下是支持C++17功能的最低版本要求：
> * GCC/G++ 7
> * Clang++ 8
> * Visual Studio 2017 15.7

---

# Visual Studio（适用于 Windows）

若您在 Windows 10 或 11 设备上进行开发，我们强烈建议下载 [Visual Studio 2022 Community](https://visualstudio.microsoft.com/downloads/) 版本。

运行安装程序后，您将看到选择工作负载的界面。请选择“桌面开发（C++）”选项。若未选择此项，C++ 功能将不可用。

屏幕右侧的默认选项通常无需调整，但请确保勾选“Windows 11 SDK”（若仅提供该版本则选择“Windows 10 SDK”）。Windows 11 SDK应用程序可在Windows 10系统上运行。

![image](/assets/img/posts/cpp/introduction/0006-1.png)

---

# Code::Blocks（适用于Linux或Windows）

若您在Linux系统上进行开发（或在Windows系统开发但希望编写可轻松移植到Linux的程序），我们推荐使用[https://www.codeblocks.org/downloads/binaries/](Code::Blocks)。Code::Blocks是一款免费、开源的跨平台集成开发环境（IDE），可在Linux和Windows系统上运行。

> **对于Windows用户：**
>
> 请确保获取的是捆绑MinGW的Code::Blocks版本（其文件名应以mingw-setup.exe结尾）。该版本将安装MinGW，其中包含GCC C++编译器的Windows移植版本：
>
> ![image](/assets/img/posts/cpp/introduction/0006-2.png)
> Code::Blocks 20.03 随附的 MinGW 版本已过时，仅支持 C++17（比最新 C++ 版本落后一个版本）。若需使用最新 C++ 版本（C++20），请更新 MinGW。操作步骤如下：
>
> 1. 按上述说明安装 Code::Blocks。
> 2. 关闭已运行的 Code::Blocks。
> 3. 打开 Windows 资源管理器（快捷键 Win-E）。
> 4. 导航至 Code::Blocks 安装目录（通常为 C:\Program Files (x86)\CodeBlocks）。
> 5. 将“MinGW”目录重命名为“MinGW.bak”（以防操作失误）。
> 6. 打开浏览器访问 https://winlibs.com/。
> 7. 下载最新版 MinGW-w64。建议选择：Release Versions -> UCRT Runtime -> LATEST -> Win64 -> 无 LLVM/Clang/LLD/LLDB -> Zip 压缩包。
> 8. 将“mingw64”文件夹解压至 Code::Blocks 安装目录。
> 9. 将“mingw64”重命名为“MinGW”。
>
> 确认更新后的编译器正常工作后，可删除旧文件夹（“MinGW.bak”）。


> **对于 Linux 用户**:
>
> 某些 Linux 系统可能缺少运行或编译 Code::Blocks 程序所需的依赖项。
>
> 基于 Debian 的 Linux 用户（如 Mint 或 Ubuntu 用户）可能需要安装 build-essential 软件包。在终端命令行中输入：sudo apt-get install build-essential。
>
> Arch Linux用户可能需要安装base-devel软件包。
>
> 其他Linux发行版的用户需自行确定对应的包管理器及所需软件包。

首次启动 Code::Blocks 时，可能会出现编译器自动检测对话框。若出现此情况，请确保将 GNU GCC 编译器设为默认编译器，然后点击确定按钮。

![image](/assets/img/posts/cpp/introduction/0006-3.png)


>**问：如果遇到“无法在配置的搜索路径中找到 GNU GCC 编译器的可执行文件”错误该怎么办？**
>
> 请尝试以下方法：
>
> 1. 若使用 Windows 系统，请确保下载的是带 MinGW 的 Code::Blocks 版本（即名称中含“mingw”的版本）。
> 2. 尝试进入设置→编译器，选择“重置为默认值”。
> 3. 尝试进入设置→编译器→工具链可执行文件选项卡，确保“编译器安装目录”指向MinGW目录（例如C:\Program Files (x86)\CodeBlocks\MinGW）。
> 4. 尝试完全卸载后重新安装。
> 5. 尝试使用[其他编译器](https://wiki.codeblocks.org/index.php/Installing_a_supported_compiler)。

---

# Visual Studio Code（适用于有经验的 Linux、macOS 或 Windows 用户）

Visual Studio Code（也称为“VS Code”，请勿与同名软件“Visual Studio Community”混淆）是一款广受资深开发者青睐的代码编辑器。它运行迅捷、灵活多变、开源免费，支持多种编程语言，并兼容众多不同平台。

其缺点在于相较于本指南中其他选项，VS Code 的正确配置难度更高（在 Windows 系统上安装也更为复杂）。建议在继续操作前，仔细阅读下方链接的安装与配置文档，确保您充分理解并能熟练完成相关步骤。

> **警告**:
>
> 本教程系列未提供完整的 VS Code 使用指南。
>
> Visual Studio Code 并非 C++ 初学者的理想选择，读者反馈在安装和配置 Visual Studio Code 用于 C++ 时遇到了诸多不同难题。
>
> 除非您已熟悉 Visual Studio Code 的操作，或具备调试配置问题的经验，否则请勿选择此方案。
>
> 本站无法提供 Visual Studio Code 的安装或配置支持。

向用户glibg10b致敬，感谢其为多篇文章提供了VS Code操作指南的初稿。

> **对于 Linux 用户**:
> 应通过您所用发行版的软件包管理器下载 VS Code。[VS Code 的 Linux 安装指南](https://code.visualstudio.com/docs/setup/linux)涵盖了不同 Linux 发行版的具体操作步骤。
>
> 安装完成后，请按照[指南配置Linux 环境下的 C++ 开发](https://i.cnblogs.com/articles/edit;postId=19572599) 。


> **对于Mac用户**：
> [VS Code的Mac版安装指南](https://code.visualstudio.com/docs/setup/mac)详细说明了如何在macOS系统上安装和配置VS Code。
>
> 安装完成后，请按照指南中的说明[配置Mac版C++环境](https://code.visualstudio.com/docs/cpp/config-clang-mac)。


> **对于Windows 用户**
> [Windows 版 VS Code 的安装指南](https://code.visualstudio.com/docs/setup/windows)详细说明了如何在 Windows 系统上安装并配置 VS Code。
>
> 安装完成后，请按照指南说明[配置 Windows 版 C++ 环境](https://code.visualstudio.com/docs/cpp/config-mingw)。

---

# 其他 macOS 集成开发环境

其他流行的 Mac 选择包括 [Xcode](https://developer.apple.com/xcode/)（若您能使用）和 Eclipse 代码编辑器。[Eclipse](https://www.eclipse.org/) 默认未配置为使用 C++，您需要安装可选的 C++ 组件。

---

# 其他编译器或平台
> **问：能否使用基于网页的编译器？**
>
> 答：某些情况下可以。当您的集成开发环境（IDE）正在下载时（或您尚未决定是否安装IDE），可继续使用基于网页的编译器进行本教程学习。我们推荐以下选项之一：
> * [TutorialsPoint](https://www.tutorialspoint.com/compilers/online-cpp-compiler.htm)
> * [Wandbox](https://wandbox.org/)（可选择不同版本的GCC或Clang）
> * [Godbolt](https://godbolt.org/)（可查看汇编代码）
>
> 基于网页的编译器适用于入门尝试和简单练习。但它们的功能通常相当有限——许多不支持创建多个文件或有效调试程序，且大多不支持交互式输入。当条件允许时，建议迁移至完整的集成开发环境（IDE）。

> **问：我能使用命令行编译器吗（例如Linux上的g++）？**
答：可以，但我们不建议初学者使用。您需要自行寻找编辑器并另行查阅使用方法。学习使用命令行调试器远比集成调试器困难，这会增加程序调试的难度。

> **问：我能使用其他代码编辑器或集成开发环境（IDE）吗？比如Eclipse、Sublime或Notepad++？**
>
> 答：可以，但我们不建议初学者使用。市面上有许多优秀的代码编辑器和IDE，它们支持多种编程语言，并允许通过组合插件来定制开发体验。然而，这些编辑器和IDE往往需要额外配置才能编译C++程序，且过程中可能出现诸多问题。对于初学者，我们建议选择开箱即用的工具，这样您就能把更多时间用于学习编程，而非耗费精力排查代码编辑器与编译器或调试器之间的兼容问题。

---

# 应避免使用的IDE

您应完全避免使用以下IDE，因为它们至少不支持C++11、完全不支持C++，或已不再获得积极支持与维护：

* Borland Turbo C++ —— 不支持C++11
* Visual Studio for Mac —— 不支持C++（注：此产品与VS Code不同）
* Dev C++ -- 未获积极支持

既然存在支持现代C++的轻量级免费替代方案，使用过时或无支持的编译器毫无必要。

---

# 当事情出错时（又名当IDE变成“我甚至不想……”）

IDE的安装似乎总会带来不少麻烦。安装可能直接失败（或安装成功但因配置问题导致使用时出错）。若遇到此类问题，请尝试卸载IDE（前提是它确实安装过），重启计算机，暂时禁用杀毒软件或恶意软件防护程序，然后重新安装。

若此时仍存在问题，您有两种选择：更简单的方案是尝试其他IDE；另一种方案是修复问题。遗憾的是，安装和配置错误的原因多种多样且与IDE软件本身密切相关，我们无法有效指导如何解决此类问题。此时建议将错误信息或具体问题复制到常用搜索引擎（如谷歌或DuckDuckGo），尝试查找其他论坛中遭遇相同问题的用户帖子。通常这些帖子会提供可尝试的解决方案。

---

# 继续前进

一旦您的集成开发环境（IDE）安装完毕（如果过程不如预期顺利，这可能是最困难的步骤之一），或者您暂时使用基于网页的编译器，您就可以开始编写第一个程序了！

