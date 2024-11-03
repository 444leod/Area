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

# Authentication

- HTTP Authentication, scheme: bearer The Bearer token given to a User

<h1 id="area-api-default">Default</h1>

## AppController_getAboutJson

<a id="opIdAppController_getAboutJson"></a>

> Code samples

```javascript

fetch('/about.json',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.get('/about.json')

print(r.json())

```

`GET /about.json`

<h3 id="appcontroller_getaboutjson-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ServicesController_getAllServices

<a id="opIdServicesController_getAllServices"></a>

> Code samples

```javascript

fetch('/services',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.get('/services')

print(r.json())

```

`GET /services`

<h3 id="servicescontroller_getallservices-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## ServicesController_getServiceById

<a id="opIdServicesController_getServiceById"></a>

> Code samples

```javascript

fetch('/services/{id}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.get('/services/{id}')

print(r.json())

```

`GET /services/{id}`

<h3 id="servicescontroller_getservicebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="servicescontroller_getservicebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

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
  "required": [
    "email",
    "password"
  ]
}
```

<h3 id="authcontroller_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[UserLoginDto](#schemauserlogindto)|true|none|

<h3 id="authcontroller_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_atlassianconnection

<a id="opIdAuthController_atlassianconnection"></a>

> Code samples

```javascript

fetch('/auth/atlassian',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/auth/atlassian')

print(r.json())

```

`POST /auth/atlassian`

<h3 id="authcontroller_atlassianconnection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_githubconnection

<a id="opIdAuthController_githubconnection"></a>

> Code samples

```javascript

fetch('/auth/github',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/auth/github')

print(r.json())

```

`POST /auth/github`

<h3 id="authcontroller_githubconnection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_spotifyconnection

<a id="opIdAuthController_spotifyconnection"></a>

> Code samples

```javascript

fetch('/auth/spotify',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/auth/spotify')

print(r.json())

```

`POST /auth/spotify`

<h3 id="authcontroller_spotifyconnection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleconnection

<a id="opIdAuthController_googleconnection"></a>

> Code samples

```javascript

fetch('/auth/simpleAuthGoogle',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/auth/simpleAuthGoogle')

print(r.json())

```

`POST /auth/simpleAuthGoogle`

<h3 id="authcontroller_googleconnection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleCallback

<a id="opIdAuthController_googleCallback"></a>

> Code samples

```javascript

fetch('/auth/google',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/auth/google')

print(r.json())

```

`POST /auth/google`

<h3 id="authcontroller_googlecallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_googleMobileAuth

<a id="opIdAuthController_googleMobileAuth"></a>

> Code samples

```javascript

fetch('/auth/google/mobile',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/auth/google/mobile')

print(r.json())

```

`POST /auth/google/mobile`

<h3 id="authcontroller_googlemobileauth-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

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
  "required": [
    "email",
    "password"
  ]
}
```

<h3 id="authcontroller_register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[UserRegistrationDto](#schemauserregistrationdto)|true|none|

<h3 id="authcontroller_register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

## AuthController_disconnectUserService

<a id="opIdAuthController_disconnectUserService"></a>

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "ATLASSIAN",
        "GOOGLE",
        "GITHUB",
        "SPOTIFY"
      ]
    }
  },
  "required": [
    "type"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/disconnect',
{
  method: 'DELETE',
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

r = requests.delete('/auth/disconnect', headers = headers)

print(r.json())

```

`DELETE /auth/disconnect`

> Body parameter

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "ATLASSIAN",
        "GOOGLE",
        "GITHUB",
        "SPOTIFY"
      ]
    }
  },
  "required": [
    "type"
  ]
}
```

<h3 id="authcontroller_disconnectuserservice-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[DisconnectServiceDto](#schemadisconnectservicedto)|true|none|

<h3 id="authcontroller_disconnectuserservice-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="area-api-users">Users</h1>

## UsersController_getUserProfile

<a id="opIdUsersController_getUserProfile"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/users/profile',
{
  method: 'GET',

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
  'Accept': 'application/json'
}

r = requests.get('/users/profile', headers = headers)

print(r.json())

```

`GET /users/profile`

> Example responses

> 200 Response

```json
{
  "_id": "deadbeefdeadbeefdeadbeef",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@cia.com",
  "password": "SOMEHASHEDPASSWORD",
  "authorizations": [],
  "areas": []
}
```

<h3 id="userscontroller_getuserprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|A test route that returns a user's informations.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Bad user token.|None|

<h3 id="userscontroller_getuserprofile-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## UsersController_getUserAuthorizations

<a id="opIdUsersController_getUserAuthorizations"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/users/authorizations',
{
  method: 'GET',

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
  'Accept': 'application/json'
}

r = requests.get('/users/authorizations', headers = headers)

print(r.json())

```

`GET /users/authorizations`

> Example responses

> 200 Response

```json
[
  "Atlassian",
  "Google",
  "Jira"
]
```

<h3 id="userscontroller_getuserauthorizations-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of authorization types for the authenticated user.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Bad user token.|None|

<h3 id="userscontroller_getuserauthorizations-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UsersController_deleteUser

<a id="opIdUsersController_deleteUser"></a>

> Code samples

```javascript

fetch('/users',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.delete('/users')

print(r.json())

```

`DELETE /users`

<h3 id="userscontroller_deleteuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|User deleted successfuly. No content sent.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Bad user token.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="area-api-areas">Areas</h1>

## AreasController_getAreaById

<a id="opIdAreasController_getAreaById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/areas/{id}',
{
  method: 'GET',

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
  'Accept': 'application/json'
}

r = requests.get('/areas/{id}', headers = headers)

print(r.json())

```

`GET /areas/{id}`

<h3 id="areascontroller_getareabyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

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
    "_id": "beefdeadbeefdeadbeefdead",
    "active": false,
    "action": {
      "service_id": "beefdeadbeefdeadbeefdead",
      "informations": {
        "type": "EXAMPLE_TYPE",
        "field": "anotherExample"
      }
    },
    "reaction": {
      "service_id": "beefdeadbeefdeadbeefdead",
      "informations": {
        "type": "EXAMPLE_TYPE",
        "field": "anotherExample"
      }
    }
  }
]
```

<h3 id="areascontroller_getareabyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|The data was successfully fetched.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|No token provided, or token isn't valid.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Area not found.|None|

<h3 id="areascontroller_getareabyid-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## AreasController_deleteAreaById

<a id="opIdAreasController_deleteAreaById"></a>

> Code samples

```javascript

fetch('/areas/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.delete('/areas/{id}')

print(r.json())

```

`DELETE /areas/{id}`

<h3 id="areascontroller_deleteareabyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="areascontroller_deleteareabyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Operation sucessful, no content.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|No token provided, or token isn't valid.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Area not found.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## AreasController_getUserAreas

<a id="opIdAreasController_getUserAreas"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/areas',
{
  method: 'GET',

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
  'Accept': 'application/json'
}

r = requests.get('/areas', headers = headers)

print(r.json())

```

`GET /areas`

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
    "_id": "beefdeadbeefdeadbeefdead",
    "active": false,
    "action": {
      "service_id": "beefdeadbeefdeadbeefdead",
      "informations": {
        "type": "EXAMPLE_TYPE",
        "field": "anotherExample"
      }
    },
    "reaction": {
      "service_id": "beefdeadbeefdeadbeefdead",
      "informations": {
        "type": "EXAMPLE_TYPE",
        "field": "anotherExample"
      }
    }
  }
]
```

<h3 id="areascontroller_getuserareas-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|The data was successfully fetched.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|No token provided, or token isn't valid.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found.|None|

<h3 id="areascontroller_getuserareas-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## AreasController_createArea

<a id="opIdAreasController_createArea"></a>

> Code samples

```javascript
const inputBody = '{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "action": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "exampleField": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "exampleField"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "seconds": {
              "type": "number"
            }
          },
          "required": [
            "type",
            "seconds"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "user_id": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "user_id"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        }
      ]
    },
    "reaction": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "exampleField": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "exampleField"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "body"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "title",
            "body"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_tracks": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_tracks"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_albums": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_albums"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_artists": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_artists"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "project_key": {
              "type": "string"
            },
            "issue_type": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "assignee_name": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "project_key",
            "issue_type",
            "title",
            "description",
            "assignee_name"
          ]
        }
      ]
    }
  },
  "required": [
    "name",
    "action",
    "reaction"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
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
  'Accept': 'application/json'
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
    "name": {
      "type": "string"
    },
    "action": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "exampleField": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "exampleField"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "seconds": {
              "type": "number"
            }
          },
          "required": [
            "type",
            "seconds"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "user_id": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "user_id"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        }
      ]
    },
    "reaction": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "exampleField": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "exampleField"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "body"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "title",
            "body"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_tracks": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_tracks"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_albums": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_albums"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_artists": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_artists"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "project_key": {
              "type": "string"
            },
            "issue_type": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "assignee_name": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "project_key",
            "issue_type",
            "title",
            "description",
            "assignee_name"
          ]
        }
      ]
    }
  },
  "required": [
    "name",
    "action",
    "reaction"
  ]
}
```

<h3 id="areascontroller_createarea-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AreaCreationDto](#schemaareacreationdto)|true|none|

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

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|The element was sucessfully created.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|No token provided, or token isn't valid.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|User not found.|None|

<h3 id="areascontroller_createarea-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## AreasController_toggleArea

<a id="opIdAreasController_toggleArea"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/areas/{id}/toggle',
{
  method: 'PATCH',

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
  'Accept': 'application/json'
}

r = requests.patch('/areas/{id}/toggle', headers = headers)

print(r.json())

```

`PATCH /areas/{id}/toggle`

<h3 id="areascontroller_togglearea-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "_id": "deadbeefdeadbeefdeadbeef",
  "active": true,
  "action": {},
  "reaction": {}
}
```

<h3 id="areascontroller_togglearea-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Document was sucessfully patched.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|No token provided, or token isn't valid.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Area not found.|None|

<h3 id="areascontroller_togglearea-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="area-api-other">Other</h1>

## WebhookController_triggerWebhook

<a id="opIdWebhookController_triggerWebhook"></a>

> Code samples

```javascript

fetch('/webhooks/{id}',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```python
import requests

r = requests.post('/webhooks/{id}')

print(r.json())

```

`POST /webhooks/{id}`

<h3 id="webhookcontroller_triggerwebhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="webhookcontroller_triggerwebhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|

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
  "required": [
    "email",
    "password"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|

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
  "required": [
    "email",
    "password"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|

<h2 id="tocS_DisconnectServiceDto">DisconnectServiceDto</h2>
<!-- backwards compatibility -->
<a id="schemadisconnectservicedto"></a>
<a id="schema_DisconnectServiceDto"></a>
<a id="tocSdisconnectservicedto"></a>
<a id="tocsdisconnectservicedto"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "ATLASSIAN",
        "GOOGLE",
        "GITHUB",
        "SPOTIFY"
      ]
    }
  },
  "required": [
    "type"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|ATLASSIAN|
|type|GOOGLE|
|type|GITHUB|
|type|SPOTIFY|

<h2 id="tocS_ExampleReactionInfos">ExampleReactionInfos</h2>
<!-- backwards compatibility -->
<a id="schemaexamplereactioninfos"></a>
<a id="schema_ExampleReactionInfos"></a>
<a id="tocSexamplereactioninfos"></a>
<a id="tocsexamplereactioninfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "exampleField": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "exampleField"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|exampleField|string|true|none|none|

<h2 id="tocS_SendEmailReactionInfos">SendEmailReactionInfos</h2>
<!-- backwards compatibility -->
<a id="schemasendemailreactioninfos"></a>
<a id="schema_SendEmailReactionInfos"></a>
<a id="tocSsendemailreactioninfos"></a>
<a id="tocssendemailreactioninfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "to": {
      "type": "string"
    },
    "subject": {
      "type": "string"
    },
    "body": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "to",
    "subject",
    "body"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|to|string|true|none|none|
|subject|string|true|none|none|
|body|string|true|none|none|

<h2 id="tocS_CreateGoogleTaskInfos">CreateGoogleTaskInfos</h2>
<!-- backwards compatibility -->
<a id="schemacreategoogletaskinfos"></a>
<a id="schema_CreateGoogleTaskInfos"></a>
<a id="tocScreategoogletaskinfos"></a>
<a id="tocscreategoogletaskinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "body": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "title",
    "body"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|title|string|true|none|none|
|body|string|true|none|none|

<h2 id="tocS_SendMessageToDiscordWebhookInfos">SendMessageToDiscordWebhookInfos</h2>
<!-- backwards compatibility -->
<a id="schemasendmessagetodiscordwebhookinfos"></a>
<a id="schema_SendMessageToDiscordWebhookInfos"></a>
<a id="tocSsendmessagetodiscordwebhookinfos"></a>
<a id="tocssendmessagetodiscordwebhookinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    }
  },
  "required": [
    "type"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|

<h2 id="tocS_SendScrobbleReportByEmailInfos">SendScrobbleReportByEmailInfos</h2>
<!-- backwards compatibility -->
<a id="schemasendscrobblereportbyemailinfos"></a>
<a id="schema_SendScrobbleReportByEmailInfos"></a>
<a id="tocSsendscrobblereportbyemailinfos"></a>
<a id="tocssendscrobblereportbyemailinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "to": {
      "type": "string"
    },
    "subject": {
      "type": "string"
    },
    "username": {
      "type": "string"
    },
    "nb_tracks": {
      "type": "object",
      "minimum": 1
    }
  },
  "required": [
    "type",
    "to",
    "subject",
    "username",
    "nb_tracks"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|to|string|true|none|none|
|subject|string|true|none|none|
|username|string|true|none|none|
|nb_tracks|object|true|none|none|

<h2 id="tocS_SendAlbumsReportByEmailInfos">SendAlbumsReportByEmailInfos</h2>
<!-- backwards compatibility -->
<a id="schemasendalbumsreportbyemailinfos"></a>
<a id="schema_SendAlbumsReportByEmailInfos"></a>
<a id="tocSsendalbumsreportbyemailinfos"></a>
<a id="tocssendalbumsreportbyemailinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "to": {
      "type": "string"
    },
    "subject": {
      "type": "string"
    },
    "username": {
      "type": "string"
    },
    "nb_albums": {
      "type": "object",
      "minimum": 1
    }
  },
  "required": [
    "type",
    "to",
    "subject",
    "username",
    "nb_albums"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|to|string|true|none|none|
|subject|string|true|none|none|
|username|string|true|none|none|
|nb_albums|object|true|none|none|

<h2 id="tocS_SendArtistsReportByEmailInfos">SendArtistsReportByEmailInfos</h2>
<!-- backwards compatibility -->
<a id="schemasendartistsreportbyemailinfos"></a>
<a id="schema_SendArtistsReportByEmailInfos"></a>
<a id="tocSsendartistsreportbyemailinfos"></a>
<a id="tocssendartistsreportbyemailinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "to": {
      "type": "string"
    },
    "subject": {
      "type": "string"
    },
    "username": {
      "type": "string"
    },
    "nb_artists": {
      "type": "object",
      "minimum": 1
    }
  },
  "required": [
    "type",
    "to",
    "subject",
    "username",
    "nb_artists"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|to|string|true|none|none|
|subject|string|true|none|none|
|username|string|true|none|none|
|nb_artists|object|true|none|none|

<h2 id="tocS_CreateJiraTicketInfos">CreateJiraTicketInfos</h2>
<!-- backwards compatibility -->
<a id="schemacreatejiraticketinfos"></a>
<a id="schema_CreateJiraTicketInfos"></a>
<a id="tocScreatejiraticketinfos"></a>
<a id="tocscreatejiraticketinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "project_key": {
      "type": "string"
    },
    "issue_type": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "assignee_name": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "project_key",
    "issue_type",
    "title",
    "description",
    "assignee_name"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|project_key|string|true|none|none|
|issue_type|string|true|none|none|
|title|string|true|none|none|
|description|string|true|none|none|
|assignee_name|string|true|none|none|

<h2 id="tocS_ExampleActionInfos">ExampleActionInfos</h2>
<!-- backwards compatibility -->
<a id="schemaexampleactioninfos"></a>
<a id="schema_ExampleActionInfos"></a>
<a id="tocSexampleactioninfos"></a>
<a id="tocsexampleactioninfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "exampleField": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "exampleField"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|exampleField|string|true|none|none|

<h2 id="tocS_EachXSecondsActionInfos">EachXSecondsActionInfos</h2>
<!-- backwards compatibility -->
<a id="schemaeachxsecondsactioninfos"></a>
<a id="schema_EachXSecondsActionInfos"></a>
<a id="tocSeachxsecondsactioninfos"></a>
<a id="tocseachxsecondsactioninfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "seconds": {
      "type": "number"
    }
  },
  "required": [
    "type",
    "seconds"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|seconds|number|true|none|none|

<h2 id="tocS_OnYoutubeVideoPostedInfos">OnYoutubeVideoPostedInfos</h2>
<!-- backwards compatibility -->
<a id="schemaonyoutubevideopostedinfos"></a>
<a id="schema_OnYoutubeVideoPostedInfos"></a>
<a id="tocSonyoutubevideopostedinfos"></a>
<a id="tocsonyoutubevideopostedinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "user_id": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "user_id"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|
|user_id|string|true|none|none|

<h2 id="tocS_OnNewJiraTicketInfos">OnNewJiraTicketInfos</h2>
<!-- backwards compatibility -->
<a id="schemaonnewjiraticketinfos"></a>
<a id="schema_OnNewJiraTicketInfos"></a>
<a id="tocSonnewjiraticketinfos"></a>
<a id="tocsonnewjiraticketinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    }
  },
  "required": [
    "type"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|

<h2 id="tocS_OnNewGithubRepositoryInfos">OnNewGithubRepositoryInfos</h2>
<!-- backwards compatibility -->
<a id="schemaonnewgithubrepositoryinfos"></a>
<a id="schema_OnNewGithubRepositoryInfos"></a>
<a id="tocSonnewgithubrepositoryinfos"></a>
<a id="tocsonnewgithubrepositoryinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    }
  },
  "required": [
    "type"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|

<h2 id="tocS_OnPullRequestStateInfos">OnPullRequestStateInfos</h2>
<!-- backwards compatibility -->
<a id="schemaonpullrequeststateinfos"></a>
<a id="schema_OnPullRequestStateInfos"></a>
<a id="tocSonpullrequeststateinfos"></a>
<a id="tocsonpullrequeststateinfos"></a>

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    }
  },
  "required": [
    "type"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|type|string|true|none|none|

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
    "name": {
      "type": "string"
    },
    "action": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "exampleField": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "exampleField"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "seconds": {
              "type": "number"
            }
          },
          "required": [
            "type",
            "seconds"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "user_id": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "user_id"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        }
      ]
    },
    "reaction": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "exampleField": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "exampleField"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "body"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "body": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "title",
            "body"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": [
            "type"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_tracks": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_tracks"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_albums": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_albums"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "to": {
              "type": "string"
            },
            "subject": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "nb_artists": {
              "type": "object",
              "minimum": 1
            }
          },
          "required": [
            "type",
            "to",
            "subject",
            "username",
            "nb_artists"
          ]
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            },
            "project_key": {
              "type": "string"
            },
            "issue_type": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "assignee_name": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "project_key",
            "issue_type",
            "title",
            "description",
            "assignee_name"
          ]
        }
      ]
    }
  },
  "required": [
    "name",
    "action",
    "reaction"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|action|any|true|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ExampleActionInfos](#schemaexampleactioninfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[EachXSecondsActionInfos](#schemaeachxsecondsactioninfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[OnYoutubeVideoPostedInfos](#schemaonyoutubevideopostedinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[OnNewJiraTicketInfos](#schemaonnewjiraticketinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[OnNewJiraTicketInfos](#schemaonnewjiraticketinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[OnNewGithubRepositoryInfos](#schemaonnewgithubrepositoryinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[OnPullRequestStateInfos](#schemaonpullrequeststateinfos)|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|reaction|any|true|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[ExampleReactionInfos](#schemaexamplereactioninfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[SendEmailReactionInfos](#schemasendemailreactioninfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[CreateGoogleTaskInfos](#schemacreategoogletaskinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[SendMessageToDiscordWebhookInfos](#schemasendmessagetodiscordwebhookinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[SendScrobbleReportByEmailInfos](#schemasendscrobblereportbyemailinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[SendAlbumsReportByEmailInfos](#schemasendalbumsreportbyemailinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[SendArtistsReportByEmailInfos](#schemasendartistsreportbyemailinfos)|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[CreateJiraTicketInfos](#schemacreatejiraticketinfos)|false|none|none|

