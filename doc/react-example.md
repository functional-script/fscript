# React example in FScript

```coffee
from react import React, { useState, useEffect }

"""
This is a documentation comment, like
python it documents the current file file.

Let's try to build a simple login form
"""

"""
Let's start building a type wich will contains the
login form props
"""
export type LoginFormProps = {
  email : String
  password : String
  errors : [String]
}

"""
Now let's build the component
"""
export def LoginForm : LoginFormProps -> React.ReactNode
  { email, password, errors } =>
    """
    Let's create a state that will be used to store
    the email value
    """
    def [ email, setEmail ] : [ String, String -> Void ]
      useState email

    """
    Let's do the same thing for the password
    """
    def [ password, setPassword ] : [ String, String -> Void ]
      useState password

    """
    Finally let's build an errors state
    """
    def [ errors, setErrors ] : [ [String] : [String] -> Void ]
      useState errors

    """
    Let's create a change field function that will update
    both password or email using a curried function.

    We can use function pattern matching easily there
    """
    def changeField : String -> React.FormEvent HTMLInputElement -> Void
      "email" { currentTarget: { value } } => setEmail value

      "password" { currentTarget: { value } } => setPassword value

      fieldName ev => console.warn `Undefined field ${fieldName} :/`

    """
    Let's create now the function that will send the login
    form to some API
    """
    def send : React.SyntheticEvent -> Promise Void
      | ?.preventDefault()
      | () => fetch
        process.env.LOGIN_API_URL
        {
          method: "post"
          headers: { "Content-Type": "application/json" }
          body: JSON.strinfify { email, password }
        }
      |then response =>
        if reponse.status is 200 then
          response.json()
        else
          throw response.json()
      |then { token } =>
        console.warn `Get back a token ! ${token}`
      |catch { message } =>
        setErrors [ message ]

    """
    Now we can return some JSX using jspub syntax for example
    """
    jspug`
      form(
        method="post"
        action={process.env.LOGIN_URL}
        onSubmit={send}
      )
        div(class="form-control")
          input(
            type="email"
            id="email"
            value={email}
            placeholder="your.email@mail.com"
            onChange={changeField "email"}
          )
          label(
            for="email"
          )
            Your email:

        div(class="form-control")
          input(
            type="password"
            id="password"
            value={password}
            onChange={changeField "password"}
          )
          label(
            for="password"
          )
            Your password:

        div(class="form-control")
          button(type="submit", class="btn btn-primary")
            Login
    `


```