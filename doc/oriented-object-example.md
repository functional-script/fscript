# OOP Examples in FScript

This is a simple oriented object example

```coffee
# Character.fsc
"""
Let's try building some simple class like
a character in a RPG game with some life
and more
"""
export class Character
  protected name :: String

  protected life :: Number

  protected maxLife :: Number

  protected attack :: Number

  """
  Now let's make a bounded constructor using
  the ~> typing operator
  """
  public constructor
    :: Character
    ~> String -> Number -> Number -> Character
      @name @maxLife @attack =>
        @life = @maxLife

  """
  Create a special health getter
  """
  public get health :: Character ~> Void -> Number
    () => @life

  """
  Creates a special getter to know if a
  character is dead or not
  """
  public get dead :: Character ~> Void -> Boolean
    () => @life <= 0

  """
  Creates the ability to attack an other Character.

  Note that fluent api are automatically detected,
  no need to return "this" (@)
  """
  public attack :: Character ~> Character -> Character
    victim => victim.life -= @attack

  """
  Creates a method wich restore some health
  """
  public restore :: Character ~> Number -> Character
    health => @life += health

  """
  Finally let's create a method that will print the
  character
  """
  public toString :: Character ~> Void -> String
    () => `Character ${@name} (Life: ${@life}, Attack: ${@attack})`
```

Now let's import and use this Character

```coffee
# Game.fsc
from Character import { Character }

"""
This function contains the game
"""
def main :: Void -> Void
  () =>
    def arthur = Character "Arthur" 100 30
    def merlin = Character "Merlin" 70 50

    console.log `${arthur}`
    console.log `${merlin}`
    console.log "Arthur attack merlin !"
    arthur.attack merlin
    console.log `${arthur}`
    console.log `${merlin}`

if require.main is module
  main()
```
