---
title:              "《Learn C++》笔记 0.0 iostream 介绍：cout、cin 和 endl"
date:               2026-07-01 21:28:42
last_modified_at:   2026-07-01 21:28:42
toc:                true
categories:         [C++, 01 C++ Basics]
tags:               [cpp, instroduction-to-iostream]
---

在本节课中，我们将深入探讨std::cout——这个在“Hello world!”程序中用于向控制台输出文本“Hello world!”的库函数。同时，我们还将学习如何获取用户输入，从而使程序具备更强的交互性。

---

# 输入/输出库

**输入/输出库**`input/output library`（io库）是C++标准库的一部分，用于处理基本的输入和输出操作。我们将利用该库的功能从键盘获取输入，并将数据输出到控制台。iostream中的io代表输入/输出。

要使用iostream库定义的功能，需在使用该库内容的代码文件开头包含iostream头文件，如下所示：

```cpp
#include <iostream>

// rest of code that uses iostream functionality here
```

---

# std::cout

iostream 库包含若干预定义变量供我们使用。其中最实用的当属 **std::cout**，它能将数据发送到控制台以文本形式输出。cout 代表“字符输出”。

作为回顾，以下是我们最初的 Hello world 程序：

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hello world!"; // print Hello world! to console

    return 0;
}
```

在本程序中，我们引入了iostream以便使用std::cout。在main函数内部，我们通过std::cout配合**插入运算符**`insertion operator`(<<)，将文本“Hello world!”发送到控制台进行打印。

std::cout不仅能打印文本，还能输出数字：

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << 4; // print 4 to console

    return 0;
}
```

这产生了以下结果：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206211543876-259869793.png)

它也可用于打印变量的值：

```cpp
#include <iostream> // for std::cout

int main()
{
    int x{ 5 }; // define integer variable x, initialized with value 5
    std::cout << x; // print value of x (5) to console
    return 0;
}
```

这产生了以下结果：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206211703825-2118318933.png)

要在同一行打印多项内容，可在一条语句中多次使用插入运算符（<<）来连接（串联）多段输出。例如：

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hello" << " world!";
    return 0;
}
```

此处使用了两次<<操作符，首先输出Hello，然后输出world。

因此，该程序将打印：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206212149666-235159805.png)

> **提示**
> 将operator<<运算符（以及operator>>运算符）想象成一条按指示方向输送数据的传送带或许有所帮助。在此情况下，当内容被输送至std::cout时，就会被输出。

下面是另一个示例，我们在同一条语句中同时输出文本和变量的值：

```cpp
#include <iostream> // for std::cout

int main()
{
    int x{ 5 };
    std::cout << "x is equal to: " << x;
    return 0;
}
```

该程序输出：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206212413173-576684832.png)

> **相关内容**
> 我们在[第2.9课——命名冲突与命名空间介绍](https://www.cnblogs.com/learncpp/articles/19591790)中讨论了std::前缀的实际作用。

---

# 使用 std::endl 输出换行符

你认为这个程序会输出什么？

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hi!";
    std::cout << "My name is Alex.";
    return 0;
}
```

你可能会对结果感到惊讶：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206212706342-1075757360.png)

单独的输出语句不会在控制台上生成独立的输出行。

若要在控制台上打印独立的输出行，我们需要指示控制台将光标移至下一行。这可通过输出换行符实现。**换行符**`newline`是操作系统特有的字符或字符序列，能将光标移至下一行开头。

输出换行符的一种方式是输出 std::endl（代表“行尾”）：

```cpp
#include <iostream> // for std::cout and std::endl

int main()
{
    std::cout << "Hi!" << std::endl; // std::endl will cause the cursor to move to the next line
    std::cout << "My name is Alex." << std::endl;

    return 0;
}
```

这将输出：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206213005679-527461516.png)

> **提示**
> 在上述程序中，第二个 std::endl 严格来说并非必要，因为程序会在其后立即结束。然而它具有几个实用功能。
> 首先，它有助于表明输出行是一个“完整语句”（区别于在代码后续位置完成的片段输出）。从这个意义上说，它类似于标准英语中句点的功能。
> 其次，它能将光标定位到下一行，这样后续添加输出内容（例如让程序输出“bye!”）时，新内容会出现在预期位置（而非附着在原输出行之后）。
> 第三，某些操作系统在命令行执行程序后，不会在显示命令提示符前输出换行符。若程序未在换行符处结束输出，命令提示符可能出现在前一行输出末尾，而非用户预期的新行开头。

> **最佳实践**
> 每当输出内容完整时，务必添加换行符。

---

# std::cout 是缓冲的

想象你在最喜欢的游乐园乘坐过山车。乘客以某种变量速率出现并排队等候。列车会定期抵达并接载乘客（直至达到列车最大载客量）。当列车满员或经过足够时间后，列车便载着一批乘客出发，旅程就此开始。未能登上当前列车的人员需等待下一班次。

此类比与 C++ 中 std::cout 输出处理机制相似。程序中的语句要求将输出发送到控制台，但输出通常不会立即发送。相反，请求的输出会“排队”，并存储在专门收集此类请求的内存区域（称为**缓冲区**`buffer`）中。缓冲区会**定期清空**`flushed`，即所有收集的数据将被传输至目标位置（此处即控制台）。

> **作者注**
> 换个比喻来说，清空缓冲区就像冲马桶。所有收集的“输出”都会被转移到……不管它接下来要去哪里。呕。

这也意味着，如果程序在缓冲区清空之前发生崩溃、中止或暂停（例如用于调试），任何仍滞留在缓冲区中的输出都将不会显示。

> **关键洞察**
> 缓冲输出的对立面是无缓冲输出。在无缓冲输出模式下，每个单独的输出请求都会直接发送至输出设备。
>
> 向缓冲区写入数据通常速度较快，而将批量数据传输至输出设备则相对较慢。通过将多个输出请求批量处理，缓冲机制能显著提升性能——它最大限度地减少了向输出设备发送数据的次数。


---

# std::endl 与 \n 的区别

使用 std::endl 通常效率较低，因为它实际上执行两项操作：输出换行符（将光标移至控制台下一行）并刷新缓冲区（此过程耗时）。若输出多行以 std::endl 结尾的文本，将触发多次缓冲区刷新，既低效又可能毫无必要。

向控制台输出文本时，通常无需手动显式刷新缓冲区。C++的输出系统设计为定期自动刷新，放任其自行刷新既简洁又高效。

若需输出换行而不刷新输出缓冲区，应使用\n（可置于单引号或双引号内），这是编译器识别为换行符的特殊符号。\n 能在不触发刷新时将光标移至下一行，因此通常性能更优。该符号输入更简洁，且可嵌入现有双引号文本中。

以下示例展示了\n的多种用法：

```cpp
#include <iostream> // for std::cout

int main()
{
    int x{ 5 };
    std::cout << "x is equal to: " << x << '\n'; // single quoted (by itself) (conventional)
    std::cout << "Yep." << "\n";                 // double quoted (by itself) (unconventional but okay)
    std::cout << "And that's all, folks!\n";     // between double quotes in existing text (conventional)
    return 0;
}
```

这将输出：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206214626849-1487783973.png)

当换行符 \n 不嵌入到现有双引号文本行中时（例如 “hello\n”），通常使用单引号表示（‘\n’）。

> **进阶读者须知**:
> 在C++中，单引号用于表示单个字符（如'a'或'$'），双引号则用于表示文本（零个或多个字符）。
>
> 尽管源代码中‘\n’由两个符号表示，但编译器将其视为单个换行符（LF，ASCII值为10），因此通常用单引号包裹（除非嵌入现有双引号文本中）。更多细节将在第4.11节——字符中讨论。
>
> 当输出‘\n’时，负责输出的库需将此单个LF字符转换为目标操作系统对应的换行序列。有关操作系统换行规范的详细信息，请参阅[维基百科](https://en.wikipedia.org/wiki/Newline)。

> **作者注**
> 尽管非传统做法，我们认为在标准输出语句中使用（甚至优先使用）双引号“\n”是可行的。
>
> 此做法有两大核心优势：
>
> 1. 统一使用双引号包裹所有输出文本，比区分单引号与双引号更简洁。
> 2. 更重要的是，它能避免意外的多字符字面量。我们在第4.11节——字符中，将详细探讨多字符字面量及其可能引发的意外输出。
>
> 在非输出场景中，应优先使用单引号。

我们将在字符单元（[4.11 -- 字符](https://www.cnblogs.com/learncpp/articles/19591850)）的课程中详细讲解‘\n’的含义。

> **最佳实践**:
> 向控制台输出文本时，优先使用 \n 替代 std::endl。

> **警告**:
> ‘\n’ 使用反斜杠（C++ 中所有特殊字符均如此），而非正斜杠。
>
> 使用正斜杠（如 ‘/n’）或在单引号内包含其他字符（如 ‘ \n’ 或 ‘.\n’）将导致意外行为。例如，std::cout << ‘/n’; 通常会输出 12142，这很可能并非预期结果。

---

# std::cin

std::cin 是 iostream 库中的另一个预定义变量。与 std::cout 将数据输出到控制台（使用插入运算符 << 提供数据）不同，std::cin（代表“字符输入”）从键盘读取输入。我们通常使用**提取**`extraction`运算符 >> 将输入数据放入变量中（随后可在后续语句中使用该变量）。

```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter a number: "; // ask user for a number

    int x{};       // define variable x to hold user input (and value-initialize it)
    std::cin >> x; // get number from keyboard and store it in variable x

    std::cout << "You entered " << x << '\n';
    return 0;
}
```

请尝试编译并运行这个程序。运行时，第5行会显示“请输入一个数字：”。当代码执行到第8行时，程序将等待你输入数据。输入数字（并按下回车键）后，该数字会被赋值给变量x。最后，在第10行，程序会输出“你输入的是 ”，后面跟着你刚刚输入的数字。

例如（输入值4时）：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206232004993-569332894.png)

这是获取用户键盘输入的便捷方式，后续我们将在此后的许多示例中使用它。

> **提示**
> 请注意，在接受输入行时无需输出'\n'，因为用户需要按下回车键才能提交输入，此操作会将光标移至控制台的下一行。
> * 若输入数字后屏幕立即关闭，请参阅[第0.8课——几个常见的C++问题](https://www.cnblogs.com/learncpp/articles/19572607) 获取解决方案。
> * 若使用CLion时“You entered”前出现空格，此为CLion程序缺陷。请查阅[CLion缺陷追踪器](https://youtrack.jetbrains.com/issue/CPP-17579)获取解决方法。

正如单行可输出多个文本位，单行也可输入多个值：

```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter two numbers separated by a space: ";

    int x{}; // define variable x to hold user input (and value-initialize it)
    int y{}; // define variable y to hold user input (and value-initialize it)
    std::cin >> x >> y; // get two numbers and store in variable x and y respectively

    std::cout << "You entered " << x << " and " << y << '\n';

    return 0;
}
```

这将产生以下输出：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206231234937-719318320.png)

输入的值应使用空白符（空格、制表符或换行符）分隔。

> **关键要点**
> 关于是否需要在通过其他来源（如std::cin）接收用户输入前立即初始化变量存在争议，因为用户输入会覆盖初始化值。基于我们此前提出的“变量应始终初始化”的建议，最佳实践是先进行变量初始化。

> **进阶读者须知**
> C++ 输入输出库不提供无需用户按回车键即可接收键盘输入的功能。若需此功能，需借助第三方库实现。对于控制台应用程序，推荐使用 [pdcurses](https://pdcurses.org/)、[FXTUI](https://github.com/ArthurSonzogni/FTXUI)、[cpp-terminal](https://github.com/jupyter-xeus/cpp-terminal) 或 [notcurses](https://github.com/dankamongmen/notcurses)。多数图形用户界面库均自带此类功能。

---

# std::cin 是缓冲的

在前面的章节中，我们提到输出数据实际上是一个两阶段的过程：

* 每次输出请求的数据都会被添加到输出缓冲区的末尾。
* 随后，输出缓冲区（前端）的数据会被刷新到输出设备（控制台）。

> **关键洞察**
> 将数据添加到缓冲区末尾并从缓冲区前端移除，可确保数据按添加顺序进行处理。这有时被称为FIFO（先进先出`first in, first out`）。

同样地，数据输入也是一个两阶段的过程：

* 你输入的每个字符都会被添加到输入缓冲区（位于std::cin内部）的末尾。回车键（用于提交数据）也会被存储为'\n'字符。
* 提取运算符‘>>’从输入缓冲区前端移除字符，将其转换为数值，并通过复制赋值操作赋给关联变量。该变量随后可在后续语句中使用。

> **关键洞察**
> 输入缓冲区中的每行输入数据均以'\n'字符结束。

我们将通过以下程序演示此特性：

```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter two numbers: ";

    int x{};
    std::cin >> x;

    int y{};
    std::cin >> y;

    std::cout << "You entered " << x << " and " << y << '\n';

    return 0;
}
```

本程序向两个变量输入数据（本次作为独立语句）。我们将运行两次该程序。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206233936747-832735705.png)

运行#1：遇到`std::cin >> x;`时，程序将等待输入。输入值4。输入内容4\n进入输入缓冲区，值4被提取至变量x。

遇到 std::cin >> y; 时，程序再次等待输入。输入值 5。输入 5\n 进入输入缓冲区，值 5 被提取到变量 y 中。最后程序将输出 You entered 4 and 5。

此运行结果不应令人意外。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206234011358-474608687.png)

运行#2：遇到 std::cin >> x 时，程序将等待输入。输入 4 5。输入 4 5\n 进入输入缓冲区，但仅提取 4 至变量 x（提取在空格处停止）。

遇到 std::cin >> y 时，程序不会等待输入。此时将输入缓冲区中残留的 5 提取至变量 y，随后程序输出“您输入了 4 和 5”。

需注意：在运行 #2 中，程序提取变量 y 时未等待用户补充输入，因为输入缓冲区中已有可用数据。

> **关键洞察**
> std::cin 采用缓冲机制，因为它使我们能够将输入的输入与输出的提取分离。我们可以先输入一次数据，然后对其执行多次提取请求。

---

# 基本提取过程

以下是运算符 >> 处理输入的简化流程：

1. 若 std::cin 状态异常（例如前次提取失败且 std::cin 未被清除），则不会尝试提取，提取过程立即中止。
2. 输入缓冲区中的前导空白字符（缓冲区开头的空格`space`、制表符`tab`和换行符`newlines`）将被丢弃。这将丢弃前一行输入残留的未提取换行符。
3. 若输入缓冲区此时为空，>> 运算符将等待用户输入更多数据。输入数据中的首部空白字符同样会被丢弃。
4. 随后 >> 运算符将尽可能提取连续字符，直至遇到换行符（表示输入行结束）或无法赋值给目标变量的无效字符。

提取过程的结果如下：

* 若步骤1中止提取，则未进行任何提取尝试，后续操作终止。
* 若步骤4成功提取字符，则提取成功。提取的字符将转换为数值，并通过复制赋值赋给变量。
* 若步骤4未能提取任何字符，则提取失败。目标对象将被赋值0（C++11起），且后续提取操作将立即失败（直至std::cin被清空）。

所有未提取的字符（含换行符）仍可用于下次提取尝试。

> **相关内容**
> 我们在第9.5课——std::cin与处理无效输入中讨论了如何检测和处理提取失败、处理多余输入以及清除std::cin。

例如，给定以下代码片段：

```cpp
int x{};
std::cin >> x;
```

以下是三种不同输入情况的处理结果：

* 若用户输入 5a 并按回车，缓冲区将添加 5a\n。其中 5 将被提取、转换为整数并赋值给变量 x，而 a\n 将保留在输入缓冲区以备下次提取。
* 若用户输入 ‘b’ 并按回车，缓冲区将添加 b\n。由于b不是有效整数，无法提取任何字符，因此提取失败。变量x将被设置为0，后续提取操作将持续失败直至清除输入流。
* 若因先前提取失败导致std::cin状态异常，此处将不执行任何操作。变量x的值保持不变。

更多案例将在下方测验中探讨。

---

# 运算符<<与运算符>>

新手程序员常将std::cin、std::cout、插入运算符(<<)和提取运算符(>>)混淆。以下是简易记忆法：

* std::cin和std::cout始终位于运算符左侧。
* std::cout用于输出值（cout=字符输出）。
* std::cin 用于获取输入值（cin = 字符输入）。
* << 配合 std::cout 使用，表示数据流动方向。std::cout << 4 将数值 4 输出至控制台。
* >> 配合 std::cin 使用，表示数据流动方向。std::cin >> x 将用户键入的值从键盘读取至变量 x。

关于运算符的更多内容将在[第1.9课——字面量与运算符介绍](https://www.cnblogs.com/learncpp/articles/19572663) 中详述。

> **顺带一提……**
> 若您好奇为何C++采用std::cout和std::cin而非其他命名，请参阅https://en.wikipedia.org/wiki/Standard_streams。

---

# 测验时间

问题 #1

请考虑我们上面使用的以下程序：


```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter a number: "; // ask user for a number
    int x{}; // define variable x to hold user input
    std::cin >> x; // get number from keyboard and store it in variable x
    std::cout << "You entered " << x << '\n';

    return 0;
}
```

该程序要求输入整数值，因为用户输入将被赋值给整型变量x。

多次运行此程序，并描述输入下列类型时产生的输出：

a) 字母，例如h。

显示解决方案
```txt
结果：始终输出0。

原因：整型无法存储字母，因此提取操作完全失败。变量x被赋值为0。
```
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000013660-834977562.png)


b) 带小数部分的数字（如3.2）。尝试小于0.5和大于0.5的带小数部分数字（如3.2和3.7）。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000117172-70694896.png)
![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000147328-1472847827.png)

显示解决方案
```txt
结果：小数部分被舍弃（而非四舍五入）。

发生过程：对于数字 3.2，先提取 3，但 . 是无效字符，因此提取在此终止。剩余的 .2 将保留至下次提取尝试。

若您疑惑为何此操作不属于禁止的窄化转换，需知窄化转换仅在列表初始化时被禁止（发生于第6行）。而提取操作发生在第7行。
```
c) 小负整数，例如-3。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000318024-960443830.png)


显示解决方案
```txt
结果：输出输入的数字。

操作过程：数字开头的负号被视为有效，因此被提取。其余数字同样被提取。
```

d) 短语，例如Hello。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000421113-127977832.png)


显示解决方案
```txt
结果：始终输出0。

原因：整型无法存储字母，因此提取操作完全失败。变量x被赋值为0。
```

e) 极大数值（至少30亿）。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000601259-103822523.png)


显示答案
```txt
结果：您最有可能得到数字 2147483647。

原理说明：变量x只能存储特定大小的数值。若输入值超过x的最大存储容量，系统将自动将其设为x能容纳的最大数值（通常为2147483647，但具体数值可能因系统而异）。本主题将在第4.4节《带符号整数》中深入探讨。
```

f) 小数后接字母，如123abc。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000656320-1237974905.png)

显示答案
```txt
结果：数值被打印出来（例如 123）。

发生的情况：123 被提取出来，剩余字符（例如 abc）保留以备后续提取。
```

g) 字母后接小数，如abc123。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000756551-1550156123.png)

显示答案
```txt
结果：始终输出0。

原因：整型无法存储字母，因此提取操作完全失败。变量x被赋值为0。
```

h) +5（三个空格，加号符号，后接数字5）。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207000927502-991434425.png)

显示答案
```txt
结果：输出5。

发生过程：开头的空格被跳过。加号作为数字开头的有效符号（如同减号），因此被提取。数字5也被提取。
```

i) 5b6。

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207001021651-969344310.png)

显示答案
```txt
结果：输出5。

过程说明：提取出5。由于b无效，提取在此终止。b6将保留至下次提取尝试。
```

---

问题 #2

请用户输入三个数值。程序应打印这些数值。在 main() 函数上方添加适当的注释。

程序运行时应输出如下结果（当输入值为 4、5 和 6 时）：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260207001521582-779545202.png)

显示提示
```txt
提示：函数上方的注释应描述该函数的功能。
```

显示提示
```txt
提示：请确保输出内容使用双引号。
```

显示答案
```cpp
#include <iostream>

// Asks the user to enter three values and then print those values as a sentence.
int main()
{
    std::cout << "Enter three numbers: ";

    int x{};
    int y{};
    int z{};
    std::cin >> x >> y >> z;

    std::cout << "You entered " << x << ", " << y << ", and " << z << ".\n";

    return 0;
}
```
请注意，由于输出多个字符，“.\n”必须使用双引号括起。

