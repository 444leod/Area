---
title: AREA API v0.0
language_tabs:
  - javascript: JavaScript
  - python: Python
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2
---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="area-api">AREA API v0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

The AREA API allows the creation of actions-reactions on multiple services.

Base URLs:

<h1 id="area-api-auth">Auth</h1>

## AuthController_login

<a id="opIdAuthController_login"></a>

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": [
    "email",
    "password"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/auth/login', headers = headers)

print(r.json())

```

`POST /auth/login`

> Body parameter

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": ["email", "password"]
}
```

<h3 id="authcontroller_login-parameters">Parameters</h3>

| Name | In   | Type                                | Required | Description |
| ---- | ---- | ----------------------------------- | -------- | ----------- |
| body | body | [UserLoginDto](#schemauserlogindto) | true     | none        |

<h3 id="authcontroller_login-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none        | None   |

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleAuth

<a id="opIdAuthController_googleAuth"></a>

> Code samples

```javascript
fetch("/auth/google", {
  method: "GET",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests

r = requests.get('/auth/google')

print(r.json())

```

`GET /auth/google`

<h3 id="authcontroller_googleauth-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none        | None   |

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleAuthRedirect

<a id="opIdAuthController_googleAuthRedirect"></a>

> Code samples

```javascript
fetch("/auth/google/callback", {
  method: "GET",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests

r = requests.get('/auth/google/callback')

print(r.json())

```

`GET /auth/google/callback`

<h3 id="authcontroller_googleauthredirect-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none        | None   |

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_register

<a id="opIdAuthController_register"></a>

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": [
    "email",
    "password"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Content-Type': 'application/json'
}

r = requests.post('/auth/register', headers = headers)

print(r.json())

```

`POST /auth/register`

> Body parameter

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": ["email", "password"]
}
```

<h3 id="authcontroller_register-parameters">Parameters</h3>

| Name | In   | Type                                              | Required | Description |
| ---- | ---- | ------------------------------------------------- | -------- | ----------- |
| body | body | [UserRegistrationDto](#schemauserregistrationdto) | true     | none        |

<h3 id="authcontroller_register-responses">Responses</h3>

| Status | Meaning                                                      | Description | Schema |
| ------ | ------------------------------------------------------------ | ----------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2) | none        | None   |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="area-api-users">Users</h1>

## UsersController_getUserProfile

<a id="opIdUsersController_getUserProfile"></a>

> Code samples

```javascript
fetch("/users/profile", {
  method: "GET",
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests

r = requests.get('/users/profile')

print(r.json())

```

`GET /users/profile`

<h3 id="userscontroller_getuserprofile-responses">Responses</h3>

| Status | Meaning                                                 | Description | Schema |
| ------ | ------------------------------------------------------- | ----------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none        | None   |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="area-api-areas">Areas</h1>

## AreasController_createArea

<a id="opIdAreasController_createArea"></a>

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "action": {
      "type": "object"
    },
    "reaction": {
      "type": "object"
    }
  },
  "required": [
    "action",
    "reaction"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'authorization':{
  "type": "string"
}
};

fetch('/areas',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'authorization': {
  "type": "string"
}
}

r = requests.post('/areas', headers = headers)

print(r.json())

```

`POST /areas`

> Body parameter

```json
{
  "type": "object",
  "properties": {
    "action": {
      "type": "object"
    },
    "reaction": {
      "type": "object"
    }
  },
  "required": ["action", "reaction"]
}
```

<h3 id="areascontroller_createarea-parameters">Parameters</h3>

| Name          | In     | Type                                      | Required | Description                                         |
| ------------- | ------ | ----------------------------------------- | -------- | --------------------------------------------------- |
| authorization | header | string                                    | true     | User API token, given at user login. (Bearer token) |
| body          | body   | [AreaCreationDto](#schemaareacreationdto) | true     | none                                                |

> Example responses

> 201 Response

```json
{
  "active": true,
  "action": {
    "service_id": "deadbeefdeadbeefdeadbeef",
    "informations": {
      "type": "EXAMPLE_TYPE",
      "field": "exampleFieldData"
    }
  },
  "reaction": {
    "service_id": "deadbeefdeadbeefdeadbeef",
    "informations": {
      "type": "EXAMPLE_TYPE",
      "field": "exampleFieldData"
    }
  }
}
```

<h3 id="areascontroller_createarea-responses">Responses</h3>

| Status | Meaning                                                         | Description                              | Schema |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ |
| 201    | [Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)    | The AREA was successfully created.       | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No token provided, or token isn't valid. | None   |

<h3 id="areascontroller_createarea-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AreasController_getUserAreas

<a id="opIdAreasController_getUserAreas"></a>

> Code samples

```javascript
const headers = {
  Accept: "application/json",
  authorization: {
    type: "string",
  },
};

fetch("/areas", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests
headers = {
  'Accept': 'application/json',
  'authorization': {
  "type": "string"
}
}

r = requests.get('/areas', headers = headers)

print(r.json())

```

`GET /areas`

<h3 id="areascontroller_getuserareas-parameters">Parameters</h3>

| Name          | In     | Type   | Required | Description                                     |
| ------------- | ------ | ------ | -------- | ----------------------------------------------- |
| authorization | header | string | true     | User API token, given at Log-In. (Bearer token) |

> Example responses

> 200 Response

```json
[
  {
    "_id": "deadbeefdeadbeefdeadbeef",
    "active": true,
    "action": {
      "service_id": "deadbeefdeadbeefdeadbeef",
      "informations": {
        "type": "EXAMPLE_TYPE",
        "field": "exampleFieldData"
      }
    },
    "reaction": {
      "service_id": "deadbeefdeadbeefdeadbeef",
      "informations": {
        "type": "EXAMPLE_TYPE",
        "field": "exampleFieldData"
      }
    }
  },
  {
    "_id": "...",
    "active": false,
    "action": {},
    "reaction": {}
  }
]
```

<h3 id="areascontroller_getuserareas-responses">Responses</h3>

| Status | Meaning                                                         | Description                              | Schema |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | The data was successfully fetched.       | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No token provided, or token isn't valid. | None   |

<h3 id="areascontroller_getuserareas-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AreasController_getAreaById

<a id="opIdAreasController_getAreaById"></a>

> Code samples

```javascript
const headers = {
  Accept: "application/json",
  authorization: {
    type: "string",
  },
};

fetch("/areas/{id}", {
  method: "GET",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests
headers = {
  'Accept': 'application/json',
  'authorization': {
  "type": "string"
}
}

r = requests.get('/areas/{id}', headers = headers)

print(r.json())

```

`GET /areas/{id}`

<h3 id="areascontroller_getareabyid-parameters">Parameters</h3>

| Name          | In     | Type   | Required | Description                                         |
| ------------- | ------ | ------ | -------- | --------------------------------------------------- |
| id            | path   | string | true     | none                                                |
| authorization | header | string | true     | User API token, given at user login. (Bearer token) |

> Example responses

> 200 Response

```json
{
  "_id": "deadbeefdeadbeefdeadbeef",
  "active": true,
  "action": {
    "is_webhook": false,
    "service_id": "deadbeefdeadbeefdeadbeef",
    "informations": {
      "type": "EXAMPLE_TYPE",
      "field": "exampleFieldData"
    },
    "history": {
      "type": "EXAMPLE_TYPE",
      "exampleHistory": []
    }
  },
  "reaction": {
    "service_id": "deadbeefdeadbeefdeadbeef",
    "informations": {
      "type": "EXAMPLE_TYPE",
      "field": "exampleFieldData"
    }
  }
}
```

<h3 id="areascontroller_getareabyid-responses">Responses</h3>

| Status | Meaning                                                         | Description                              | Schema |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | The data was successfully fetched.       | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No token provided, or token isn't valid. | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | User's AREA Not found.                   | None   |

<h3 id="areascontroller_getareabyid-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## AreasController_deleteAreaById

<a id="opIdAreasController_deleteAreaById"></a>

> Code samples

```javascript
const headers = {
  authorization: {
    type: "string",
  },
};

fetch("/areas/{id}", {
  method: "DELETE",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests
headers = {
  'authorization': {
  "type": "string"
}
}

r = requests.delete('/areas/{id}', headers = headers)

print(r.json())

```

`DELETE /areas/{id}`

<h3 id="areascontroller_deleteareabyid-parameters">Parameters</h3>

| Name          | In     | Type   | Required | Description                                         |
| ------------- | ------ | ------ | -------- | --------------------------------------------------- |
| id            | path   | string | true     | none                                                |
| authorization | header | string | true     | User API token, given at user login. (Bearer token) |

<h3 id="areascontroller_deleteareabyid-responses">Responses</h3>

| Status | Meaning                                                         | Description                              | Schema |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Content was successfully deleted.        | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No token provided, or token isn't valid. | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | User's AREA Not found.                   | None   |

<aside class="success">
This operation does not require authentication
</aside>

## AreasController_toggleArea

<a id="opIdAreasController_toggleArea"></a>

> Code samples

```javascript
const headers = {
  authorization: {
    type: "string",
  },
};

fetch("/areas/{id}/toggle", {
  method: "PATCH",

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

```python
import requests
headers = {
  'authorization': {
  "type": "string"
}
}

r = requests.patch('/areas/{id}/toggle', headers = headers)

print(r.json())

```

`PATCH /areas/{id}/toggle`

<h3 id="areascontroller_togglearea-parameters">Parameters</h3>

| Name          | In     | Type   | Required | Description                                         |
| ------------- | ------ | ------ | -------- | --------------------------------------------------- |
| id            | path   | string | true     | none                                                |
| authorization | header | string | true     | User API token, given at user login. (Bearer token) |

<h3 id="areascontroller_togglearea-responses">Responses</h3>

| Status | Meaning                                                         | Description                              | Schema |
| ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)         | Content was successfully updated.        | None   |
| 401    | [Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1) | No token provided, or token isn't valid. | None   |
| 404    | [Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)  | User's AREA Not found.                   | None   |

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_UserLoginDto">UserLoginDto</h2>
<!-- backwards compatibility -->
<a id="schemauserlogindto"></a>
<a id="schema_UserLoginDto"></a>
<a id="tocSuserlogindto"></a>
<a id="tocsuserlogindto"></a>

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": ["email", "password"]
}
```

### Properties

| Name     | Type   | Required | Restrictions | Description |
| -------- | ------ | -------- | ------------ | ----------- |
| email    | string | true     | none         | none        |
| password | string | true     | none         | none        |

<h2 id="tocS_UserRegistrationDto">UserRegistrationDto</h2>
<!-- backwards compatibility -->
<a id="schemauserregistrationdto"></a>
<a id="schema_UserRegistrationDto"></a>
<a id="tocSuserregistrationdto"></a>
<a id="tocsuserregistrationdto"></a>

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string"
    }
  },
  "required": ["email", "password"]
}
```

### Properties

| Name     | Type   | Required | Restrictions | Description |
| -------- | ------ | -------- | ------------ | ----------- |
| email    | string | true     | none         | none        |
| password | string | true     | none         | none        |

<h2 id="tocS_AreaCreationDto">AreaCreationDto</h2>
<!-- backwards compatibility -->
<a id="schemaareacreationdto"></a>
<a id="schema_AreaCreationDto"></a>
<a id="tocSareacreationdto"></a>
<a id="tocsareacreationdto"></a>

```json
{
  "type": "object",
  "properties": {
    "action": {
      "type": "object"
    },
    "reaction": {
      "type": "object"
    }
  },
  "required": ["action", "reaction"]
}
```

### Properties

| Name     | Type   | Required | Restrictions | Description |
| -------- | ------ | -------- | ------------ | ----------- |
| action   | object | true     | none         | none        |
| reaction | object | true     | none         | none        |
