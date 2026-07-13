---
title:              "《Learn C++》笔记 1.8 空白与基本格式"
date:               2026-07-13 23:17:30
last_modified_at:   2026-07-13 23:17:30
toc:                true
categories:         [C++, 01 C++ Basics]
tags:               [cpp, whitespace-and-basic-formatting]
---

**空白符**`Whitespace`是指用于格式化的字符。在C++中，主要指空格、制表符和换行符。C++中的空白符通常用于三种情况：分离特定语言元素、在文本内部使用，以及格式化代码。

---

# 某些语言元素必须用空格分隔

该语言的语法要求某些元素之间必须用空格分隔。这种情况通常发生在两个关键字或标识符必须连续出现时，以便编译器能够区分它们。

例如，变量声明必须用空格分隔：

```cpp
int x; // int and x must be whitespace separated
```

如果我们输入 intx，编译器会将其解释为标识符，并报错称其不认识标识符 intx。

另一个例子是，函数的返回类型与名称必须用空格分隔：

```cpp
int main(); // int and main must be whitespace separated
```

当需要使用空白符作为分隔符时，编译器并不关心使用多少空白符，只要存在即可。

以下变量定义均有效：

```cpp
int x;
int                y;
            int
z;
```

在某些情况下，换行符被用作分隔符。单行注释以换行符结束。

例如，这样做会导致问题：

```cpp
std::cout << "Hello world!"; // This is part of the comment and
this is not part of the comment
```

预处理器指令（例如 #include <iostream>）必须单独放在一行：

```cpp
#include <iostream>
#include <string>
```

---

# 引用的文本会精确保留其中的空白量

在引用的文本内部，空白量会被精确保留。

```cpp
std::cout << "Hello world!";
```

不同于：

```cpp
std::cout << "Hello          world!";
```

引用的文本中不允许出现换行符：

```cpp
std::cout << "Hello
     world!"; // Not allowed!
```

仅由空白符（空格、制表符或换行符）分隔的引用文本将被连接：

```cpp
std::cout << "Hello "
     "world!"; // prints "Hello world!"
```

![image](assets/img/posts/cpp/c++-basics/0108-1.png)
![image](assets/img/posts/cpp/c++-basics/0108-2.png)

---

# 使用空白符格式化代码

空白符通常会被忽略。这意味着我们可以随意使用空白符来格式化代码，使其更易于阅读。

例如，以下代码就相当难以阅读：

```cpp
#include <iostream>
int main(){std::cout<<"Hello world";return 0;}
```

以下版本更好（但仍然相当紧凑）：

```cpp
#include <iostream>
int main() {
std::cout << "Hello world";
return 0;
}
```

而以下内容更胜一筹：

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello world";

    return 0;
}
```

若需要，语句可拆分为多行：

```cpp
#include <iostream>

int main()
{
    std::cout
        << "Hello world"; // works fine
    return 0;
}
```

这对于特别长的陈述语句可能很有用。

---

# 基本格式

与某些其他语言不同，C++ 对程序员不强制任何格式限制。因此我们说 C++ 是种与空格无关的语言。

这种特性利弊参半。一方面，自由编写代码固然令人欣喜；另一方面，多年来已衍生出多种C++代码格式规范，关于最佳规范的选择常存在（有时相当显著且令人分心）的争议。我们的基本准则是：最优秀的编程风格应能生成最易读的代码，并保持高度一致性。

以下是我们对基本格式化的建议：

1. 缩进可使用制表符或空格（多数IDE支持将制表符转换为相应数量空格的设置）。偏好空格的开发者通常认为，无论使用何种编辑器或设置，空格都能确保代码精确对齐。而支持制表符的人则质疑：为何不用专为缩进设计的字符？尤其当制表符宽度可自由调整时。这没有标准答案——争论它如同讨论蛋糕与派孰优孰劣，终究取决于个人偏好。

无论采用哪种方式，我们建议将制表符缩进设置为4个空格。部分IDE默认采用3个空格缩进，这也完全可行。

2. 函数花括号存在两种常规写法：

多数开发者倾向于将左花括号与语句置于同一行：

```cpp
int main() {
    // statements here
}
```

这样做的理由在于它能减少垂直空白（因为无需为左大括号单独占用一行），从而在屏幕上容纳更多代码。这有助于提升代码可读性，因为无需频繁滚动即可理解代码功能。

不过在本教程系列中，我们将采用更常见的替代方案：左花括号单独成行：

```cpp
int main()
{
    // statements here
}
```

这能提高代码的可读性，并减少错误发生的可能性，因为花括号对必须始终保持相同的缩进层级。若因花括号不匹配导致编译器报错，问题所在的位置将一目了然。

3. 花括号内的每条语句都应从所属函数的左花括号开始缩进一个制表符。例如：

```cpp
int main()
{
    std::cout << "Hello world!\n"; // tabbed in one tab (4 spaces)
    std::cout << "Nice to meet you.\n"; // tabbed in one tab (4 spaces)
}
```

4. 行长不宜过长。通常80个字符是行长度的实际标准。若行需延长，应在合理位置拆分为多行。可通过在后续行增加额外缩进实现，若行内容相似，也可与上行对齐（以更易阅读为准）。

```cpp
int main()
{
    std::cout << "This is a really, really, really, really, really, really, really, "
        "really long line\n"; // one extra indentation for continuation line

    std::cout << "This is another really, really, really, really, really, really, really, "
                 "really long line\n"; // text aligned with the previous line for continuation line

    std::cout << "This one is short\n";
}
```

这使得代码更易于阅读。在现代宽屏显示器上，它还允许您将两个包含相似代码的窗口并排放置，从而更轻松地进行比较。

> **最佳实践**
> 建议将每行字符数控制在80个以内。

> **技巧**
> 多数编辑器内置功能（或插件/扩展）可在指定列位（如80字符处）显示分隔线（称为“列标记`column guide`”），便于及时察觉行长超限。若需确认编辑器是否支持此功能，请搜索编辑器名称+“列标记”。

5. 若长行被运算符（如<<或+）分割，该运算符应置于下一行开头，而非当前行末尾。

```cpp
std::cout << 3 + 4
    + 5 + 6
    * 7 * 8;
```

这有助于更清晰地表明后续行是前一行内容的延续，并允许你将运算符对齐在左侧，从而提升可读性。

6. 通过使用空白符对齐值或注释，或在代码块之间添加间距，使代码更易于阅读。


更难阅读：

```txt
cost = 57;
pricePerItem = 24;
value = 5;
numberOfItems = 17;
```

更易阅读：

```txt
cost          = 57;
pricePerItem  = 24;
value         = 5;
numberOfItems = 17;
```

更难阅读：

```cpp
std::cout << "Hello world!\n"; // cout lives in the iostream library
std::cout << "It is very nice to meet you!\n"; // these comments make the code hard to read
std::cout << "Yeah!\n"; // especially when lines are different lengths
```

更易阅读：

```cpp
std::cout << "Hello world!\n";                  // cout lives in the iostream library
std::cout << "It is very nice to meet you!\n";  // these comments are easier to read
std::cout << "Yeah!\n";                         // especially when all lined up
```

更难阅读：

```cpp
// cout lives in the iostream library
std::cout << "Hello world!\n";
// these comments make the code hard to read
std::cout << "It is very nice to meet you!\n";
// especially when all bunched together
std::cout << "Yeah!\n";
```

更易阅读：

```cpp
// cout lives in the iostream library
std::cout << "Hello world!\n";

// these comments are easier to read
std::cout << "It is very nice to meet you!\n";

// when separated by whitespace
std::cout << "Yeah!\n";
```

在本教程中，我们将始终遵循这些约定，它们很快就会成为你的第二本能。随着新主题的引入，我们也会相应推出与这些功能配套的新样式建议。

最终，C++赋予你选择最舒适或认为最佳风格的自由。但我们强烈建议你沿用示例代码中的统一风格——它经数千名程序员在数十亿行代码中实战验证，是经过成功验证的优化方案。

唯一例外：若你正在他人代码库中工作，请遵循其现有风格。保持一致性比坚持个人偏好更为重要。

> **最佳实践**:
> 在现有项目中工作时，请遵循已采用的任何风格规范保持一致。

---

# 自动格式化

大多数现代集成开发环境（IDE）会在您输入代码时协助格式化（例如创建函数时，IDE会自动缩进函数体内的语句）。

然而，当您增删代码、修改IDE默认格式设置，或粘贴格式不同的代码块时，格式可能变得混乱。修复文件部分或全部代码的格式往往令人头疼。所幸现代IDE通常内置自动格式化功能，可重新格式化选定区域（鼠标高亮部分）或整个文件。


> **对于 Visual Studio 用户**
> 在 Visual Studio 中，自动格式化选项位于“编辑”>“高级”>“格式化文档”以及“编辑”>“高级”>“格式化选定内容”。

> **对于 Code::Blocks 用户**
> 在 Code::Blocks 中，自动格式化选项位于右键点击菜单中的“格式化使用 AStyle”。

为方便操作，建议为当前文件添加键盘快捷键以实现自动格式化。

此外，也可使用外部工具自动格式化代码，clang-format 是其中广受欢迎的选择。

> **最佳实践**
> 强烈建议使用自动格式化功能，以保持代码格式风格的一致性。

---

# 风格指南

**风格指南**是一份简洁而具有指导性的文档，包含（有时是任意的）编程规范、格式规范和最佳实践。其目标是确保项目中所有开发人员采用一致的编程方式。

常被引用的C++风格指南包括：
* [C++核心指南](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)，由Bjarne Stroustrup和Herb Sutter维护。
* [Google](https://google.github.io/styleguide/cppguide.html)
* [LLVM](https://llvm.org/docs/CodingStandards.html)
* [GCC/GNU](https://gcc.gnu.org/codingconventions.html)

我们通常推荐采用 C++核心指南，因其内容最新且适用范围广泛。
