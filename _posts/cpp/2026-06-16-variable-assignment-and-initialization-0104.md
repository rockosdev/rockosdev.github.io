---
title:              "《Learn C++》笔记 1.4 量赋值与初始化"
date:               2026-06-16 22:29:38
last_modified_at:   2026-06-16 22:29:38
toc:                true
categories:         [C++, 01 C++ Basics]
tags:               [cpp, variable-assignment-and-initialization]
---

在上节课（[1.3——对象与变量简介](https://www.cnblogs.com/learncpp/articles/19572639)）中，我们介绍了如何定义变量来存储值。本节课我们将探讨如何实际向变量赋值。

作为回顾，以下是一个简短程序：它首先分配一个名为 x 的整型变量，随后又分配了两个名为 y 和 z 的整型变量：

```cpp
int main()
{
    int x;    // define an integer variable named x (preferred)
    int y, z; // define two integer variables, named y and z

    return 0;
}
```

请注意，建议每行只定义一个变量。本节课后面会再讨论同时定义多个变量的情况。

---

# 变量赋值

定义变量后，可使用=运算符（在单独的语句中）为其**赋值**`assignment`。此过程称为赋值，而=运算符则称为**赋值运算符**`assignment operator`。

```cpp
int width; // define an integer variable named width
width = 5; // assignment of value 5 into variable width

// variable width now has value 5
```

默认情况下，赋值操作会将等号右侧的值复制到等号左侧的变量中。这被称为**复制赋值**`copy-assignment`。

变量被赋值后，其值可通过 std::cout 和 << 运算符进行输出。

当需要修改变量存储的值时，即可使用赋值操作。以下示例演示了两次赋值操作的应用：

下方是预定义的三个快捷

```cpp
#include <iostream>

int main()
{
	int width; // define a variable named width
	width = 5; // copy assignment of value 5 into variable width

	std::cout << width; // prints 5

	width = 7; // change value stored in variable width to 7

	std::cout << width; // prints 7

	return 0;
}
```

这将输出：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206193836342-771363354.png)

当运行此程序时，执行从 main 函数顶部开始并按顺序进行。首先为变量 width 分配内存空间。随后将值 5 赋给 width。当输出 width 的值时，控制台会显示 5。当再次将值 7 赋给 width 时，先前值（此处为 5）会被覆盖。因此再次输出 width 时，控制台将显示 7。

普通变量每次只能存储一个值。

> **警告**：
> 新手程序员最常犯的错误之一是混淆赋值运算符(=)与等值运算符( == )。赋值运算符(=)用于为变量赋值，等值运算符( == )用于检测两个操作数是否相等。

---

# 变量初始化

赋值操作的一个缺点在于：为刚定义的对象赋值需要两步操作——先定义变量，再赋值。

这两步操作可以合并。定义对象时，可选择性地为其提供初始值。为对象指定初始值的过程称为**初始化**`initialization`，而用于初始化的语法结构称为**初始化器**`initializer`。非正式场合中，初始值也常被称为“初始化器initializer”。

例如以下语句同时定义了名为 width 的变量（类型为 int），并将其初始化为值 5：

```cpp
#include <iostream>

int main()
{
    int width { 5 };    // define variable width and initialize with initial value 5
    std::cout << width; // prints 5

    return 0;
}
```

在上面的变量宽度初始化中，{ 5 } 是初始化器，而 5 是初始值。


> **关键要点**:
> 初始化为变量提供初始值。请记住“初始化`initial-ization`”的含义。


---

# 初始化的不同形式

与赋值（通常较为简单）不同，C++中的初始化出人意料地复杂。因此我们在此提供一个简化视角作为入门。

C++中有5种常见的初始化形式：

```cpp
int a;         // default-initialization (no initializer)

// Traditional initialization forms:
int b = 5;     // copy-initialization (initial value after equals sign)
int c ( 6 );   // direct-initialization (initial value in parenthesis)

// Modern initialization forms (preferred):
int d { 7 };   // direct-list-initialization (initial value in braces)
int e {};      // value-initialization (empty braces)
```

您可能会看到上述形式采用不同的空格写法（例如：int b=5; int c(6);, int d{7};, int e{};）。是否使用额外空格提升可读性属于个人偏好问题。

自C++17起，复制初始化、直接初始化和直接列表初始化在大多数情况下行为一致。下面我们将重点探讨它们存在差异的最相关场景。

> **相关内容**
> 关于复制初始化、直接初始化和列表初始化的其余差异，我们将在[第14.15节——类初始化和复制省略](https://www.cnblogs.com/learncpp/articles/19422022)中进行讲解。

> **对于进阶读者**
> 其他初始化形式包括：
> * 聚合初始化（参见[13.8节——结构体聚合初始化](https://www.cnblogs.com/learncpp/articles/19384199)）。
> * 复制列表初始化（下文详述）。
> * 引用初始化（参见[12.3节——左值引用](https://www.cnblogs.com/learncpp/articles/19324865)）。
> * 静态初始化、常量初始化与动态初始化（参见7.8节——为何（非const）全局变量有害）。
> * 零初始化（下文详述）。

---

# 默认初始化

当未提供初始化表达式时（如上文变量 a 的情况），称为**默认初始化**`default-initialization`。在多数情况下，默认初始化不会执行任何初始化操作，导致变量保持未确定值（即不可预测的值，有时称为“垃圾值”）。

我们将在第([1.6节——未初始化变量与未定义行为](https://www.cnblogs.com/learncpp/articles/19572652)）中进一步探讨此情况。

---

# 复制初始化

当在等号后提供初始值时，称为**复制初始化**`copy-initialization`。这种初始化形式继承自C语言。

```cpp
int width = 5; // copy-initialization of value 5 into variable width
```

与复制赋值类似，此操作将等号右侧的值复制到左侧创建的变量中。在上面的代码片段中，变量 width 将被初始化为值 5。

由于在某些复杂类型上效率低于其他初始化方式，复制初始化在现代C++中曾逐渐失宠。但C++17修正了大部分问题，如今复制初始化正赢得新的拥护者。你仍会在旧代码（尤其是从C语言移植的代码）中看到它的踪迹，或被那些认为其更自然、更易读的开发者采用。

> **对于高级读者**
> 当值被隐式复制时，也会使用复制初始化，例如按值传递函数参数、按值返回函数结果，或按值捕获异常。


---

# 直接初始化

当括号内提供初始值时，称为**直接初始化**。

```cpp
int width ( 5 ); // direct initialization of value 5 into variable width
```

直接初始化最初是为了更高效地初始化复杂对象（即具有类型的对象，我们将在后续章节中探讨）而引入的。与复制初始化类似，直接初始化在现代C++中已逐渐失宠，主要原因是它已被直接列表初始化所取代。然而，直接列表初始化本身存在若干特殊性，因此直接初始化在特定场景下正重新获得应用价值。

> **进阶读者须知**
> 当值被显式转换为其他类型时（例如通过static_cast），也会使用直接初始化。

---

# 列表初始化

在C++中初始化对象的现代方式是使用一种利用**花括号**`curly braces`的初始化形式。这被称为**列表初始化**`list-initialization`（或**统一初始化**`uniform initialization`、**大括号初始化**`brace initialization`）。

列表初始化有两种形式：

```cpp
int width { 5 };    // direct-list-initialization of initial value 5 into variable width (preferred)
int height = { 6 }; // copy-list-initialization of initial value 6 into variable height (rarely used)
```

在C++11之前，某些类型的初始化需要使用复制初始化，而另一些则需要使用直接初始化。复制初始化与复制赋值难以区分（因为两者都使用=符号），而直接初始化又与函数相关操作难以区分（因为两者都使用括号）。

列表初始化机制的引入，旨在提供一种几乎适用于所有场景的初始化语法。它不仅行为一致，更具备明确的语法结构，使我们能够清晰辨别对象初始化的位置。

> **关键要点**
> 当看到花括号时，我们便知这是对象的列表初始化。

此外，列表初始化还提供了一种用值列表而非单个值初始化对象的方式（因此得名“列表初始化”）。我们在[第16.2节——std::vector与列表构造函数介绍](https://www.cnblogs.com/learncpp/articles/19435146) 中展示了相关示例。

---

# 列表初始化禁止窄化转换

对新接触C++的程序员而言，列表初始化的主要优势之一在于禁止“窄化转换”。这意味着若尝试使用变量无法安全容纳的值进行列表初始化，编译器必须生成诊断信息（编译错误或警告）予以提示。例如：

```cpp
int main()
{
    // An integer can only hold non-fractional values.
    // Initializing an int with fractional value 4.5 requires the compiler to convert 4.5 to a value an int can hold.
    // Such a conversion is a narrowing conversion, since the fractional part of the value will be lost.

    int w1 { 4.5 }; // compile error: list-init does not allow narrowing conversion

    int w2 = 4.5;   // compiles: w2 copy-initialized to value 4
    int w3 (4.5);   // compiles: w3 direct-initialized to value 4

    return 0;
}
```

在上方程序的第7行，我们使用包含小数部分（.5）的值（4.5）来列表初始化整型变量（该类型仅能存储无小数部分的值）。由于这是窄化转换，编译器必须在此类情况下生成诊断信息。

复制初始化（第9行）和直接初始化（第10行）都会静默舍弃小数部分.5，将变量初始化为值4（这很可能并非我们所期望的结果）。编译器可能会对此发出警告（因为数据丢失通常是不被允许的），但也可能不会。

需注意：此窄化转换限制仅适用于列表初始化，不适用于后续对该变量的赋值操作：

```cpp
int main()
{
    int w1 { 4.5 }; // compile error: list-init does not allow narrowing conversion of 4.5 to 4

    w1 = 4.5;       // okay: copy-assignment allows narrowing conversion of 4.5 to 4

    return 0;
}
```

---

# 值初始化和零初始化

当使用空大括号初始化变量时，会执行一种称为**值初始化**`value-initialization`的特殊列表初始化形式。在大多数情况下，值初始化会隐式将变量初始化为零（或该类型下最接近零的值）。当发生归零操作时，则称为**零初始化**`zero-initialization`。

```cpp
int width {}; // value-initialization / zero-initialization to value 0
```

> **对于高级读者**：
> 对于类类型，值初始化（以及默认初始化）可将对象初始化为预定义的默认值，这些值可能不为零。

---

# 列表初始化是现代C++中首选的初始化形式

列表初始化（包括值初始化）通常优于其他初始化形式，因为它适用于大多数情况（因此具有最高一致性），禁止类型缩窄转换（这通常是我们不希望发生的），并且支持使用值列表进行初始化（相关内容将在后续课程中讲解）。


> **最佳实践**
> 建议使用直接列表初始化或值初始化来初始化变量。

> **作者注**
> Bjarne Stroustrup（C++ 创建者）和 Herb Sutter（C++ 专家）也建议使用[列表初始化来初始化变量](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-list)。
> 在现代 C++ 中，某些情况下列表初始化可能无法达到预期效果。我们在[第16.2节——std::vector与列表构造函数入门](https://www.cnblogs.com/learncpp/articles/19435146)中探讨过其中一种情况。正因存在此类特性，部分资深开发者如今主张根据具体场景混合使用复制初始化、直接初始化和列表初始化。当您对语言足够熟悉，能理解每种初始化方式的细微差别及相关建议背后的逻辑时，便可自行判断这些论点是否具有说服力。

> **问：何时应使用 { 0 } 初始化，何时应使用 {} 初始化？**
> 当实际使用初始值时，请使用直接列表初始化：
> ```cpp
> int x { 0 };    // direct-list-initialization with initial value 0
> std::cout << x; // we're using that 0 value here
> ```
> 当对象的值是临时且将被替换时，请使用值初始化：
> ```cpp
> int x {};      // value initialization
> std::cin >> x; // we're immediately replacing that value so an explicit 0 would be meaningless
> ```

---

# 初始化变量

在创建变量时进行初始化。你可能会遇到某些特殊情况需要忽略这条建议（例如在性能关键的代码段中大量使用变量），只要这种选择是经过深思熟虑的，完全可以接受。

**相关内容**
关于此主题的更多讨论，Bjarne Stroustrup（C++ 创建者）和 Herb Sutter（C++ 专家）本人在[此处](https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#es20-always-initialize-an-object)给出了相关建议。

在第1.6课——未初始化的变量与未定义行为中，我们将探讨尝试使用未明确定义值的变量会发生什么情况。

> **最佳实践**
> 在创建时初始化变量。

---

# 实例化

**实例化**`instantiation`是一个专业术语，指变量已被创建（分配）并初始化（包括默认初始化）。实例化后的对象有时称为**实例**`instance`。该术语通常用于类类型对象，但偶尔也适用于其他类型的对象。

---

# 初始化多个变量

在上节中，我们提到可以通过用逗号分隔名称的方式，在单个语句中定义多个相同类型的变量：

```cpp
int a, b; // create variables a and b, but do not initialize them
```

我们还注意到，最佳实践是完全避免使用这种语法。然而，由于您可能会遇到其他使用此风格的代码，因此有必要对此进行更深入的讨论——即便只是为了强化您应该避免使用它的理由。

您可以在同一行初始化多个变量：

```cpp
int a = 5, b = 6;          // copy-initialization
int c ( 7 ), d ( 8 );      // direct-initialization
int e { 9 }, f { 10 };     // direct-list-initialization
int i {}, j {};            // value-initialization
```

遗憾的是，这里存在一个常见的陷阱：当程序员错误地试图使用一条初始化语句同时初始化两个变量时，就会发生这种情况：

```cpp
int a, b = 5;     // wrong: a is not initialized to 5!
int a = 5, b = 5; // correct: a and b are initialized to 5
```

在上面的语句中，变量 a 将保持未初始化状态，编译器可能报错也可能不报错。若未报错，这将导致程序间歇性崩溃或产生不稳定的结果。稍后我们将详细讨论使用未初始化变量可能引发的问题。

记住此操作错误的最佳方法是：每个变量只能通过其专属初始化器进行初始化：

```cpp
int a = 4, b = 5; // correct: a and b both have initializers
int a, b = 5;     // wrong: a doesn't have its own initializer
```

---

# 未使用的初始化变量警告

现代编译器通常会在变量被初始化但未被使用时生成警告（因为这种情况很少是可取的）。如果启用了“将警告视为错误”选项，这些警告将被提升为错误并导致编译失败。

请看以下看似无害的程序：

```cpp
int main()
{
    int x { 5 }; // variable x defined

    // but not used anywhere

    return 0;
}
```

使用GCC编译时，若启用“将警告视为错误”选项，将产生以下错误：

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206204228766-1768923604.png)

程序无法编译。

有几种简单的方法可以解决这个问题。

1. 如果该变量确实未使用且不需要，那么最简单的选择是删除 x 的定义（或将其注释掉）。毕竟，如果它没有被使用，删除它就不会影响任何内容。
2. 另一种选择是在某个地方简单地使用该变量：

```cpp
#include <iostream>

int main()
{
    int x { 5 };

    std::cout << x; // variable now used somewhere

    return 0;
}
```

![image](https://img2024.cnblogs.com/blog/1915850/202602/1915850-20260206204458988-156148630.png)

但这需要付出一些努力来编写使用它的代码，并且存在可能改变程序行为的弊端。

---

# [[maybe_unused]]属性（C++17）

在某些情况下，上述两种方案都不理想。试想这样一种情形：我们拥有一组数学/物理值，需要在多个不同程序中使用：

```cpp
#include <iostream>

int main()
{
    // Here's some math/physics values that we copy-pasted from elsewhere
    double pi { 3.14159 };
    double gravity { 9.8 };
    double phi { 1.61803 };

    std::cout << pi << '\n';  // pi is used
    std::cout << phi << '\n'; // phi is used

    // The compiler will likely complain about gravity being defined but unused

    return 0;
}
```

如果我们频繁使用这些常量，很可能已将它们保存到某个位置，通过复制粘贴或批量导入的方式一次性加载。

然而在任何未用到全部常量的程序中，编译器都会针对每个未实际使用的变量发出警告。以上例而言，我们完全可以直接删除重力常量的定义。但如果变量数量从3个激增到20或30个呢？如果这些变量在多个位置被调用呢？逐个检查变量列表以删除/注释掉未使用项既耗时又费力。若后续需要重新启用已删除的变量，还需投入更多时间精力进行回溯操作。

为解决此类问题，C++17引入了[[maybe_unused]]属性，可告知编译器允许变量处于未使用状态。编译器将不再对此类变量生成未使用警告。

以下程序应不会产生任何警告/错误：

```cpp
#include <iostream>

int main()
{
    [[maybe_unused]] double pi { 3.14159 };  // Don't complain if pi is unused
    [[maybe_unused]] double gravity { 9.8 }; // Don't complain if gravity is unused
    [[maybe_unused]] double phi { 1.61803 }; // Don't complain if phi is unused

    std::cout << pi << '\n';
    std::cout << phi << '\n';

    // The compiler will no longer warn about gravity not being used

    return 0;
}
```

此外，编译器很可能会将这些变量优化出程序，因此它们不会影响性能。

[[maybe_unused]] 属性应仅选择性地应用于那些存在特定且合理未使用原因的变量（例如，你需要一个命名值列表，但具体值在给定程序中的实际使用情况可能变化）。否则，未使用变量应从程序中移除。

> **作者注**：
> 后续课程中，为演示特定概念的语法，我们将频繁定义不会再次使用的变量。使用 [[maybe_unused]] 属性可避免编译警告/错误。

---

# 测验时间

问题 #1

初始化与赋值有何区别？

显示解答
```txt
初始化是在变量创建时赋予其初始值的过程。赋值是在变量创建之后某个时间点为其赋值的过程。
```

---

问题 #2

当需要用特定值初始化变量时，应优先采用哪种初始化形式？

显示解答
```cpp
直接列表初始化（又称直接大括号初始化）。
```

---

问题 #3

什么是默认初始化和值初始化？各自的行为特征是什么？应优先选择哪种？

显示解答
```txt
默认初始化是指变量初始化时未提供初始化表达式（例如 int x;）。在大多数情况下，该变量将保留为未确定值。

值初始化是指变量初始化时使用空大括号初始化器（例如 int x{};）。这种情况通常会执行零初始化。

建议优先使用值初始化，因为它能将变量初始化为一致的值。
```
