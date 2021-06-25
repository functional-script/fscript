# FScript [![travis status](https://travis-ci.com/functional-script/fscript.svg?token=pzmxhVJ66YPJNpcBzfcR&branch=master)](https://travis-ci.com/functional-script/fscript.svg?token=pzmxhVJ66YPJNpcBzfcR&branch=master)

FScript (Functional Script) is a programming langage inspired
by the ML familly wich compiles to JavaScript or TypeScript.

## Specification

In FScript code are made to be simple and very lightweight
in syntax.

## AST examples

- [Example of ast generation](./doc/ast.md)

### Variables

You can declare variables and attach values and types
easily. Note that any declared variable use the "const"
keyword because fscript is made to be **immutable**.

```coffee
# Declare a constant
surname = "Jonny"

# Declare a number
def age : Number = 30

# Declare a string
def name : String = "John"

# Declare a boolean
def isMajor : Boolean = true
```

Wich compiles to

```typescript
const surname = 'Jonny'

const age: number = 30

const name: string = 'John'

const isMajor: boolean = true
```

You can also declare Array and objet using the following
syntax:

```coffee
# Declare an array of number
def notes : [Number] = [ 12, 13, 14, 19 ]

# Declare an array of string using the
# generic syntax
def students : Array String = [ "john", "Elly", "Jane" ]

# Create an objet
def john = { firstname: "John",  lastname: "Doe" }

# Create an objet in multiline using the "Type"
# keyword meaning "typeof". Note that no comma
# are needed in multiline
def jane : TypeOf john = {
  firstname: "Jane"
  lastname: "Doe"
}
```

The following code compiles to

```typescript
const notes: Array<number> = [12, 13, 14, 19]

const students: Array<string> = ['john', 'Elly', 'Jane']

const john = { firstname: 'John', lastname: 'Doe' }

const jane: typeof john = {
  firstname: 'Jane',
  lastname: 'Doe',
}
```

### Desructuring Array and Objects

In fscript, like in javascript you can
destructure arrays and objets

```coffee
def user = {
  firstname: "John"
  lastname: "Doe"
}

def { firstname, lastname } = user

console.log firstname, lastname

# Or with aliases

def { firstname: fname, lastname: lname } = user

console.log fname, lname

# You can also put default values
def { age = 30 } = user
console.log age

# The rest operator
def { lastname, ...rest } = user

console.log rest.firstname

# Same exists with array
def [ first, second, ...rest ] = [ 13, 14, 19, 16 ]
```

### Declaring and using functions

The main point of fscript is the lightweight and very powerfull
function declaration and usage

Let's take a tour of basic function definitions:

#### The basics

```coffee
# A basic hello function
def hello : String -> String = name => `Hello ${name}`

# Calling the hello function. Parenthesis arn't
# needed !
hello("John")
# Same as
hello "John"

# Calling function in a function
console.log(hello("John"))
# or
console.log hello "John"

# A basic add function but using the
# multiline syntax. Note the the "=" sign is not
# needed, tabulation replaced it.
# Return values are automatically returned !
def add : Number -> Number -> Number
  x y => x + y

add(3, 4)
add 3, 4
# When working with native types (String, Number, Boolean,
# RegExp, Array or Objet), no comma are needed between parameters
add 3 4

# Function are automatically curried
def add3 : Number -> Number = add 3

# Or with the multine syntax
def add3 : Number -> Number
  add 3

def x : Number = add3 5

def y : Number = add 3, 5

def y2 : Number = add 3 5

console.log x, y

# You can also make function returning nothing
# using the "Void" type
def log : String -> Void
  member =>
    console.log member
    10

# Finally, if you want fscript to force uncurried
# function you can use parenthesis into your signature
def uncurriedAdd : (Number, Number) -> Number
  x y => x + y

# Async function are automatically detected when
# returning Promise !
def promise : Promise String = Promise.resolve "test"

def helloPromise : Promise String -> Promise String
  p =>
    def name = await p
    `Hello ${name.toUpperCase()}`

def f : Promise String -> Promise String
  (await name) => name.toUpperCase()

def g : Promise String -> Promise String
  (await name) => name.replace /John/g "Jean"

def t : Promise String -> Promise String
  (await name) => name.replace /Doe/g "Dupont"

def foo : Promise String -> Promise String
  g >> t >> f

def foo2 : Promise String -> Promise String
  (await name) =>
    name
    |> n => n.replace /John/g "Jean"
    |> () => ?.replace /Doe/g "Dupont"
    |> ?.replace /Doe/g "Dupont"
    |> ?.toUpperCase()

foo Promise.resolve "John Doe" # Promise "JEAN DUPONT"
```

#### Pattern Matching

In fscript any function introduce a powerfull pattern
matching system :

```coffee
def greatings : String -> String
  "John" => "Hey John !"
  "Jane" => "Greatings dear Jane"
  otherName => `Hello ${otherName}`

# You can also add special conditions into
# your pattern matching using the "|" character
# wich acts like a where !
def specialAdd : Number -> Number -> Number
  x y | x > 10 and y < 9 =>
    (x + 10) + (y * 20)
  x y => x + y
```

### Declaring types and interfaces

In fscript, like typescript, types and interfaces
are declared using the "interfaces" and "types"
keyword

```coffee
# No comma are needed if multiline
type User
  username : String
  password : String

# You can also easily sign functions
type Greatable
  ...User
  # Here Void stands for "no argument"
  greating : Void -> String

# Like typescript you can type functions
# and add polymorphic signature by simply
# using parenthesis
type Add
  (Number -> Number -> Number)

  ((Number, Number) -> Number)

  toString : Void -> String

type Console
  log : Void -> Void

  warn : Void -> Void

  error : Void -> Void

type Something
  | Console
  | User

def console : Console = window.console
```

### Generics

In fscript, generics are also supported but with
some differences

```coffee
# Generics are in lowercase. Here
# a is a generic of any type
type Collection a
  find : String -> Collection(a)

  # parenthesis are optional
  all : Void -> Collection a

# It's also possible to specify a type
# wich generics must extends of
type Identifiable User a
  getSubject : Void -> a

# Generics can also be declared into functions.
# They are declare just before the signature and
# separed by a "."
def add : a. a -> a -> a
  x y => x + y

# Extends also works there
type Lengthwise
  length : Number

# No need of parenthesis when using function
# signature and generic extension
def length : Lengthwise a. a -> Number
  subject => subject.length

# You can also use the "KeyOf" special type
def get
  : Object subject
  , (KeyOf subject) key
  , data
  . key -> subject -> data
  = key subject => subject[key]

def user = { firstname: "john" }

get 'firstname' user # "john"

# You can also specify generics in the fonction
# call (same syntax as typescript)
get<TypeOf user, 'firstname', String> user, 'firstname'

type Collection
  [String] : Number

type User
  firstname : String

  lastname : String

type Test (KeyOf User) a
  [a] : Boolean

type Test
  [`get${UpFirst KeyOf User}` a. a] : Boolean

type Test a
  [`get${UpFirst KeyOf a}`] : Boolean

def keys : Test User = {
  getFirstname: true
  getLastname: false
}
```
