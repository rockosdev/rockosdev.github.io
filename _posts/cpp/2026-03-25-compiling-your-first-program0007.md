---
title:              "《Learn C++》笔记 0.7 编译你的第一个程序"
date:               2026-03-25 06:38:00
last_modified_at:   2026-04-07 09:21:21
toc:                true
categories:         [C++, Introduction/Getting Started]
tags:               [cpp, introduction getting-started, compiling-your-first-program]
---

在编写第一个程序之前，我们需要学习如何在集成开发环境（IDE）中创建新程序。本节课将讲解具体操作方法，你还将编译并运行自己的首个程序！

---

# 项目

要在集成开发环境（IDE）中编写C++程序，我们通常从创建新项目开始（稍后将演示具体操作）。**项目**`project`是一个容器，用于存放生成可执行文件（或库文件、网站等）所需的所有源代码文件、图像、数据文件等资源，这些资源可供运行或使用。项目还会保存各种IDE、编译器和链接器的设置，并记录您的工作进度，以便后续重新打开项目时，能将IDE状态恢复至上次中断处。当您选择编译程序时，项目中的所有.cpp文件都会被编译和链接。

每个项目对应一个程序。若需创建第二个程序，您可新建项目，或覆盖现有项目中的代码（若不需保留原项目）。项目文件通常与IDE绑定，因此在不同IDE中创建的项目需分别新建。

> **最佳实践**:
为每个新编写的程序创建一个新项目。

---

# 控制台项目

创建新项目时，系统通常会询问您要创建何种类型的项目。本教程中创建的所有项目均为**控制台项目**`console project`。控制台项目意味着我们将开发可在Windows、Linux或Mac控制台运行的程序。

以下是Windows控制台的截图：

![image](/assets/img/posts/cpp/introduction/0007-1.png)

默认情况下，控制台应用程序没有图形用户界面（GUI），它们将文本输出到控制台，从键盘读取输入，并编译成独立的可执行文件。这对于学习C++再合适不过了，因为它将复杂性降到最低，并确保程序能在各种系统上运行。

即使您从未接触过控制台或不知如何调用，也无需担忧。我们将通过集成开发环境（IDE）编译并运行程序（必要时IDE会自动调用控制台）。

---

# 工作区/解决方案

当您为程序创建新项目时，许多集成开发环境（IDE）会自动将项目添加到“工作区`workspace`”或“解决方案`solution`”中（具体名称因IDE而异）。工作区或解决方案作为容器，可容纳一个或多个相关项目。例如，若您在开发游戏时希望为单人模式和多人模式分别生成独立可执行文件，则需创建两个项目。这两个项目完全独立并不合理——毕竟它们属于同一款游戏。通常情况下，每个项目都会配置为单一工作区/解决方案中的独立项目。

虽然可以将多个项目添加到单个解决方案中，但我们通常建议为每个程序创建新的工作区或解决方案，尤其是在学习阶段。这样操作更简单，出错的可能性也更小。

---

# 编写你的第一个程序

传统上，程序员在新语言中编写的第一个程序就是臭名昭著的[“Hello World”程序](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program)，而我们不会剥夺你体验这个过程的机会！你以后会感谢我们的。也许吧。

---

# 在 Visual Studio 2019（或更高版本）中创建项目

运行 Visual Studio 2019（或更高版本）时，您将看到如下所示的对话框：

![image](/assets/img/posts/cpp/introduction/0007-2.png)

选择“创建新项目”。

随后您将看到如下所示的对话框：

![image](/assets/img/posts/cpp/introduction/0007-3.png)

若您已打开先前项目，可通过文件菜单 > 新建 > 项目访问此对话框。

选择 Windows 桌面向导并单击下一步。若未显示此选项，则可能是安装 Visual Studio 时未选择安装 C++ 桌面开发工作负载。此时请返回[第0.6课——安装集成开发环境（IDE）]({% link _posts/cpp/2026-03-23-installing-an-integrated-development-environment-ide0006.md %})，按说明重新安装Visual Studio（注：无需完全重装，可运行Visual Studio安装程序修改现有安装配置以添加C++工作负载）。

接下来您将看到如下对话框：

![image](/assets/img/posts/cpp/introduction/0007-4.png)

将现有项目名称替换为HelloWorld。

建议同时勾选“将解决方案和项目放置在同一目录”选项，这可减少每个项目创建时生成的子目录数量。

点击创建继续。

最后，您将看到最后一个对话框：

![image](/assets/img/posts/cpp/introduction/0007-5.png)

请确保应用程序类型设置为控制台应用程序 (.exe)，且预编译头选项处于未选中状态。然后单击确定。

您已成功创建项目！请跳转至下方的 Visual Studio 解决方案资源管理器部分继续操作。

> **问：什么是预编译头文件？为什么我们要将其关闭？**
>
> 在大型项目（包含大量代码文件的项目）中，预编译头文件能通过避免冗余编译来提升编译速度——这类冗余编译在大型项目中尤为常见。
>
> 然而，使用预编译头文件需要额外工作量，对于小型项目（如教程中创建的项目），其对编译时间几乎没有影响。
>
> 因此我们建议初始阶段关闭预编译头文件，仅在后续发现编译效率明显下降时再考虑启用。

---

# 在 Visual Studio 2017 或更早版本中创建项目

要在 Visual Studio 2017 或更早版本中创建新项目，请转到“文件”菜单 > “新建” > “项目”。此时将弹出类似下图所示的对话框：

![image](/assets/img/posts/cpp/introduction/0007-6.png)

首先，请确保左侧列出了Visual C++。若未显示Visual C++，则可能是安装Visual Studio时未选择安装“桌面开发与C++工作负载”。此时请返回[第0.6课——安装集成开发环境（IDE）]({% link _posts/cpp/2026-03-23-installing-an-integrated-development-environment-ide0006.md %})，并按说明重新安装Visual Studio（注：无需完全重装，可运行Visual Studio安装程序修改现有安装以添加C++工作负载）。

若使用 Visual Studio 2017 v15.3 或更新版本，请在 Visual C++ 下选择 Windows Desktop，然后在主窗口中选择 Windows Desktop Wizard。

若未看到 Windows Desktop 选项，则可能使用的是旧版 Visual Studio。此时请选择 Win32，然后在主窗口中选择 Win32 Console Application。

在下方名称字段中输入程序名称（将现有名称替换为HelloWorld）。位置字段可选填项目存放路径，当前保留默认值即可。

点击确定。若使用旧版Visual Studio，Win32应用程序向导将启动，请点击下一步。

此时应出现类似下图的向导对话框（旧版Visual Studio界面样式不同，但选项基本一致）：

![image](/assets/img/posts/cpp/introduction/0007-7.png)

请确保取消勾选“预编译头文件”。

然后点击“确定”或“完成”。现在您的项目已创建完成！

---

# Visual Studio 解决方案资源管理器

在窗口的左侧或右侧，您会看到一个名为“解决方案资源管理器”的窗口。在此窗口中，Visual Studio 已为您创建了一个解决方案（解决方案“HelloWorld”）。其中以粗体显示的名称即为您的新项目（HelloWorld）。在该项目内，Visual Studio 已为您创建了多个文件，包括位于“源文件”树节点下的 HelloWorld.cpp。您可能还会看到其他 .cpp 或 .h 文件，目前可以忽略它们。

![image](/assets/img/posts/cpp/introduction/0007-8.png)

在文本编辑器中，您会发现Visual Studio已自动打开HelloWorld.cpp文件并为您生成部分代码。请选中并删除所有代码，然后将以下内容输入/粘贴至您的集成开发环境：

```cpp
#include <iostream>

int main()
{
	std::cout << "Hello, world!";
	return 0;
}
```

要编译您的程序，请按 F7（若无效，请尝试 Ctrl-Shift-B），或转到“构建”菜单 > “构建解决方案”。若一切顺利，您将在“输出”窗口中看到以下内容：

```txt
1>------ Build started: Project: HelloWorld, Configuration: Debug Win32 ------
1>HelloWorld.cpp
1>HelloWorld.vcxproj -> c:\users\alex\documents\visual studio 2017\Projects\HelloWorld\Debug\HelloWorld.exe
========== Build: 1 succeeded, 0 failed, 0 up-to-date, 0 skipped ==========
```

这意味着您的编译成功了！

> **问：我遇到错误 C1010（“致命错误 C1010：在查找预编译头文件时遇到意外文件结尾。是否忘记在源文件中添加‘#include ”stdafx.h“'？”）。现在该怎么办？**
您创建项目时忘记关闭预编译头功能。请按照上述说明重新创建项目，并确保禁用预编译头功能。

要运行编译后的程序，请按 Ctrl-F5，或转到“调试”菜单并选择“不调试开始”。您将看到类似以下内容：

![image](/assets/img/posts/cpp/introduction/0007-9.png)

这就是你程序的运行结果！恭喜你，你已经成功编译并运行了人生中的第一个程序！

> **相关内容**:
> 当您直接从 Visual Studio 运行程序时，可能会看到类似以下内容的额外输出行：
> ```txt
> C:\Users\Alex\source\repos\Project6\Debug\Project6.exe (process 21896) exited with code 0.
> ```
> 这是正常现象。Visual Studio 正在提供有关程序是否正常退出或异常退出的额外信息。我们将在第 2.2 课——函数返回值（返回值函数）中进一步讨论此内容。

---

# 在Code::Blocks中创建项目

要创建新项目，请依次点击文件菜单 > 新建 > 项目。此时将弹出如下所示的对话框：

![image](/assets/img/posts/cpp/introduction/0007-1.png)

选择控制台应用程序，然后按下“开始”（或“创建”）按钮。

若出现控制台应用程序向导对话框，请按下“下一步”，确保已选中C++，再按下“下一步”。

现在系统将要求您为项目命名。请将项目命名为HelloWorld。您可以将其保存至任意位置。在Windows系统中，建议将其保存在C盘的子目录下，例如C:\CBProjects。

![image](/assets/img/posts/cpp/introduction/0007-10.png)

您可能会看到另一个对话框，询问您希望启用哪些配置。默认设置在此处即可，请选择“完成”。

现在您的新项目已创建完成。

在屏幕左侧，您应能看到一个管理窗口，当前选中“项目”选项卡。该窗口内会显示一个工作区文件夹，其中包含您的HelloWorld项目：

![image](/assets/img/posts/cpp/introduction/0007-11.png)

在HelloWorld项目中，展开Sources文件夹，双击“main.cpp”。你会发现一个Hello World程序已经为你写好了！

将其替换为以下内容：

```cpp
#include <iostream>

int main()
{
	std::cout << "Hello, world!";
	return 0;
}
```

要构建您的项目，请按 Ctrl-F9，或转到“构建”菜单 > “构建”。如果一切顺利，您将在构建日志窗口中看到以下内容：

```txt
-------------- Build: Debug in HelloWorld (compiler: GNU GCC Compiler)---------------
mingw32-g++.exe -Wall -fexceptions -g -std=c++14  -c C:\CBProjects\HelloWorld\main.cpp -o obj\Debug\main.o
mingw32-g++.exe  -o bin\Debug\HelloWorld.exe obj\Debug\main.o
Output file is bin\Debug\HelloWorld.exe with size 1.51 MB
Process terminated with status 0 (0 minute(s), 0 second(s))
0 error(s), 0 warning(s) (0 minute(s), 0 second(s))
```

这意味着您的编译成功了！

要运行编译后的程序，请按 Ctrl-F10 键，或前往“构建”菜单 > “运行”。您将看到类似以下内容：

![image](/assets/img/posts/cpp/introduction/0007-12.png)

这就是你程序的结果！

> **Linux用户请注意**:
在编译Code::Blocks之前，Linux用户可能需要安装额外的软件包。更多信息请参阅[第0.6课——安装集成开发环境（IDE） 中的Code::Blocks安装](https://www.cnblogs.com/learncpp/articles/19572599)说明。

---

# 在 VS Code 中创建项目

要开始新项目，请转到“视图”>“资源管理器”菜单（或按 Ctrl-Shift-E）。这将打开资源管理器窗格。若之前未打开过项目，您应在资源管理器窗格中看到“打开文件夹”按钮——点击它。若已有打开的项目且需新建项目，请从顶部导航栏选择“文件”>“打开文件夹”。

在弹出的对话框中创建名为 HelloWorld 的新文件夹，然后选中该文件夹。此文件夹将成为您的项目根目录。

接下来需创建存放源代码的文件。通过顶部导航栏选择“文件 > 新建文件”，或点击资源管理器窗格中 HELLOWORLD 右侧的“新建文件”图标。

将文件命名为 main.cpp，并添加以下内容：

```cpp
#include <iostream>

int main()
{
	std::cout << "Hello, world!";
	return 0;
}
```

要编译 main.cpp 并运行程序，请确保主窗格中已打开 main.cpp，然后从顶部导航栏选择「运行 > 不带调试运行」，或点击 main.cpp 标签页右侧播放图标旁的 v 键，选择「运行 C/C++ 文件」。

接着选择 g++ 构建并调试活动文件选项（macOS 用户应选择 clang++ 替代 g++）。在窗口底部将标签页从“调试控制台”切换至“终端”。

若终端显示文本“Hello, world!”，恭喜你成功运行了首个 C++ 程序！

---

# 若您在命令行中使用 g++

此时无需创建项目。只需将以下内容粘贴到名为 HelloWorld.cpp 的文本文件中并保存：

```cpp
#include <iostream>

int main()
{
	std::cout << "Hello, world!";
	return 0;
}
```

在命令行中输入：

`g++ -o HelloWorld HelloWorld.cpp`

这将编译并链接 HelloWorld.cpp 文件。要运行它，请输入：

`HelloWorld`（或 `./HelloWorld`），您将看到程序的输出结果。

(我这里使用的是clang++和vim作为开发工具， 安装和配置见[vim+cpp/c](https://www.cnblogs.com/learncpp/articles/19486859)， 后续也是使用这个对整个教程进行运行的。）
![image](/assets/img/posts/cpp/introduction/0007-13.png)

---

# 若您使用其他集成开发环境（IDE）或基于网页的编译器

您需要自行完成以下操作：

1. 创建控制台项目（仅限IDE）
2. 向项目添加.cpp文件（仅限IDE，若未自动生成）
3. 将以下代码粘贴至该文件：

```cpp
#include <iostream>

int main()
{
	std::cout << "Hello, world!";
	return 0;
}
```

4. 编译项目
5. 运行项目

---

# 如果编译失败

别担心，深呼吸。我们很可能能解决这个问题。:)

首先，查看编译器给出的错误信息。通常错误信息会包含行号，标明出错位置。仔细检查该行及前后几行代码，确保没有拼写错误或输入失误。同时确认代码中未包含行号（行号应由编辑器自动生成）。

其次，查阅第0.8课的常见问题解答——几个常见的C++问题，你的问题可能已在其中得到解答。

第三，阅读包含你正在编译的示例代码的课程下方评论——可能有人遇到过相同问题并提供了解决方案。

最后，如果以上方法均无效，请尝试在常用搜索引擎中搜索你的错误信息。很可能已有其他人遇到过此问题并找到了解决方法。

---

# 如果程序运行但控制台窗口闪现后立即关闭

运行控制台程序时，控制台窗口将打开，程序的任何输出都会写入该窗口。

程序运行完毕后，大多数现代集成开发环境（IDE）会保持控制台窗口打开（直到按下任意键），以便您检查程序结果后再继续操作。然而某些旧版IDE会在程序结束时自动关闭控制台窗口，这通常不符合预期。

若您的IDE会自动关闭控制台窗口，可通过以下两步确保程序结束时控制台暂停：

首先，在程序开头添加或确认存在以下代码行：

```cpp
#include <iostream>
#include <limits>
```

其次，在 main() 函数末尾（紧接在 return 语句之前）添加以下代码：

```cpp
std::cin.clear(); // reset any error flags
std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // ignore any characters in the input buffer until we find a newline
std::cin.get(); // get one more char from the user (waits for user to press enter)
```

这将使程序等待用户按下回车键后才继续执行（可能需要按两次回车），从而在IDE关闭控制台窗口前，为您留出检查程序输出的时间。

其他解决方案（如常被推荐的system(“pause”)方法）可能仅在特定操作系统上有效，应避免使用。

若控制台窗口完全未开启且程序看似未运行，可能是杀毒软件或恶意软件防护程序阻断了程序执行。此时请尝试暂时禁用扫描程序观察问题是否解决，或将项目目录添加至扫描排除列表。

> **提示**：
若您正在使用防病毒或反恶意软件程序，建议将项目目录从扫描范围中排除，因为编译和调试过程可能导致误报。

---

# 我的IDE中编译、构建、重新构建、清理和运行/启动选项有何区别？

在[第0.5课——编译器、链接器和库介绍]({% link _posts/cpp/2026-03-21-introduction-to-the-compiler-linker-and-libraries0005.md %})中，我们展示了生成可执行文件的过程：程序中的每个代码文件先被编译成目标文件，然后将目标文件链接成可执行文件。

当代码文件被编译时，IDE 可能会将生成的目标文件缓存（保存）到磁盘。缓存（发音类似“cash”）是存储频繁访问数据的位置，以便后续快速检索。这样，当程序未来再次编译时，未修改的代码文件无需重新编译——可直接复用上次缓存的对象文件（而非重新生成）。这能显著缩短编译时间（代价是占用少量磁盘空间）。

基于此原理，各选项通常执行以下操作：

**Build**：编译项目或工作区/解决方案中所有修改过的代码文件，并将对象文件链接成可执行程序。若自上次构建后无代码文件修改，此选项不执行任何操作。

**Clean**：清除所有缓存对象和可执行文件，确保下次构建时所有文件均重新编译并生成新可执行程序。

**Rebuild**：执行“clean”操作后进行“build”操作。

**Compile**：重新编译单个代码文件（无论是否被缓存过）。此选项不调用链接器，也不生成可执行文件。

**Run/start**：执行先前构建的可执行文件。某些IDE（如Visual Studio）会在执行“运行”前触发“构建”操作，以确保运行的是代码最新版本。而其他IDE（如Code::Blocks）则直接执行先前生成的可执行文件。

虽然我们日常会非正式地称之为“编译”程序，但实际编译时通常需在IDE中选择“构建”（或“运行”）选项来执行。

---

# 结论

恭喜你，你已经完成了本教程最困难的部分（安装集成开发环境并编译你的第一个程序）！

不必担心是否理解“Hello World”程序中不同代码行的作用。我们将在下一章开头详细分析并解释每行代码。


