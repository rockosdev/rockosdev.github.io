---
title:              "《Learn C++》笔记 0.13 我的编译器使用的是哪种语言标准？"
date:               2026-06-10 20:08:52
last_modified_at:   2026-06-10 20:08:52
toc:                true
categories:         [C++, 00 Introduction/Getting Started]
tags:               [cpp, what-language-standard-is-my-compiler-using]
---

以下程序旨在打印您编译器当前使用的语言标准名称。您可以复制粘贴、编译并运行此程序，以验证您的编译器是否使用了预期的语言标准。

PrintStandard.cpp：
```cpp
// This program prints the C++ language standard your compiler is currently using
// Freely redistributable, courtesy of learncpp.com (https://www.learncpp.com/cpp-tutorial/what-language-standard-is-my-compiler-using/)

#include <iostream>

const int numStandards = 7;
// The C++26 stdCode is a placeholder since the exact code won't be determined until the standard is finalized
const long stdCode[numStandards] = { 199711L, 201103L, 201402L, 201703L, 202002L, 202302L, 202612L};
const char* stdName[numStandards] = { "Pre-C++11", "C++11", "C++14", "C++17", "C++20", "C++23", "C++26" };

long getCPPStandard()
{
    // Visual Studio is non-conforming in support for __cplusplus (unless you set a specific compiler flag, which you probably haven't)
    // In Visual Studio 2015 or newer we can use _MSVC_LANG instead
    // See https://devblogs.microsoft.com/cppblog/msvc-now-correctly-reports-__cplusplus/
#if defined (_MSVC_LANG)
    return _MSVC_LANG;
#elif defined (_MSC_VER)
    // If we're using an older version of Visual Studio, bail out
    return -1;
#else
    // __cplusplus is the intended way to query the language standard code (as defined by the language standards)
    return __cplusplus;
#endif
}

int main()
{
    long standard = getCPPStandard();

    if (standard == -1)
    {
        std::cout << "Error: Unable to determine your language standard.  Sorry.\n";
        return 0;
    }

    for (int i = 0; i < numStandards; ++i)
    {
        // If the reported version is one of the finalized standard codes
        // then we know exactly what version the compiler is running
        if (standard == stdCode[i])
        {
            std::cout << "Your compiler is using " << stdName[i]
                << " (language standard code " << standard << "L)\n";
            break;
        }

        // If the reported version is between two finalized standard codes,
        // this must be a preview / experimental support for the next upcoming version.
        if (standard < stdCode[i])
        {
            std::cout << "Your compiler is using a preview/pre-release of " << stdName[i]
                << " (language standard code " << standard << "L)\n";
            break;
        }
    }

    return 0;
}
```

---

# 构建或运行时问题

若在构建过程中遇到错误，可能是项目配置不正确。请参阅[0.8节——常见C++问题]({% link _posts/cpp/2026-04-07-a-few-common-cpp-problems0008.md %})，获取相关建议。若仍未解决，请从[0.6节——安装集成开发环境（IDE）]({% link _posts/cpp/2026-03-23-installing-an-integrated-development-environment-ide-0006.md %})开始重新检查教程。

若程序输出“错误：无法确定语言标准”，则编译器可能不符合规范。若使用主流编译器仍出现此情况，请在下方留言提供相关信息（如编译器名称及版本）。

若程序输出的语言标准与预期不符：

* 检查IDE设置，确保编译器配置为使用预期语言标准。详见[0.12节——配置编译器：选择语言标准]({% link _posts/cpp/2026-05-18-configuring-your-compiler-choosing-a-language-standard-0012.md %})，了解主流编译器的具体操作方法。确保配置文件无拼写或格式错误。部分编译器需为每个项目单独设置语言标准而非全局配置，若您刚创建新项目则可能属于此情况。
* 您的IDE或编译器可能根本未读取您编辑的配置文件（我们偶尔收到VS Code用户的此类反馈）。若怀疑此情况，请查阅IDE或编译器的文档。

> **问：若编译器使用预览/预发布版本，是否应降级？**:
若您正处于语言学习阶段，无需降级。但需注意：新版本语言的部分特性可能存在缺失、不完善、存在缺陷或可能发生细微变更。
 
