# FScript &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/functional-script/fscript/blob/master/LICENSE) [![CircleCI](https://circleci.com/gh/functional-script/fscript/tree/master.svg?style=svg)](https://circleci.com/gh/functional-script/fscript/tree/master)

FScript (Functional Script) is a programming langage inspired
by the ML familly wich compiles to JavaScript or TypeScript.

## Specification

In FScript code are made to be simple and very lightweight
in syntax. Inspired by Python and Haskell it allows to write
functional and easy to read code base.

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
def age :: Number = 30

# Declare a string
def name :: String = "John"

# Declare a boolean
def isMajor :: Boolean = true
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
def notes :: Number[] = [ 12, 13, 14, 19 ]

# Declare an array of string using the
# generic syntax
def students :: Array(String) = [ "john", "Elly", "Jane" ]

# Note that parenthesis are optional !
def students :: Array String = [ "John", "Elly", "Jane" ]

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
def hello :: String -> String = name => `Hello ${name}`

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
def add :: Number -> Number -> Number
  x y => x + y

add(3, 4)
add 3, 4
# When working with native types (String, Number, Boolean,
# RegExp, Array or Objet), no comma are needed between parameters
add 3 4

# Function are automatically curried
def add3 :: Number -> Number = add 3

# Or with the multine syntax
def add3 :: Number -> Number
  add 3

def x :: Number = add3 5

def y :: Number = add 3, 5

def y2 :: Number = add 3 5

console.log x, y

# You can also make function returning nothing
# using the "Nothing" type
def log :: String -> Nothing
  member =>
    console.log member
    10

# Finally, if you want fscript to force uncurried
# function you can use parenthesis into your signature
def uncurriedAdd :: (Number, Number) -> Number
  x y => x + y

# Async function are automatically detected when
# returning Promise !
def promise :: Promise String = Promise.resolve "test"

def helloPromise :: Promise String -> Promise String
  p =>
    def name = await p
    `Hello ${name.toUpperCase()}`

def f :: Promise String -> Promise String
  (await name) => name.toUpperCase()

def g :: Promise String -> Promise String
  (await name) => name.replace /John/g "Jean"

def t :: Promise String -> Promise String
  (await name) => name.replace /Doe/g "Dupont"

def foo :: Promise String -> Promise String
  g >> t >> f

def foo2 :: Promise String -> Promise String
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
def greatings :: String -> String
  "John" => "Hey John !"
  "Jane" => "Greatings dear Jane"
  otherName => `Hello ${otherName}`

# You can also add special conditions into
# your pattern matching using the "|" character
# wich acts like a where !
def specialAdd :: Number -> Number -> Number
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
type User = {
  username :: String
  password :: String
}

# You can also easily sign functions
type Greatable = User & {
  # Here Void stands for "no argument"
  greating :: Void -> String
}

# Like typescript you can type functions
# and add polymorphic signature by simply
# using parenthesis
type Add = {
  (Number -> Number -> Number)

  ((Number, Number) -> Number)

  toString :: Void -> String
}


type Console = {
  log :: Void -> Void

  warn :: Void -> Void

  error :: Void -> Void
}

type Something =
  | Console
  | User

def console :: Console = window.console

# You can also defined piped types
def member :: String | Number = 10 # This is valid
def secondMember :: String | Number = false # Error: boolean is not a string or a number


# You can also use predicates in order to know
# wich types you wanna use. the isType operator
# operates like a typeof but with more power on it
def isNumber :: String | Number -> Is Number
  x => x isType Number

# This is a complexe example of a map function
def map :: in, out. (in -> out) -> in[] -> out[]
  f arr => arr.map f

map (a => a.toUppercase()) [ 'foo', 'bar' ]
# or with a pipe operator
[ 'foo', 'bar' ] |> map (a => a.toUppercase())
# or with the special ? operator
[ 'foo', 'bar' ] |> map ?.toUppercase()

# Or with a special combine
def combine :: a. a[] -> a[] -> a[]
  a b => a.concat b

combine ['foo'] ['bar'] # Output: [ 'foo', 'bar' ]
combine ['foo'] [ 10 ] # Error !
combine:String | Number: [ 'foo' ] [ 10 ] # Output: [ 'foo', 10 ]


[ 'foo', 'bar' ]
|> map ?.toUppercase()
|> combine:String|Number: [ 19, 20 ]

# You can also declare optional parameters wich
# is exaclty the same thing as "Number | Nothing"
def specialAdd :: Number? -> Number
  x => if x isType Nothing then 0 else x
```

### Generics

In fscript, generics are also supported but with
some differences

```coffee

# Generics are in lowercase. Here
# a is a generic of any type
def identity :: a. a -> a
  a => a

console.warn identity "test" # Output: "test"
console.warn identity:Boolean: true # Output: true
console.warn identity:String: 10 # Error: 10 is not a String


# It's also possible to specify a type
# wich generics must extends of
type Lengthwise = {
  length :: Number | String
}

def loggingIdentity :: Lengthwise a. a -> a
  a =>
    console.log a.length
    a

loggingIdentity "test" # Output: 4 and "test"

# We can also use generics with the special KeyOf
# operators
def getProperty :: someObject, (keyof someObject) key. key -> someObject -> someObject[key]
  key object => object[key]

# No need of parenthesis when using function
# signature and generic extension
def length :: Lengthwise a . a -> Number
  subject => subject.length

# You can also use the "KeyOf" special type
def get :: Object subject, (KeyOf subject) key, data. key -> subject -> data
  = key subject => subject[key]

def user = { firstname: "john" }

get 'firstname' user # "john"

# You can also specify generics in the fonction
# call (same syntax as typescript)
get:TypeOf user, 'firstname', String: user, 'firstname'

type Collection = {
  [String] :: Number
}

type User = {
  firstname :: String

  lastname :: String
}

type Test (KeyOf User) a = {
  [a] :: Boolean
}

type Test = {
  [`get${UpFirst KeyOf User}` a. a] :: Boolean
}

type Test a = {
  [`get${UpFirst KeyOf a}`] :: Boolean
}

def keys :: Test User = {
  getFirstname: true
  getLastname: false
}
```
