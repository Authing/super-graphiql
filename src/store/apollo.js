const state = {
    drawerShow: false,
    apiInfo: {},
    dic: {},
    historyList: [],
    nowHistory: 0,
    apiDocs: {

        getClientWhenSdkInit: {
            name: '初始化',
            brief: `
1. 为什么需要用户池鉴权？
> 出于安全性考虑，进行删除用户、创建角色等操作前需要先获取 accessToken。  

2. 如何获取 accessToken？
需要两个参数
- \`clientId\`
- \`secret\`

3. 如何获取 \`clientId\` 和 \`secret\` ?

- 前往 [authing.cn](https://authing.cn/) 注册账号
- [新建用户池](https://docs.authing.cn/authing/quickstart/hello-world)
- 通过 **用户池** -> **基础配置** 找到 \`clientId\` 和 \`secret\`

4. 返回数据字段

- \`accessToken\`
- \`clientInfo\`: 用户池的详细信息

5. 如何使用 \`accessToken\` ?

> 添加到 HTTP 请求的 [Authorization Header](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authorization) 中

            `,
            type: '用户池鉴权'
        },
        register: {
            name: '注册',
            brief: '用户注册。\n此接口不需要发送任何 Token, 密码采用非对称加密方式。参见 https://docs.authing.cn/authing/sdk/open-graphql#zhu-ce',
            brief: `
1. 注册分为多种方式
- 使用用户名注册（username）
- 使用邮箱注册（email）
- 使用手机号注册（phone）
- 社会化账号（微信、GitHub）注册(unionid)

2. 部分请求参数说明
    - userInfo
        - 必填项
            - \`registerInClient\`: 用户注册所在的用户池
        - 可选项
            - \`registerMethod\`:注册方式。开发者最好提供此字段，如未提供，Authing 将从其他是否提供 \`unionid\`，\`email\`, \`phone\`， \`username\` 四个字段推测注册方式（优先级递减，比如同时提供 \`unionid\`和\`email\`，会被视为\`union\`方式注册）。
            - \`unionid\`
            - \`email\`
            - \`phone\`: 注：若管理员开启了注册白名单机制，此手机号需要在白名单之内。
            - \`password\`: 加密过后的密码，加密方式见[Authing官方文档](https://docs.authing.cn/authing/v/master/sdk/open-graphql#zhu-yi-shi-xiang-2)。
            - \`forceLogin\`: 默认为false, 如果设置为 true, 用户不存在时会先自动创建。
            - \`photo\`: 用户头像，如果域名不是 Authing 的 CDN，将会先被上传至 Authing CDN。
            - \`lastIP\`: 用户注册时的 IP, 如果未提供，Authing 将会从请求中自动推断。
    - invitationCode: 邀请码。可选。
    - keepPassword: 是否直接将密码写入，内部不使用 Authing 的加密方式存储。

3. 注册频率限制

应用池管理员可以在后台开启频繁注册限制选项（**用户池** -> **基础配置**）。

![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-23-40FB8474-08F1-4586-83CB-CFC96B5A56A1.png)

如上图中，**同一 IP** 在 300 秒内，只能发起 3 次注册请求。

4. 注册白名单机制

> 目前只支持手机号白名单，

开发者可以配置白名单（**用户中心** -> **注册白名单**），只运行白名单内的手机号注册。

5. 一键关闭注册选项

Authing 提供给开发者“一键关闭注册”选项，可在后台 **基础配置** 中设置。

![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-23-103351.png)

`        ,
            type: '用户鉴权'
        },
        login: {
            name: '登录',
            brief: `
登陆接口。
1. 登陆场景：
- 用户名登陆
- 邮箱登陆
- 手机号作为用户名登陆
- 手机号验证码
- 社会化登陆


            `,
            type: '用户鉴权'
        },
        decodeJwtToken: {
            name: '解析 JWT Token',
            brief: `
解析 JWT Token。
1. 点击 [Authing官方文档](https://learn.authing.cn/authing/advanced/authentication/jwt-token) 了解更多 JWT Token 相关内容。
2. 解析成功示例
\`\`\`
{
    "data": {
        "decodeJwtToken": {
            "data": {
                "email": "1066983132@qq.com",
                "id": "5da7ed9950396c1ad9623787",
                "clientId": "59f86b4832eb28071bdd9214",
                "unionid": null
            },
            "status": {
                "message": "token 解析正常",
                "code": 200,
                "status": null
            },
            "iat": "1571801657",
            "exp": 1573097657
        }
    }
}

\`\`\`
部分字段说明：
- email: 用户邮箱
- id: 用户ID
- clientId: 用户池ID
- unionid
- iat: 签名时间戳
- exp: 签名过期时间戳

3. 解析失败示例
\`\`\`
{
    "data": {
        "decodeJwtToken": {
        "data": null,
        "status": {
            "message": "token 错误",
            "code": 2207,
            "status": null
        },
        "iat": null,
        "exp": null
        }
    }
}
\`\`\`

`,
            type: '用户鉴权'
        },
        refreshToken: {
            name: '刷新 Token',
            brief: `
刷新指定用户的 JWT token。
1. 此 JWT token 有什么用？

每个用户都有唯一对应的 JWT token, 作为登陆凭证。

2. 参数说明
- client: 用户池 ID
- user: 用户 ID

3. 返回数据示例
\`\`\`
{
    "data": {
      "refreshToken": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlkIjoiNWRhN2VkYWI1MDM5NmMxYWQ5NjIzNzhjIn0sImlhdCI6MTU3MTgxMDY5MSwiZXhwIjoxNTczMTA2NjkxfQ.obN2YMjasbew8ORhd_IxALTVoFSs0PVm-JQH2ULhBP0",
        "iat": 1571810691,
        "exp": 1573106691
      }
    }
}
\`\`\`

部分字段说明：
- token: 刷新过后的 token
- iat: 签名时间戳
- exp: 签名过期时间戳（默认为签名时间过后15天）

            `,
            type: '用户鉴权'
        },
        user: {
            name: '读取用户资料',
            brief: `
读取用户资料。同时支持用户 ID 和用户登陆凭证读取。
1. 部分请求参数说明
- 可选参数：
    - registerInClient: 用户池 ID。
    - id: 用户id。
    - token: 该用户（**非开发者**）的登陆凭证，如果指定，将会忽略 id 字段。
    - auth: 布尔值
    - userLoginHistoryPage: 用户登陆记录分页数。
    - userLoginHistoryCount: 用户登陆记录每页数目。

2. 返回结果部分字段说明
- group: 所在群组
- clientType: 用户池类型
- userLocation: 用户地址
- userLoginHistory: 用户历史登陆记录。
            `,
            type: '用户管理'
        },
        users: {
            name: '获取用户列表',
            brief: `
获取用户列表。支持分页。用户信息支持基础信息和附带扩展字段两种模式。
部分请求参数说明
- registerInClient：用户池 ID
- page: 第几页。
- count：一页包含用户数目，默认为10，最大为200。
- populate：布尔值。默认为false, 如果为true,将会返回用户的扩展字段：group、clientType、userLocation 、userLoginHistory、systemApplicationType（详情见”读取用户资料”接口）。

            `,
            type: '用户管理'
        },
        checkLoginStatus: {
            name: '检查用户登录状态',
            brief: `
检查用户登录状态。
请求参数说明
- 可选项
    - token: 指定用户的登陆凭证，**不填将使用当前访问者的 token**。
            `,
            type: '用户管理'
        },
        removeUsers: {
            name: '删除用户',
            brief: `
删除用户。
只有用户池（或协作用户池）管理员才能执行此操作。
参数说明
- ids: 列表类型。
- registerInClient: 用户池 ID
- operator
            `,
            type: '用户管理'
        },
        updateUser: {
            name: '更新用户资料',
            brief: `
更新用户资料。
1. 部分参数说明
- options
    - 必填参数
        - _id: 用户ID
        - registerInClient: 用户池 ID
    - 其他字段均可选，**只需要填你想要修改的字段**。

            `,
            type: '用户管理'
        },
        sendResetPasswordEmail: {
            name: '发送重置密码邮件',
            brief: `
发送"重置密码"邮件。
Authing 提供开箱即用的邮件模块，开发者可以在 **消息服务** -> **邮件模版** 查看或修改邮件模板。
详细内容请见 [Authing官方文档](https://docs.authing.cn/authing/messages/email)。
            `,
            type: '用户管理'
        },
        verifyResetPasswordVerifyCode: {
            name: '验证重置密码验证码',
            brief: `
发送“重置密码”邮件。   
`,
            type: '用户管理'
        },
        sendVerifyEmail: {
            name: '发送验证邮件',
            brief: `
发送“验证邮箱”邮件。
            `,
            type: '用户管理'
        },
        changePassword: {
            name: '修改密码',
            brief: `
修改密码。只支持通过邮箱注册的账号的密码，不需要登陆，但是需要使用验证码。
1. 请求参数说明
- password: 新密码，需要加密，加密方式见[Authing官方文档](https://docs.authing.cn/authing/v/master/sdk/open-graphql#zhu-yi-shi-xiang-2)。
- client: 用户池ID
- email: 邮箱
- verifyCode: 验证码
2. 如何获取验证码？
见“发送重置密码邮件”。
            `,
            type: '用户管理'
        },

        unbindEmail: {
            name: '解绑邮箱',
            brief: `
解绑邮箱。
> 注：如果没有配置其他登陆方式（手机号、OAuth），将无法解绑邮箱。如需解绑，请先配置另一个登陆方式。

请求参数说明
- user: 用户ID
- client: 用户池ID
`,
            type: '用户管理'
        },

        userClients: {
            name: "用户池列表",
            brief: `
获取用户池列表。支持分野
1. 请求参数说明
    - 必填参数
        - userId: 用户ID, 只能填开发者自己的用户ID, 填其他人的会报权限错误。
    - 可选参数
        - page: 页数
        - count: 每页数目
        - computeUsersCount: 布尔值没，是否计算用户总数。

2. 返回数据说明
- totalCount: 用户池总数
- list：用户池列表，列表元素字段含义请见 用户池详情 接口。
            `,
            type: '用户池管理'
        },

        client: {
            name: "用户池详情",
            brief: `
用户池详情。
1. 请求参数
- 必填参数
    - id: 用户池 ID
    - userId: 用户池创建者ID
- 选填参数
    - fromAdmin

2. 部分返回数据说明
- user: 用户池创建者。
- usersCount：用户总数
- emailVerifiedDefault：布尔值， 注册时邮箱需不需要验证。true无需验证，false表示需要验证。
- registerDisabled：布尔值，true为应用池已关闭注册，false为未关闭注册。
- showWXMPQRCode：布尔值，是否显示微信小程序扫码登录。
- useMiniLogin：是否使用微信小程序“小登陆”。
- allowedOrigins：安全域（Allowed Origins） 是允许从 JavaScript 向 Authing API 发出请求的 URL（通常与 CORS 一起使用）。 默认情况下，系统会允许你使用所有网址。 如果需要，此字段允许你输入其他来源。 你可以通过逐行分隔多个有效 URL，并在子域级别使用通配符（例如：https://*.sample.com）。 验证这些 URL 时不考虑查询字符串和哈希信息，如果带上了查询字符串和哈希信息系统会自动忽略整个域名。
- secret：用户池密钥，通过 用户池 -> 基础配置 可以查看。
- token：？
- jwtExpired：jwt 过期时间
- frequentRegisterCheck: 注册频率限制。
            `,
            type: '用户池管理'
        },

        userClientTypes: {
            name: "获取用户池类型",
            brief: `
获取用户池类型。
目前 Authing 支持 Web, IOS, Andoid, 小程序 四种用户池。
            `,
            type: '用户池管理'
        },

        // userClientList: {
        //     type: '用户池管理'
        // },

        queryPermissionList: {
            name: "用户池权限列表",
            type: "用户池管理"
        },

        isClientBelongToUser: {
            type: '用户池管理',
            name: "是否具备用户池相关权限",
            brief: `
是否具备用户池相关权限。
1. 请求参数说明
- userId: 用户ID
- clientId: 用户池ID
- permissionDescriptors: 权限描述列表

2. 用户池可以配置哪些权限点？

Authing 目前支持以下权限点：你可以向协作者开放其所需要的权限。
![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-23-123814.png)

            `
        },
        // queryClient: {
        //     type: '用户池管理'
        // },
        // UserClientType: {
        //     type: '用户池管理'
        // },
        // UserClient: {
        //     type: '用户池管理'
        // },
        // PagedUserClients: {
        //     type: '用户池管理'
        // },
        // PagedUserClientList: {
        //     type: '用户池管理'
        // },
        // pagedUserClientListItem: {
        //     type: '用户池管理'
        // },
        // newClient: {
        //     type: '用户池管理'
        // },
        removeUserClients: {
            type: '用户池管理',
            name: "删除用户池",
            brief: `
删除用户池。支持批量操作。

请求参数说明
- ids: 用户池ID列表。
            `
        },
        updateUserClient: {
            type: '用户池管理',
            name: "修改用户池",
            brief: `
修改用户池资料。
请求参数说明
- client
    - _id: 用户池ID，必填。
    - 其他字段均可选，只需要填你想要修改的字段。
            `
        },

        bindOtherOAuth: {
            name: '绑定社会化登录',
            brief: `
绑定第三方社会化账号, Authing 目前支持微信和 GitHub 两种。
请求参数说明
- user: 用户 ID
- client: 用户池 ID
- type: 第三方社会化账号平台，选项为 "github" 和 "wechat"。
- unionid: 第三方社会化账号在此平台的 unionid
- userInfo: 第三方社会化账号的资料,可以是任意字符串。
`,
            type: '社会化登录'
        },
        unbindOtherOAuth: {
            name: '取消绑定社会化登录',
            brief: `
解绑社会化登录。
请求参数说明
- user: 用户 ID
- client: 用户池 ID
- type: 第三方社会化账号平台，选项为 "github" 和 "wechat"。
            `,
            type: '社会化登录'
        },

        setInvitationState: {
            name: '开启/关闭注册白名单限制',
            brief: `
开启/关闭注册白名单限制。
> 目前只支持手机号白名单，后续会慢慢支持更多。
请求参数说明：
- client: 用户池ID
- enablePhone: 布尔值，是否开启手机号白名单机制。
`,
            type: '注册白名单'
        },
        queryInvitationState: {
            name: '查看白名单机制开启状态',
            brief: `
查看白名单机制开启状态。
请求参数说明：
- client: 用户池ID
            `,
            type: '注册白名单'
        },
        addToInvitation: {
            name: '增加手机号到白名单',
            brief: `
增加手机号到白名单。
请求参数说明：
- client: 用户池ID
- phone: 手机号
            `,
            type: '注册白名单'
        },
        removeFromInvitation: {
            name: '从白名单中删除手机号',
            brief: `
从白名单中删除手机号。
请求参数说明：
- client: 用户池ID
- phone: 手机号
            `,
            type: '注册白名单'
        },
        queryInvitation: {
            name: '查看白名单中的手机号',
            brief: `
查看白名单中的手机号列表。
请求参数说明：
- client: 用户池ID
            `,
            type: '注册白名单'
        },

        queryMFA: {
            name: '查询 MFA 信息',
            brief: '通过用户 id 和用户池 id 参数来查询一个用户的 MFA 信息，此时 userId 和 userPoolId 两个参数必填。\n也可以通过 MFA 主体的 id 来查询 MFA 的信息，此时只需传入 _id 参数，userId 和 userPoolId 参数可以不传。',
            type: 'MFA 多因素认证'
        },
        changeMFA: {
            name: '修改 MFA 信息',
            brief: '通过用户 id 和用户池 id 参数来查询一个用户的 MFA 信息，此时 userId 和 userPoolId 两个参数必填。\n也可以通过 MFA 主体的 id 来查询 MFA 的信息，此时只需传入 _id 参数，userId 和 userPoolId 参数可以不传。',
            type: 'MFA 多因素认证'
        },

        addClientWebhook: {
            type: 'WebHook API',
            name: "添加 Webhook",
            brief: `
添加 webhook。
1. Webhook 有什么用

Webhooks 允许你对用户注册、登录等**事件**进行监听，从而对其做一些自定义处理。这能让Authing和你的业务更好地联动起来。
Authing 内置了丰富的事件，目前包含注册、登录、修改密码、修改用户信息、用户邮箱被验证五种。
开发者可以在后台 基础配置 -> Webhook 里面管理自己的 webhook。

![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-23-132141.png)

2. 支持事件列表

- register: 注册
- change-user-info: 修改用户信息
- login: 登陆
- change-password: 修改密码
- email-verified: 用户邮箱被验证

3. 有哪些应用场景？

假设你的应用有 “用户验证邮箱可获积分” 这个业务需求，你可以添加一个监控 \`email-verified\` 事件的 webhook, 每次有用户成功验证邮箱之后，
Authing 将会向你定义的 webhook 地址发送携带该名用户ID的请求，然后你可以通过此用户的 ID 完成相关操作。

4. Authing 的回调请求包含哪些数据？

详情见“发送 Webhook 测试”部分的文档。

5. 请求参数说明
- 必填项
    - client: 用户池ID
    - events: 监听的事件列表，具体的事件名称见上文。
    - url: webhook 回调地址
    - contentType: 指定发起 Webhook 请求时 Request body 的数据格式，可选值有 application/json 和 application/x-www-form-urlencoded
    - enable: 是否启用。
- 可选参数
    - secret: 请求秘钥。如果设置, Authing将会在向 Webhook 回调地址发起请求时，带上\`X-Authing-Token\` 的请求头。开发者可以对此秘钥进行验证，用来防止第三方的恶意请求。
`
        },

        getAllWebhooks: {
            type: 'WebHook API',
            name: "获取用户池 WebHook 列表",
            brief: `
查看配置的 WebHook 列表。
请求参数：
- client: 必填。用户池ID。
            `
        },

        getWebhookDetail: {
            name: "获取 webhook 详情",
            type: 'WebHook API',
            brief: `
获取 webhook 详情。
            `
        },

        getWebhookLogs: {
            type: 'WebHook API',
            name: "获取 Webhook 日志列表"
        },
        
        getWebhookLogDetail: {
            type: 'WebHook API',
            name: "获取 Webhook 日志详情",
            brief: `
获取 Webhook 日志详情。
1. 请求参数
- id：日志ID。
2. 返回数据示例

- 日志详情里面包含了具体的 response 和 request。

\`\`\`
{ 
    "data":{ 
       "getWebhookLogDetail":{ 
          "_id":"5dad7b85ca72c4d67c146c9d",
          "request":{ 
             "headers":"{\"Accept\":\"application/json, text/plain, */*\",\"Content-Type\":\"application/json\",\"User-Agent\":\"Authing-hook\",\"X-Authing-Token\":\"\",\"X-Authing-Event\":\"register\",\"Content-Length\":1416}",
             "payload":"{\"success\":1,\"message\":\"注册成功\",\"executedAt\":1571650437755,\"params\":{\"phone\":\"\",\"emailVerified\":true,\"phoneVerfified\":false,\"username\":null,\"nickname\":\"Nikola Tesla\",\"company\":\"\",\"photo\":\"https://usercontents.authing.cn/authing-avatar.png\",\"browser\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36\",\"device\":\"\",\"password\":\"\",\"loginsCount\":0,\"registerMethod\":\"ldap:default::from-undefined\",\"blocked\":false,\"isDeleted\":false,\"oauth\":\"{\\\"dn\\\":\\\"uid=tesla,dc=example,dc=com\\\",\\\"controls\\\":[],\\\"objectClass\\\":[\\\"inetOrgPerson\\\",\\\"organizationalPerson\\\",\\\"person\\\",\\\"top\\\",\\\"posixAccount\\\"],\\\"cn\\\":\\\"Nikola Tesla\\\",\\\"sn\\\":\\\"Tesla\\\",\\\"uid\\\":\\\"tesla\\\",\\\"mail\\\":\\\"tesla@ldap.forumsys.com\\\",\\\"uidNumber\\\":\\\"88888\\\",\\\"gidNumber\\\":\\\"99999\\\",\\\"homeDirectory\\\":\\\"home\\\"}\",\"phoneCode\":\"\",\"name\":\"\",\"givenName\":\"\",\"familyName\":\"\",\"middleName\":\"\",\"profile\":\"\",\"preferredUsername\":\"\",\"website\":\"\",\"gender\":\"\",\"birthdate\":\"\",\"zoneinfo\":\"\",\"locale\":\"\",\"address\":\"\",\"formatted\":\"\",\"streetAddress\":\"\",\"locality\":\"\",\"region\":\"\",\"postalCode\":\"\",\"country\":\"\",\"updatedAt\":\"\",\"_id\":\"5dad7b85ca72c4411f146c94\",\"email\":\"tesla@ldap.forumsys.com\",\"unionid\":\"uid=tesla,dc=example,dc=com\",\"lastIP\":\"124.204.56.98\",\"registerInClient\":\"5d11dcc331f4173231ed6a8d\",\"salt\":\"973i1gi516oe\",\"lastLogin\":\"2019-10-21T09:33:57.215Z\",\"signedUp\":\"2019-10-21T09:33:57.215Z\",\"__v\":0}}",
             "__typename":"WebhookRequestType"
          },
          "response":{ 
             "headers":"{\"server\":\"Tengine\",\"content-type\":\"text/html; charset=utf-8\",\"content-length\":\"151\",\"connection\":\"close\",\"date\":\"Mon, 21 Oct 2019 09:33:57 GMT\",\"set-cookie\":[\"acw_tc=2a51cb1915716504377745773e1485a843311545077f946adc7ec8485a;path=/;HttpOnly;Max-Age=2678401\",\"connect.sid=s%3AcFJ7sVEU-BZS7HO-3FbcP88psRLo4TS7.RJNHX5OKSpO1lcHQrYJR3B872epYWQz8BwFJhxRqANU; Path=/; HttpOnly\"],\"access-control-allow-origin\":\"*\",\"x-frame-options\":\"SAMEORIGIN\",\"x-dns-prefetch-control\":\"off\",\"strict-transport-security\":\"max-age=15552000; includeSubDomains\",\"x-download-options\":\"noopen\",\"x-content-type-options\":\"nosniff\",\"x-xss-protection\":\"1; mode=block\",\"content-security-policy\":\"default-src 'none'\",\"ali-swift-global-savetime\":\"1571650437\",\"via\":\"cache2.l2cn1793[28,404-1280,M], cache2.l2cn1793[28,0], vcache5.cn2020[88,404-1280,M], vcache5.cn2020[90,0]\",\"x-swift-error\":\"orig response 4XX error, orig response 4XX error\",\"x-cache\":\"MISS TCP_MISS dirn:-2:-2\",\"x-swift-savetime\":\"Mon, 21 Oct 2019 09:33:57 GMT\",\"x-swift-cachetime\":\"0\",\"timing-allow-origin\":\"*\",\"eagleid\":\"2a51cb1915716504377745773e\"}",
             "body":"\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n<meta charset=\\\"utf-8\\\">\\n<title>Error</title>\\n</head>\\n<body>\\n<pre>Cannot POST /auth/xcx-sm</pre>\\n</body>\\n</html>\\n\"",
             "statusCode":null,
             "__typename":"WebhookResponseType"
          },
          "errorMessage":"",
          "when":"2019-10-21 17:33:57",
          "__typename":"WebhookLog"
       }
    }
}



\`\`\`
            `
        },
        
        getWebhookSettingOptions: {
            type: 'WebHook API',
            name: "获取 Webhook 设置选项"
        },

        updateClientWebhook: {
            type: 'WebHook API',
            name: "修改 Webhook"
        },
        deleteClientWebhook: {
            type: 'WebHook API',
            name: "删除 Webhook"
        },
        SendWebhookTest: {
            type: 'WebHook API',
            name: "发送 Webhook 测试"
        },
        // ClientWebhook: {
        //     type: 'WebHook API'
        // },
        // WebhookEvent: {
        //     type: 'WebHook API'
        // },
        // WebhookLog: {
        //     type: 'WebHook API'
        // },
        // WebhookRequestType: {
        //     type: 'WebHook API'
        // },
        // WebhookResponseType: {
        //     type: 'WebHook API'
        // },
        // WebhookSettingOptions: {
        //     type: 'WebHook API'
        // },
        // WebhookContentType: {
        //     type: 'WebHook API'
        // },
        LoginByLDAP: {
            // 使用 LDAP 登录，登录后返回的 Token 需要在客户端维护
            name: '使用 LDAP 登录',
            brief: '使用 LDAP 登录，登录后返回的 Token 需要在客户端维护。',
            type: 'OAuth API'
        },
        GetUserAuthorizedApps: {
            name: '查询用户授权过的 SSO 应用列表',
            brief: '此接口需要发送 Token，可以使用 UserToken 或 OwnerToken。',
            type: 'OAuth API'
        },
        RevokeUserAuthorizedApp: {
            name: '撤回用户对 SSO 应用的授权',
            brief: '此接口用于撤回一个用户池内，某个用户对该用户池下的某个 SSO 应用的授权。撤回授权后，用户在 SSO 登录页面登录时，会再次显示确权页面。',
            type: 'OAuth API'
        },

    }
}

const getters = {
    drawerShow: () => state.drawerShow,
    apiInfo: () => state.apiInfo,
    dic: () => state.dic,
    historyList: () => state.historyList,
    nowHistory: () => state.nowHistory,
    apiDocs: () => state.apiDocs
}

const mutations = {
    changeDrawerShow(state, { show }) {
        state.drawerShow = show
    },
    setApiInfo(state, { info }) {
        state.apiInfo = info
    },
    setDic(state, dic) {
        state.dic = dic
    },
    setHistoryList(state, info) {
        state.historyList = [info]
        state.nowHistory = 0
    },
    setNowHistory(state, nowHistory) {
        state.historyList = nowHistory
    },
    addToHistoryList(state, info) {
        let list = state.historyList
        let c = -1
        for (let i = 0; i < list.length; i++) {
            if (list[i].name == info.name) {
                c = i
            }
        }
        if (c >= 0) {
            state.nowHistory = c
            state.apiInfo = list[c]
        } else {
            list.push(info)
            state.historyList = list
            state.nowHistory = list.length - 1
        }
    },
    clearHistoryList(state) {
        state.historyList = []
        state.nowHistory = 0
    },
    lastHistory(state) {
        if (state.nowHistory > 0) {
            state.nowHistory = state.nowHistory - 1
            if (state.historyList.length > 0 && state.historyList[state.nowHistory]) {
                state.apiInfo = state.historyList[state.nowHistory]
            }
        }
    },
    nextHistory(state) {
        if (state.nowHistory < (state.historyList.length - 1)) {
            state.nowHistory = state.nowHistory + 1
            if (state.historyList.length > 0 && state.historyList[state.nowHistory]) {
                state.apiInfo = state.historyList[state.nowHistory]
            }
        }
    },
}

const actions = {
    changeDrawerShow({ commit }, { show }) {
        commit("changeDrawerShow", { show });
    },
    setApiInfo({ commit }, { info }) {
        commit("setApiInfo", { info })
    },
    setDic({ commit }, dic) {
        commit("setDic", dic)
    },
    setHistoryList({ commit }, info) {
        commit("setHistoryList", info)
    },
    setNowHistory({ commit }, nowHistory) {
        commit("setNowHistory", nowHistory)
    },
    addToHistoryList({ commit }, info) {
        commit('addToHistoryList', info)
    },
    clearHistoryList({ commit }) {
        commit('clearHistoryList')
    },
    lastHistory({ commit }) {
        commit('lastHistory')
    },
    nextHistory({ commit }) {
        commit('nextHistory')
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}