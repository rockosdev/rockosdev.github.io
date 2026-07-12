---
title:              "《Learn C++》笔记 1.7 关键词与命名标识符"
date:               2026-07-12 22:04:26
last_modified_at:   2026-07-12 22:04:26
toc:                true
categories:         [C++, 01 C++ Basics]
tags:               [cpp, keywords-and-naming-identifiers]
---

# 关键词

C++为自身保留了一组92个词（截至C++23版本）。这些词被称为**关键词**`keywords`（或保留字），每个关键词在C++语言中都具有特殊含义。

以下是所有C++关键词的列表（截至C++23版本）：

![image](assets/img/posts/cpp/c++-basics/0107-1.png)

标记为(C++20)的关键词是在C++20中新增的。若您的编译器不支持C++20（或虽具备C++20功能但默认禁用），这些关键词可能无法正常工作。

C++还定义了特殊标识符：override、final、import和module。这些标识符在特定上下文中具有特殊含义，但在其他情况下不作保留。

您已经接触过其中部分关键词，例如 int 和 return。这些关键词与特殊标识符（结合运算符集）共同构成了 C++ 语言的完整体系（预处理指令除外）。由于关键词和特殊标识符具有特殊含义，您的 IDE 通常会通过改变文本颜色使其在其他标识符中脱颖而出。

完成本教程系列后，您将理解几乎所有这些词汇的功能！

---

# 标识符命名规则

需要提醒的是，变量（或函数、类型及其他类型项）的名称称为**标识符**`identifier`。C++ 赋予了命名标识符的高度自由度，但命名时必须遵循以下规则：

* 标识符不能是关键字。**关键字**`keyword`属于保留字。
* 标识符仅可由字母（大小写均可）、数字及下划线字符组成。这意味着名称中不能包含符号（下划线除外）或空白字符（空格或制表符）。
* 标识符必须以字母（大小写均可）或下划线开头，不可以数字开头。
* C++区分大小写，因此区分小写字母与大写字母。例如：nvalue 与 nValue 与 NVALUE 是不同的标识符。

---

# 标识符命名最佳实践

既然您已了解如何命名变量，接下来我们来探讨如何正确命名变量（或函数）。

1. C++中惯例要求变量名以小写字母开头。若变量名由单词或首字母缩写构成，则应全部采用小写字母书写。

```cpp
int value; // conventional

int Value; // unconventional (should start with lower case letter)
int VALUE; // unconventional (should start with lower case letter and be in all lower case)
int VaLuE; // unconventional (see your psychiatrist) ;)
```

通常情况下，函数名也以小写字母开头（尽管对此存在不同意见）。我们将遵循这一约定，因为主函数（所有程序都必须包含）以小写字母开头，C++标准库中的所有函数亦是如此。

以大写字母开头的标识符通常用于用户定义的类型（如结构体、类和枚举类型，这些内容我们将在后续章节中详细讲解）。

若变量或函数名称由多个单词组成，常见两种命名规范：用下划线分隔单词（有时称为蛇形命名法），或采用首字母大写分隔（有时称为骆驼命名法，因大写字母如骆驼驼峰般凸起）。

```cpp
int my_variable_name;   // conventional (separated by underscores/snake_case)
int my_function_name(); // conventional (separated by underscores/snake_case)

int myVariableName;     // conventional (intercapped/camelCase)
int myFunctionName();   // conventional (intercapped/camelCase)

int my variable name;   // invalid (whitespace not allowed)
int my function name(); // invalid (whitespace not allowed)

int MyVariableName;     // unconventional (should start with lower case letter)
int MyFunctionName();   // unconventional (should start with lower case letter)
```

在本教程中，我们将主要采用首字母大写命名法，因为它更易于阅读（在密集的代码块中，下划线容易被误认为空格）。但两种方式都很常见——C++标准库就同时使用下划线命名法来命名变量和函数。有时你会看到两种方式混合使用：变量用下划线命名，函数用首字母大写命名。

值得注意的是，若你在他人代码中工作，通常建议遵循现有代码的命名风格，而非僵化地套用上述规范。

> **最佳实践**
> 在现有程序中工作时，请遵循该程序的约定（即使这些约定不符合现代最佳实践）。编写新程序时，请采用现代最佳实践。

2. 避免使用下划线开头的标识符命名。尽管语法上合法，但这类名称通常保留给操作系统、库和/或编译器使用。

3. 标识符名称应清晰传达其存储值的含义（尤其当单位不明确时）。命名方式应使完全不了解代码功能的人也能快速理解。三个月后当你重审程序时，会忘记其运作机制，届时你会庆幸当初选择了有意义的变量名。

然而，为琐碎的标识符赋予过度复杂的名称，几乎与为非琐碎标识符命名不当一样，会阻碍对程序整体功能的理解。一个实用准则是：标识符的长度应与其具体性和可访问性成正比。这意味着：

* 仅存在于少量语句中的标识符（例如短函数体内）可采用较短名称。
* 在任何位置都可访问的标识符，采用较长名称更有利。
* 表示非特定数值的标识符（如用户输入的任何数据）可采用较短名称。
* 表示特定数值的标识符（如以毫米为单位的裤裆长度）应采用较长名称。

| int ccount                 | Bad    | What does the c before “count” stand for?                            |
| -------------------------- | ------ | -------------------------------------------------------------------- |
| int customerCount          | Good   | Clear what we’re counting                                            |
| int i                      | Either | Okay if use is trivial, bad otherwise                                |
| int index                  | Either | Okay if obvious what we’re indexing                                  |
| int totalScore             | Either | Okay if there’s only one thing being scored, otherwise too ambiguous |
| int _count                 | Bad    | Do not start names with underscore                                   |
| int count                  | Either | Okay if obvious what we’re counting                                  |
| int data                   | Bad    | What kind of data?                                                   |
| int time                   | Bad    | Is this in seconds, minutes, or hours?                               |
| int minutesElapsed         | Either | Okay if obvious what this is elapsed from                            |
| int x1, x2                 | Either | Okay if use is trivial, bad otherwise                                |
| int userinput1, userinput2 | Bad    | Hard to differentiate between the two due to long name               |
| int numApples              | Good   | Descriptive                                                          |
| int monstersKilled         | Good   | Descriptive                                                          |

4. 避免使用缩写，除非它们是常见且无歧义的（例如：num、cm、idx）。

> **关键洞见**:
> 代码被阅读的次数远多于编写次数，因此编写代码时节省的任何时间，都将成为每位读者（包括未来的你）在阅读时浪费的时间。若想加快编码速度，请善用编辑器的自动补全功能。

5. 对于变量声明，使用注释描述变量的用途或解释其他可能不明显的信息会很有帮助。例如，假设我们声明了一个用于存储文本字符数的变量。文本“Hello World!”的字符数是10、11还是12？这取决于是否包含空格与标点符号。与其将变量命名为冗长的numCharsIncludingWhitespaceAndPunctuation，不如在声明行上方添加恰当的注释，这样能帮助用户理解其含义：

```cpp
// a count of the number of chars in a piece of text, including whitespace and punctuation
int numChars {};
```

---

# 测验时间

问题 #1

根据变量命名规范，判断下列每个变量名是否符合惯例（遵循最佳实践）、不符合惯例（编译器接受但未遵循最佳实践）或无效（无法编译），并说明原因。

int sum {};

（假设求和对象显而易见）

显示答案
```txt
符合惯例
```

---

int _apples {};

显示答案
```txt
不符合惯例——变量名不应以下划线开头。
```

---

int VALUE {};

显示答案
```txt
不符合惯例——单词名字应全部使用小写字母。
```

---

int my variable name {};

显示答案
```txt
无效 -- 变量名不能包含空格。
```

---

int TotalCustomers {};

显示答案
```txt
不符合惯例——变量名应以小写字母开头。
```

---

int void {};

显示答案
```txt
无效 -- void 是关键字。
```

---

int numFruit {};

显示答案
```txt
符合惯例
```

---

int 3some {};

显示答案
```txt
无效 -- 变量名不能以数字开头。
```

---

int meters_of_pipe {};

显示答案
```txt
符合惯例
```
