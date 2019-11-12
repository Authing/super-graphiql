const queries = require("./queries").default

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
            - \`registerMethod\`:注册方式。开发者最好提供此字段，如未提供，Authing 将从其他是否提供 \`unionid\`，\`email\`, \`phone\`， \`username\` 四个字段推测注册方式（优先级递减，比如同时提供 \`unionid\` 和 \`email\`，会被视为 \`unionid\` 方式注册）。
            - \`unionid\`
            - \`email\`
            - \`phone\`: 注：若管理员开启了注册白名单机制，此手机号需要在白名单之内。
            - \`password\`: 加密过后的密码，加密方式见[Authing官方文档](https://docs.authing.cn/authing/v/master/sdk/open-graphql#zhu-yi-shi-xiang-2)。
            - \`forceLogin\`: 默认为 false, 如果设置为 true, 用户不存在时会先自动创建。
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
此接口用来执行用户登录操作。
1. 登录场景：
- 用户名登录
- 邮箱登录
- 手机号作为用户名登录
- 手机号验证码

2. 请求参数：
- 必填参数
    - registerInClient: 用户池 ID
- 可选参数
    - 用户名登录
        - username
        - password
    - 邮箱登录
        - email
        - password
    - 手机号作为用户名登录
        - phone
        - password
    - 手机号验证码登录
        - phone
        - phoneCode

            `,
            type: '用户鉴权'
        },
        decodeJwtToken: {
            name: '解析 JWT Token',
            brief: `
此接口用来解析 JWT Token。
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
此接口用来刷新指定用户的 JWT token。
1. 此 JWT token 有什么用？

每个用户都有唯一对应的 JWT token, 作为登录凭证。

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
            type: '用户鉴权',
            tokenType: "both"
        },

        user: {
            name: '读取用户资料',
            brief: `
此接口用来读取用户资料。同时支持用户 ID 和用户登录凭证读取。
1. 部分请求参数说明
- 可选参数：
    - registerInClient: 用户池 ID。
    - id: 用户 ID。
    - token: 该用户（**非开发者**）的登录凭证，如果指定，将会忽略 ID 字段。
    - auth: 布尔值
    - userLoginHistoryPage: 用户登录记录分页数。
    - userLoginHistoryCount: 用户登录记录每页数目。

2. 返回结果部分字段说明
- group: 所在群组
- clientType: 用户池类型
- userLocation: 用户地址
- userLoginHistory: 用户历史登录记录。
            `,
            type: '用户管理',
            tokenType: "both"

        },
        users: {
            name: '获取用户列表',
            brief: `
此接口用来获取用户列表，支持分页。用户信息支持基础信息和附带扩展字段两种模式。
部分请求参数说明
- registerInClient：用户池 ID
- page: 第几页。
- count：一页包含用户数目，默认为10，最大为200。
- populate：布尔值。默认为 false, 如果为 true,将会返回用户的扩展字段：group、clientType、userLocation 、userLoginHistory、systemApplicationType（详情见”读取用户资料”接口）。

            `,
            type: '用户管理',
            tokenType: "admin"
        },

        checkLoginStatus: {
            name: '检查用户登录状态',
            brief: `
此接口用来检查用户登录状态。
请求参数说明
- 必填项
    - token: 指定用户的登录凭证。
            `,
            type: '用户管理'
        },


        removeUsers: {
            name: '批量删除用户',
            brief: `
此接口用来批量删除用户。
只有用户池（或协作用户池）管理员才能执行此操作。
参数说明
- ids: 列表类型。
- registerInClient: 用户池 ID
- operator: 操作人ID, Authing 会记录，便于之后审计。 
            `,
            type: '用户管理',
            tokenType: "admin"
        },

        updateUser: {
            name: '更新用户资料',
            brief: `
此接口用来更新用户资料。
1. 部分参数说明
- options
    - 必填参数
        - _id: 用户ID
        - registerInClient: 用户池 ID
    - 其他字段均可选，**只需要填你想要修改的字段**。

            `,
            type: '用户管理',
            tokenType: "both"
        },

        sendResetPasswordEmail: {
            name: '发送重置密码邮件',
            brief: `
此接口用来发送"重置密码"邮件。
Authing 提供开箱即用的邮件模块，开发者可以在 **消息服务** -> **邮件模版** 查看或修改邮件模板。
详细内容请见 [Authing官方文档](https://docs.authing.cn/authing/messages/email)。
            `,
            type: '用户管理',
            tokenType: "both"
        },

        verifyResetPasswordVerifyCode: {
            name: '验证重置密码验证码',
            brief: `
此接口用来发送“重置密码”邮件。   
`,
            type: '用户管理',
        },
        sendVerifyEmail: {
            name: '发送验证邮件',
            brief: `
此接口用来发送“验证邮箱”邮件。
            `,
            type: '用户管理'
        },
        changePassword: {
            name: '修改密码',
            brief: `
此接口用来修改密码。只支持通过邮箱注册的账号的密码，不需要登录，但是需要使用验证码。
1. 请求参数说明
- password: 新密码，需要加密，加密方式见[Authing官方文档](https://docs.authing.cn/authing/v/master/sdk/open-graphql#zhu-yi-shi-xiang-2)。
- client: 用户池 ID
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
此接口用来解绑邮箱。
> 注：如果没有配置其他登录方式（手机号、OAuth），将无法解绑邮箱。如需解绑，请先配置另一个登录方式。

请求参数说明
- user: 用户ID
- client: 用户池ID
`,
            type: '用户管理',
            tokenType: "both"
        },

        clientRoles: {
            name: '获取应用下所有角色',
            type: '用户管理',
            brief: `
此接口用来获取应用下所有角色。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#huo-qu-ying-yong-xia-suo-you-jiao-se)

1. 用户角色有什么用？
用户角色是 Authing 管理用户的一种手段，你可以为角色设定任意的权限字符串，可以是 JSON 或数组；之后通过 Authing 的 API 获取设置的权限既而实现自己的业务逻辑。如下图所示：在 Authing 后台为用户池配置了一个名为“管理员”的角色，
你可以使用 Authing 提供的接口和 [SDK](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions) 获取到对应的权限：\`["删除用户"]\`
之后便能够很好地和你的实际业务结合起来。

![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-11-12-120145.png)

2. 角色和用户的关系

- 一个角色具备特定的权限，可以包含一个或多个用户。

- 一个用户可以同时拥有多个角色。

3. 如何查看用户池的用户角色列表？

访问 **用户池** -> **用户中心** -> **用户角色**
            `,
            tokenType: 'admin'
        },

        queryRoleByUserId: {
            name: '获取用户权限和角色',
            type: '用户管理',
            brief: `
此接口用来获取特定用户拥有的角色和权限。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#huo-qu-yong-hu-quan-xian-he-jiao-se)

1. 参数说明：
- client: 用户池 ID
- user: 用户 ID

2. 返回数据示例：
\`\`\`
{
    "totalCount": 1,
    "list": [
      {
        "group": {
          "name": "管理员",
          "permissions": "[\"删除用户\"]"
        }
      },
    ]
}
\`\`\`
            `,
            tokenType: 'both'

        },

        createRole: {
            name: '创建用户角色',
            type: '用户管理',
            brief: `
此接口用来创建用户角色。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#chuang-jian-yong-hu-jiao-se)


返回数据示例：
\`\`\`
{
    "_id": "5ca5c5dd8a61c7ffbfb129a9",
    "name": "测试角色",
    "client": "5c9c659cb9440b05cb2570e6",
    "descriptions": "测试角色的描述",
    "permissions": "[\"权限点1\"]"
}
\`\`\`
            `,
            token: 'admin'
        },

        updateRole: {
            name: "修改用户角色",
            type: '用户管理',
            brief: `
此接口用来修改用户角色。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#xiu-gai-jiao-se-quan-xian)


1. 参数说明：
- 角色 ID（\`_id\`）是必传的。

2. 返回数据示例：
\`\`\`
{
    "_id": "5ca5c5dd8a61c7ffbfb129a9",
    "name": "测试角色",
    "client": "5c9c659cb9440b05cb2570e6",
    "descriptions": "测试角色的描述",
    "permissions": "[\"权限点1\"]"
}
\`\`\`
            `,
            tokenType: 'admin'
        },

        assignUserToRole: {
            name: '指派用户到某角色',
            type: '用户管理',
            brief: `
此接口用来指派用户到某角色。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#zhi-pai-yong-hu-dao-mou-jiao-se)

1. 如何在后台指派用户到某角色？
![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-11-12-125809.png)

2. 参数说明：
- client: 必填，用户池 ID。
- user: 必填，用户 ID。
- group: 必填，角色 ID。
            `,
            tokenType: 'admin'
        },

        removeUserFromGroup: {
            name: '将用户从某角色中移除',
            type: '用户管理',
            brief: `
此接口用来将用户从某角色中移除。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#jiang-yong-hu-cong-mou-jiao-se-zhong-yi-chu)

1. 参数说明：
- client: 必填，用户池 ID。
- user: 必填，用户 ID。
- group: 必填，角色 ID。
            `,
            tokenType: 'admin'
        },

        usersInGroup: {
            name: '获取某角色下全部用户',
            type: '用户管理',
            brief: `
此接口用来获取某角色下全部用户。

> 点击查看[此接口 Node SDK 文档地址](https://learn.authing.cn/authing/sdk/sdk-for-node/update-user-permissions#huo-qu-mou-jiao-se-xia-quan-bu-yong-hu)

1. 参数说明：
- group: 必填，角色 ID。
- page: 选填，默认为 1。
- count: 选填，默认为 10。

2. 返回数据示例：
\`\`\`
{
    "totalCount": 2,
    "list": [
        {
            "_id": "5dc9695999128a6baf15e44b",
            "group": {
                "_id": "5da9c92a2a24432643a33969"
            },
            "client": {
                "_id": "5c95905578fce5000166f853"
            },
            "user": {
                "_id": "5dc8c6b7ebafee83c95b9c8b",
                "photo": "https://usercontents.authing.cn/authing-avatar.png",
                "username": "hrpw0awin7d@test.com",
                "email": "hrpw0awin7d@test.com"
            },
            "createdAt": "2019-11-11 21:59:53"
        }
    ]
}
\`\`\`
            `,
            tokenType: 'admin'
        },


        userClients: {
            name: "用户池列表",
            brief: `
此接口用来获取用户池列表，支持分页。
1. 请求参数说明
    - 必填参数
        - userId: 用户 ID, 只能填开发者自己的用户 ID, 填其他人的会报权限错误。
    - 可选参数
        - page: 页数
        - count: 每页数目
        - computeUsersCount: 布尔值没，是否计算用户总数。

2. 返回数据说明
- totalCount: 用户池总数
- list：用户池列表，列表元素字段含义请见 用户池详情 接口。
            `,
            type: '用户池管理',
            tokenType: "admin"
        },

        client: {
            name: "用户池详情",
            brief: `
此接口用来获取用户池详情。
1. 请求参数
- 必填参数
    - id: 用户池 ID
    - userId: 用户池创建者 ID

2. 部分返回数据说明
- user: 用户池创建者。
- usersCount: 用户总数
- emailVerifiedDefault: 布尔值， 注册时邮箱需不需要验证。true 无需验证，false 表示需要验证。
- registerDisabled: 布尔值，true 为应用池已关闭注册，false 为未关闭注册。
- showWXMPQRCode: 布尔值，是否显示微信小程序扫码登录。
- useMiniLogin: 是否使用微信小程序“小登录”。
- allowedOrigins: 安全域（Allowed Origins） 是允许从 JavaScript 向 Authing API 发出请求的 URL（通常与 CORS 一起使用）。 默认情况下，系统会允许你使用所有网址。 如果需要，此字段允许你输入其他来源。 你可以通过逐行分隔多个有效 URL，并在子域级别使用通配符（例如：https://*.sample.com）。 验证这些 URL 时不考虑查询字符串和哈希信息，如果带上了查询字符串和哈希信息系统会自动忽略整个域名。
- secret: 用户池密钥，通过 **用户池** -> **基础配置** 可以查看。
- jwtExpired: JWT Token 过期时间
- frequentRegisterCheck: 注册频率限制。
            `,
            type: '用户池管理',
            tokenType: "admin"
        },

        userClientTypes: {
            name: "获取用户池类型",
            brief: `
此接口用来获取用户池类型。
目前 Authing 支持 Web, IOS, Andoid, 小程序 四种用户池。
            `,
            type: '用户池管理',
            tokenType: "admin"
        },

        // userClientList: {
        //     type: '用户池管理'
        // },

        queryPermissionList: {
            name: "用户池权限列表",
            type: "用户池管理",
            brief: `
此接口用来查询用户池权限列表。

Authing 目前支持以下权限点：你可以向协作者开放其所需要的权限。
![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102003.png)
            `,
            tokenType: "admin"
        },

        isClientBelongToUser: {
            type: '用户池管理',
            name: "是否具备用户池相关权限",
            brief: `
此接口用来查看是否具备用户池相关权限。
1. 请求参数说明
- userId: 用户 ID
- clientId: 用户池 ID
- permissionDescriptors: 权限描述列表

2. 用户池可以配置哪些权限点？

Authing 目前支持以下权限点：你可以向协作者开放其所需要的权限。
![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102003.png)

            `,
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
            name: "批量删除用户池",
            brief: `
此接口用来删除用户池，支持批量操作。

请求参数说明
- ids: 用户池 ID 列表。
            `,
            tokenType: "admin"
        },
        updateUserClient: {
            type: '用户池管理',
            name: "修改用户池",
            brief: `
此接口用来修改用户池资料。
请求参数说明
- client
    - _id: 用户池 ID，必填。
    - 其他字段均可选，只需要填你想要修改的字段。
            `,
            tokenType: "admin"
        },

        bindOtherOAuth: {
            name: '绑定社会化登录',
            brief: `
此接口用来绑定第三方社会化账号, Authing 目前支持微信和 GitHub 两种。
请求参数说明
- user: 用户 ID
- client: 用户池 ID
- type: 第三方社会化账号平台，选项为 "github" 和 "wechat"。
- unionid: 第三方社会化账号在此平台的 unionid
- userInfo: 第三方社会化账号的资料,可以是任意字符串。
`,
            type: '社会化登录',
            tokenType: "both"
        },
        unbindOtherOAuth: {
            name: '取消绑定社会化登录',
            brief: `
此接口用来解绑社会化登录。
请求参数说明
- user: 用户 ID
- client: 用户池 ID
- type: 第三方社会化账号平台，选项为 "github" 和 "wechat"。
            `,
            type: '社会化登录',
            tokenType: "both"
        },

        setInvitationState: {
            name: '开启/关闭注册白名单限制',
            brief: `
此接口用来开启/关闭注册白名单限制。
> 目前只支持手机号白名单，后续会慢慢支持更多。

请求参数说明：

- client: 用户池 ID。
- enablePhone: 布尔值，是否开启手机号白名单机制。
`,
            type: '注册白名单',
            tokenType: "admin"
        },
        queryInvitationState: {
            name: '查看白名单机制开启状态',
            brief: `
此接口用来查看白名单机制开启状态。
请求参数说明：
- client: 用户池ID
            `,
            type: '注册白名单'
        },
        addToInvitation: {
            name: '增加手机号到白名单',
            brief: `
此接口用来增加手机号到白名单。
请求参数说明：
- client: 用户池 ID
- phone: 手机号
            `,
            type: '注册白名单',
            tokenType: "admin"
        },
        removeFromInvitation: {
            name: '从白名单中删除手机号',
            brief: `
此接口用来从白名单中删除手机号。
请求参数说明：
- client: 用户池 ID
- phone: 手机号
            `,
            type: '注册白名单',
            tokenType: "admin"
        },
        queryInvitation: {
            name: '查看白名单中的手机号',
            brief: `
此接口用来查看白名单中的手机号列表。
请求参数说明：
- client: 用户池 ID
            `,
            type: '注册白名单',
            tokenType: "admin"
        },

        queryMFA: {
            name: '查询 MFA 配置',
            brief: `
此接口用来查询 MFA 配置。
多因素身份验证（MFA）是一种安全系统，是为了验证一项操作合法性而实行多种身份验证。例如银行的 U 盾，异地登录要求手机短信验证。开发者可以基于 Authing 的 MFA 功能进行定制化开发。
前往 [Authing官网文档 - MFA](https://learn.authing.cn/authing/mfa/configure-mfa) 查看更多相关内容。 
查询 MFA 信息有两种方式：通过 MFA 主体 id 或者用户 ID 加用户池 ID。
请求参数：
- 通过 MFA 主体 ID 查询
    - _id: MFA 主体 ID
- 通过用户 ID 加用户池 ID 查询
    - userId: 用户ID
    - userPoolId: 用户池ID
- enabled: 是否开启
            `,
            type: 'MFA 多因素认证',
            tokenType: "mfa"
        },
        changeMFA: {
            name: '修改 MFA 信息',
            brief: `
此接口用来修改 MFA 信息。
和“查询  MFA 信息” 一样，修改也有两种方式：通过 MFA 主体 ID 或者用户 ID 加用户池 ID。
请求参数：
- enabled: 布尔值，是否开启。
- refreshKey: 布尔值，是否刷新 MFA 的 shareKey。
            `,
            type: 'MFA 多因素认证',
            tokenType: "mfa"
        },

        addClientWebhook: {
            type: 'WebHook API',
            name: "添加 Webhook",
            brief: `
此接口用来添加 Webhook。相关文档请查看 [Authing官方文档](https://learn.authing.cn/authing/advanced/use-webhook)
1. Webhook 有什么用

Webhooks 允许你对用户注册、登录等**事件**进行监听，从而对其做一些自定义处理。这能让 Authing 和你的业务更好地联动起来。
Authing 内置了丰富的事件，目前包含注册、登录、修改密码、修改用户信息、用户邮箱被验证五种。
开发者可以在后台 **基础配置** -> **Webhook** 里面管理自己的 Webhook。

![](http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102435.png)

2. 支持事件列表

> 支持的事件列表可以通过 “获取 Webhook 配置项” 接口获取。

- register: 注册
- change-user-info: 修改用户信息
- login: 登录
- change-password: 修改密码
- email-verified: 用户邮箱被验证

3. 有哪些应用场景？

假设你的应用有 “用户验证邮箱可获积分” 这个业务需求，你可以添加一个监控 \`email-verified\` 事件的 Webhook, 每次有用户成功验证邮箱之后，
Authing 将会向你定义的 Webhook 地址发送携带该名用户ID的请求，然后你可以通过此用户的 ID 完成相关操作。

4. Authing 的回调请求包含哪些数据？

详情见“发送 Webhook 测试”部分的文档。

5. 请求参数说明
- 必填项
    - client: 用户池 ID
    - events: 监听的事件列表，具体的事件名称见上文。
    - url: Webhook 回调地址
    - contentType: 指定发起 Webhook 请求时 Request body 的数据格式，可选值有 \`application/json\` 和 \`application/x-www-form-urlencoded\`
    - enable: 是否启用。
- 可选参数
    - secret: 请求秘钥。如果设置, Authing将会在向 Webhook 回调地址发起请求时，带上\`X-Authing-Token\` 的请求头。开发者可以对此秘钥进行验证，用来防止第三方的恶意请求。
`,
            tokenType: "admin"
        },

        getAllWebhooks: {
            type: 'WebHook API',
            name: "获取用户池 WebHook 列表",
            brief: `
此接口用来查看配置的 WebHook 列表。
请求参数：
- client: 必填。用户池 ID。
            `,
            tokenType: "admin"
        },

        //         getWebhookDetail: {
        //             name: "获取 webhook 详情",
        //             type: 'WebHook API',
        //             brief: `
        // 获取 webhook 详情。
        //             `
        //         },

        getWebhookLogs: {
            type: 'WebHook API',
            name: "获取 Webhook 日志列表",
            brief: `
此接口用来获取 webhook 日志列表。
1. 请求参数：
- webhook: Webhook ID

2. 返回数据示例

\`\`\`
{ 
    "data":{ 
       "getWebhookLogs":[ 
          { 
             "_id":"5db1027291e5e68013xxxxxxx",
             "event":"login", // 触发的事件为 login
             "response":{ 
                "statusCode":null,
                "__typename":"WebhookResponseType"
             },
             "errorMessage":"Request failed with status code 404",
             "when":"2019-10-24 09:46:26",
             "__typename":"WebhookLog"
          }
       ]
    }
 }
\`\`\`
            `,
            tokenType: "admin"
        },

        getWebhookLogDetail: {
            type: 'WebHook API',
            name: "获取 Webhook 日志详情",
            brief: `
此接口用来获取 Webhook 日志详情。
1. 请求参数
- id：日志 ID。
2. 返回数据示例

- 日志详情里面包含了具体的 \`response\` 和 \`request\`。

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
            `,
            tokenType: "admin"
        },

        getWebhookSettingOptions: {
            type: 'WebHook API',
            name: "获取 Webhook 配置项",
            brief: `
此接口用来获取 Webhook 配置项。此接口无需参数。

返回数据：
\`\`\`
{
    "data": {
      "getWebhookSettingOptions": {
        "contentTypes": [
          {
            "name": "application/json",
            "label": "application/json"
          },
          {
            "name": "application/x-www-form-urlencoded",
            "label": "application/x-www-form-urlencoded"
          }
        ],
        "webhookEvents": [
          {
            "name": "register",
            "label": "注册",
            "description": "注册事件"
          },
          {
            "name": "login",
            "label": "登录",
            "description": "登录事件"
          },
          {
            "name": "change-password",
            "label": "修改密码",
            "description": "修改密码事件"
          },
          {
            "name": "change-user-info",
            "label": "修改用户信息",
            "description": "修改用户信息事件"
          },
          {
            "name": "email-verified",
            "label": "用户邮箱被验证",
            "description": "用户邮箱被验证事件"
          }
        ]
      }
    }
  }
\`\`\`
            `,
            tokenType: "admin"
        },

        updateClientWebhook: {
            type: 'WebHook API',
            name: "修改 Webhook",
            brief: `
此接口用来修改 Webhook。
请求参数：
- 必填项
    - id: Webhook ID
    - events: 监听的事件列表，具体的事件名称见“添加 Webhook”接口。
    - url: webhook 回调地址
    - contentType: 指定发起 Webhook 请求时 Request body 的数据格式，可选值有 \`application/json\` 和 \`application/x-www-form-urlencoded\`
    - enable: 是否启用。
- 可选参数
    - secret: 请求秘钥。如果设置, Authing将会在向 Webhook 回调地址发起请求时，带上\`X-Authing-Token\` 的请求头。开发者可以对此秘钥进行验证，用来防止第三方的恶意请求。
`,
            tokenType: "admin"
        },

        deleteClientWebhook: {
            type: 'WebHook API',
            name: "删除 Webhook",
            brief: `
此接口用来删除 Webhook。
请求参数：
- 必填项
    - id: Webhook ID
            `,
            tokenType: "admin"
        },

        SendWebhookTest: {
            type: 'WebHook API',
            name: "发送 Webhook 测试请求",
            brief: `
发送 Webhook 测试请求。

Authing 将会向该 Webhook 配置的 url 发起 **POST** 请求。
- 请求格式: \`application/json\` 或 \`application/x-www-form-urlencoded\`，开发者可配置（具体查看 "添加 Webhook" 部分）。
- 请求体 body:
\`\`\`
{
    "description": "A test from Authing Webhook"
}
\`\`\`
            `,
            tokenType: "admin"
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
            brief: `
此接口使用 LDAP 登录，登录后返回的 Token 需要在客户端维护。
LDAP 是一个树型的用来存储用户和组织信息的数据库，常被用来做单点登录和组织架构管理。前往[Authing官方文档 - LDAP](https://learn.authing.cn/authing/advanced/ldap)了解更多。 

1. 请求参数：
- 必填项
    - username: 用户名
    - password: 密码
    - clientId: 用户池 ID
- 选填项
    - browser: 访问浏览器

2. 返回数据

登录成功之后会返回登录用户的详细数据，其中包含 \`token\`(登录凭证)，客户端需要妥善保存。
`,
            type: 'OAuth API'
        },
        GetUserAuthorizedApps: {
            name: '查询用户授权过的 SSO 应用列表',
            brief: `
此接口用来查询用户授权过的 SSO 应用列表。此接口需要携带登录凭证 \`token\`，支持分页。
请求参数:
- clientId: 用户池ID
- userId: 用户ID
- page
- count
            `,
            type: 'OAuth API',
            tokenType: "both"
        },
        RevokeUserAuthorizedApp: {
            name: '撤回用户对 SSO 应用的授权',
            brief: `
此接口用来撤回一个用户池内，某个用户对该用户池下的某个 SSO 应用的授权。撤回授权后，用户在 SSO 登录页面登录时，会再次显示确权页面。
请求参数：
- userId: 用户 ID
- userPoolId: 用户池I D
- appId: SSO 应用 ID
`,
            type: 'OAuth API',
            tokenType: "admin"
        },

    },

    queries: queries
}

const getters = {
    drawerShow: () => state.drawerShow,
    apiInfo: () => state.apiInfo,
    dic: () => state.dic,
    historyList: () => state.historyList,
    nowHistory: () => state.nowHistory,
    apiDocs: () => state.apiDocs,
    queries: () => state.queries
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