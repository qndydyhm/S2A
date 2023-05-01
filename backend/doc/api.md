# API

## User
- login
```
GET /auth/login
request:
null
response:
302 google login
```

- logout
```
GET /auth/logout
request:
null
response:
{
    message: "Bye",
    status: "OK"
}
```

- loggedIn
```
GET /auth/loggedIn
request:
null
response:
{
    status,
    loggedIn: boolean,
    // if logged in
    user: {
        name,
        email,
        profile
    }
}
```

## App
- Create app
```
POST /api/app
request:
{
    name: string,
    roleM: string,
    published: boolean
}
response:
{
    status,
    // if OK
    id
}
```

- Update app
```
POST /api/app/:id
request:
{
    name: string, 
    roleM: string, 
    published: boolean
}
response:
{
    status
}
```

- Get app
```
GET /api/app/:id
request:
null
response:
{
    status
    // if OK
    app: {
        _id
        name, 
        datasources: [{
            id,
            name
        }], 
        views: [{
            id,
            name
        }], 
        roleM, 
        published
    }
}
```

- Get apps
```
GET /api/app
request:
null
response:
{
    status,
    // if OK
    canEdit,
    apps {
        id,
        name
    }
}
```

- Delete app
```
DELETE /api/app/:id
request:
null
response:
{
    status
}
```


## Data source
- Create data source
```
POST /api/ds
request:
{ 
    name: string, 
    URL: string, 
    key: string, 
    label: string?,
    columns: [{
        name: string, 
        initvalue: string, 
        reference: string, 
        type: string
    }], 
    owner: string // owned app id
}
response:
{
    status,
    // if OK
    id
}
```

- Update data source
```
POST /api/ds/:id
request:
{ 
    name: string, 
    URL: string, 
    key: string, 
    label: string,
    columns: [{
        name: string, 
        initvalue: string, 
        reference: string, 
        type: string
    }]
}
response:
{
    status
}
```

- Get data source
```
GET /api/ds/:id
request:
null
response:
{
    status
    // if OK
    datasource: {
        _id,
        name, 
        URL, 
        key, 
        columns,
        owner // owned app
    }
}
```

- Delete data source
```
DELETE /api/ds/:id
request:
null
response:
{
    status
}
```

## View
- Create view
```
POST /api/view
request:
{ 
    name: string, 
    table: string, 
    columns: [string], 
    viewtype: [string], 
    allowedactions: number [0, 7], 
    roles: [string], 
    filter?: string, 
    userfilter?: string, 
    editfilter?: string, 
    editablecolumns?: [string], 
    owner: string // owned app
}
response:
{
    status,
    // if OK
    id
}
```

- Update view
```
POST /api/view/:id
request:
{ 
    name: string, 
    table: string, 
    columns: [string], 
    viewtype: [string], 
    allowedactions: number [0, 7], 
    roles: [string], 
    filter?: string, 
    userfilter?: string, 
    editfilter?: string, 
    editablecolumns?: [string]
}
response:
{
    status
}
```

- Get view
```
GET /api/view/:id
request:
null
response:
{
    status
    // if OK
    view: { 
        name, 
        table, 
        columns, 
        viewtype, 
        allowedactions, 
        roles, 
        filter, 
        userfilter, 
        editfilter, 
        editablecolumns, 
        owner // owned app
    }
}
```

- Delete view
```
DELETE /api/view/:id
request:
null
response:
{
    status
}
```

- Get Views
```
GET /api/view?id=%APPID%
request:
null
response:
{
    status,
    views: {
        name,
        id
    }
}
```

- Get Table View
```
GET /api/table/:id
request:
null
response:
{
    status,
    id,
    data:[][],
    columns:[],
    keys:[],
    add: bool,
    delete: bool
}
```

- Get Detail View
```
GET /api/detail/:id?key=%KEY%
request:
null
response:
{
    status,
    id,
    data:[][],
    columns:[],
    keys:[],
    edit: bool
}
```

## Data
- Update Record
```
POST /api/data/:id?key=%KEY%
request:
{
    col1: value,
    col2: value,
    ...
}
response:
{
    status
}
```


- Delete Record
```
DELETE /api/data/:id?key=%KEY%
request:
null
response:
{
    status
}
```