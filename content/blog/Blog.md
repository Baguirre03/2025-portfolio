---
title: Testing Programming Langauges
date: 2025-10-05
excerpt: Just seeing if my markdown is formatted correctly
---

### JavaScript

```js
const hello = "hi";
const testFunc = () => {
  for (let i = 0; i < hello.length; i++) {
    console.log("test!!");
  }
};
```

### Python

```python
hello = "hi"
def test_func():
	for i in range(len(list(hello))):
		print(f"test: {i}!")
```

### C++

```cpp
#include <iostream>
#include <string>

int main() {
    std::string hello = "hi";
    for (int i = 0; i < hello.size(); i++) {
        std::cout << "test: " << i << "!" << std::endl;
    }
    return 0;
}
```

### Java

```java
public class Main {
    public static void main(String[] args) {
        String hello = "hi";
        testFunc(hello);
    }

    static void testFunc(String hello) {
        for (int i = 0; i < hello.length(); i++) {
            System.out.println("test: " + i + "!");
        }
    }
}

```

### Go

```go
package main

import "fmt"

func testFunc() {
	hello := "hi"
	for i := 0; i < len(hello); i++ {
		fmt.Printf("test: %d!\n", i)
	}
}

func main() {
	testFunc()
}
```

### Rust

```rust
fn test_func() {
    let hello = "hi";
    for i in 0..hello.len() {
        println!("test: {}!", i);
    }
}

fn main() {
    test_func();
}

```
