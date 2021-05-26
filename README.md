# FScript

FScript (Functional Script) is a programming langage inspired
by the ML familly wich compiles to JavaScript or TypeScript.

## Example of FScript

In FScript, variables are declared like this:

```fscript
add : number -> number -> number = x y => x + y

substract : number -> number -> number
    x y => x - y

add 2 3 // 5
substract (add 3 4) 6 // 1

add3 = add 3

add3 5 // 8

names = [ 'john', 'jane', 'jack', 'paul' ]
otherName = [
    'john'
    'jane'
    'jack'
    'paul'
]
otherNames2 =
    - 'john'
    - 'jane'
    - 'jack'
    - 'paul'

toUpper : string => string = x => x.toUpperCase!

names.map toUpper // [ 'JOHN', 'JANE', 'JACK', 'PAUL' ]

type User = {
    firstname : string
    lastname : string
    age : number
    notes ?: [number]
}

user : User = {
    firstname: 'Jean'
    lastname: 'Dupont'
    age: 43
    notes: [ 12, 18, 17 ]
}

secondUser : User =
    firstname: 'Jean'
    lastname: 'Dupont'
    age: 43
    notes:
        - 12
        - 18
        - 17

displayUser : User -> string
    { firstname, lastname, age } =>
        `$firstname $lastname, you are $age years old`

[ firstName, secondName, ...restNames ] = names
{ firstname: superName } = user

console.log superName // 'Jean'
console.log firstName // 'john'

class Test implements User
    @ : string
        @name =>

    display : string -> string
        "Full Size" =>
            `Full Size : ${@name}`
        _ => @name

testGeneric : a. a -> a -> a
    x y => x + y

testGeneric : User a. a -> a -> a
    { firstname as name1, restas user1 } { firstname as name2, restas user2 } =>
        fullName = `$name1 $name2`

        firstname: fullName
        fillwith user2

const testGeneric : <T extends User>F2<T, T, T> => f2((x, y) => {
    return
})


data Maybe a =
    Just a
    Nothing

maybeYes = Just true

isIsTrue : Maybe bool -> bool
    (Just true) => true
    Nothing => false


```

This code compiles to
