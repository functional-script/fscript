# Example of AST generation

```coffee
export def add :: Number -> Number -> Number
  x y => x + y

def x :: Number = add 3 4

export x
```

```yaml
type: BLOCK
children:
  - type: EXPORT
    children:
      - type: ASSIGNEMENT
        keyword: def
        identifier: add
        children:
          - type: TYPING
            children:
              - { type: TYPE_ID, value: Number }
              - { type: TYPE_ID, value: Number }
              - { type: TYPE_ID, value: Number }
          - type: FUNCTION
            children:
              - type: FUNCTION_ARGUMENTS
                children:
                  - { type: ARG, value: x }
                  - { type: ARG, value: y }
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
    children:
      - type: TYPING
        children:
          - { type: TYPE_ID, value: Number }
      - type: CHAIN
        children:
          - { type: ID, value: add }
          - { type: NUMBER_LITERAL, value: 3 }
          - { type: NUMBER_LITERAL, value: 4 }
          - { type: END_CHAIN }
  - type: EXPORT
    children:
      - { type: ID, value: x }
```
