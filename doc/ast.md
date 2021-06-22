# Example of AST generation

```coffee
def add : Number -> Number -> Number
  x y => x + y

def x : Number = add 3 4
```

```yaml
type: BLOCK
children:
  - type: ASSIGNEMENT
    keyword: def
    identifier: add
    typing:
      - { type: TYPE_ID, value: Number }
      - { type: TYPE_ID, value: Number }
      - { type: TYPE_ID, value: Number }
    children:
      - type: FUNCTION
        arguments:
          - { type: ID, value: x }
          - { type: ID, value: y }
        children:
          - type: BLOCK
            children:
              - type: OPERATION
                operator: +
                left:
                  - { type: ID, value: x }
                right:
                  - { type: ID, value: y }
  - type: ASSIGNEMENT
    keyword: def
    identifier: x
    typing:
      - { type: TYPE_ID, value: Number }
    children:
      - type: CHAIN
        children:
          - { type: ID, value: add }
          - { type: NUMBER_LITERAL, value: 3 }
          - { type: NUMBER_LITERAL, value: 4 }
          - { type: END_CHAIN, call: false }
```
