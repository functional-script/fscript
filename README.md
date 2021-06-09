# FScript

FScript (Functional Script) is a programming langage inspired
by the ML familly wich compiles to JavaScript or TypeScript.

## Specification

In FScript code are made to be simple and very lightweight
in syntax.

### Variables

You can declare variables and attach values and types
easily. Note that any declared variable use the "const"
keyword because fscript is made to be **immutable**.

```fscript
// Declare a constant
surname = "Jonny"

// Declare a number
age : Number = 30

// Declare a string
name : String = "John"

// Declare a boolean
isMajor : Boolean = true
```

Wich compiles to

```typescript
const surname = "Jonny";

const age: number = 30;

const name: string = "John";

const isMajor: boolean = true;
```

You can also declare Array and objet using the following
syntax:

```fscript
// Declare an array of number
notes : [Number] = [ 12, 13, 14, 19 ]

// Declare an array of string using the
// generic syntax
students : Array String = [ "john", "Elly", "Jane" ]

// Create an objet
john = { firstname: "John",  lastname: "Doe" }

// Create an objet in multiline using the "Type"
// keyword meaning "typeof". Note that no comma
// are needed in multiline
jane : Type john = {
  firstname: "Jane"
  lastname: "Doe"
}
```

The following code compiles to

```typescript
const notes: Array<number> = [12, 13, 14, 19];

const students: Array<string> = ["john", "Elly", "Jane"];

const john = { firstname: "John", lastname: "Doe" };

const jane: typeof john = {
  firstname: "Jane",
  lastname: "Doe",
};
```

### Desructuring Array and Objects

In fscript, like in javascript you can
destructure arrays and objets

```fscript
user = {
  firstname: "John"
  lastname: "Doe
}

{ firstname, lastname } = user

console.log firstname, lastname

// Or with aliases

{ firstname: fname, lastname: lname } = user

console.log fname, lname

// You can also put default values
{ age = 30 } = user
console.log age

// The rest operator
{ lastname, ...rest } = user

console.log rest.firstname

// Same exists with array
[ first, second, ..rest ] = [ 13, 14, 19, 16 ]
```

### Declaring and using functions

The main point of fscript is the lightweight and very powerfull
function declaration and usage

Let's take a tour of basic function definitions:

#### The basics

```fscript
// A basic hello function
hello : String -> String = name => `Hello ${name}`

// Calling the hello function. Parenthesis arn't
// needed !
hello("John")
// Same as
hello "John"

// Calling function in a function
console.log(hello("John"))
// or
console.log hello "John"

// A basic add function but using the
// multiline syntax. Note the the "=" sign is not
// needed, tabulation replaced it.
// Return values are automatically returned !
add : Number -> Number -> Number
  x y => x + y

add(3, 4)
add 3, 4
// When working with native types (String, Number, Boolean,
// RegExp, Array or Objet), no comma are needed between parameters
add 3 4

// Function are automatically curried
add3 : Number -> Number = add 3

// Or with the multine syntax
add3 : Number -> Number
  add 3

x : Number = add3 5

y : Number = add 3, 5

y : Number = add 3 5

console.log x, y

// You can also make function returning nothing
// using the void keyword and type
log : String -> Void
  member =>
    console.log member
    void

// Finally, if you want fscript to force uncurried
// function you can use parenthesis into your signature
uncurriedAdd : (Number, Number) -> Number
  x y => x + y
```

#### Pattern Matching

In fscript any function introduce a powerfull pattern
matching system :

```fscript
greatings : String -> String
  "John" => "Hey John !"
  "Jane" => "Greatings dear Jane"
  otherName => `Hello ${otherName}`

// You can also add special conditions into
// your pattern matching using the "|" character
// wich acts like a where !
specialAdd : Number -> Number -> Number
  x y | x > 10 and y < 9 =>
    (x + 10) + (y * 20)
  x y => x + y
```

### Declaring types and interfaces

This code compiles to
