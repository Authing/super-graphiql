const queries = {
    getClientWhenSdkInit: `
query getClientWhenSdkInit(
    $secret: String
    $clientId: String
    $retUserId: Boolean
    $timestamp: String
    $signature: String
    $nonce: Int
) {
    getClientWhenSdkInit(
        secret: $secret
        clientId: $clientId
        retUserId: $retUserId
        timestamp: $timestamp
        signature: $signature
        nonce: $nonce
    ) {
        clientInfo {
            _id
            user {
                _id
                username
            }
            clientType {
                _id
                name
                description
                image
                example
            }
            usersCount
            logo
            emailVerifiedDefault
            registerDisabled
            showWXMPQRCode
            useMiniLogin
            allowedOrigins
            name
            secret
            token
            descriptions
            jwtExpired
            createdAt
            isDeleted
            frequentRegisterCheck {
                timeInterval
                limit
                enable
            }
            loginFailCheck {
                timeInterval
                limit
                enable
            }
            enableEmail
        }
        accessToken
    }
}    
    `,

    register: `
mutation register(
    $username: String
    $email: String
    $password: String!
    $lastIP: String
    $forceLogin: Boolean
    $registerInClient: String!
    $phone: String
    $invitationCode: String
    $browser: String
    ) {
    register(
        userInfo: {
        email: $email
        password: $password
        lastIP: $lastIP
        forceLogin: $forceLogin
        registerInClient: $registerInClient
        phone: $phone
        username: $username
        browser: $browser
        }
        invitationCode: $invitationCode
    ) {
        _id
        email
        emailVerified
        username
        nickname
        company
        photo
        phone
        browser
        password
        token
        loginsCount
        group {
        name
        }
        blocked
    }
}
    `,

    login: `
mutation login(
  $email: String
  $password: String
  $lastIP: String
  $registerInClient: String!
  $verifyCode: String
  $phone: String
  $username: String
  $browser: String
) {
  login(
    email: $email
    password: $password
    lastIP: $lastIP
    registerInClient: $registerInClient
    verifyCode: $verifyCode
    phone: $phone
    username: $username
    browser: $browser
  ) {
    _id
    email
    emailVerified
    username
    nickname
    company
    photo
    browser
    password
    token
    loginsCount
    group {
      name
    }
    blocked
  }
}
    `,

    decodeJwtToken: `
query decodeJwtToken($token: String!){
  decodeJwtToken(token: $token){
    data{
      email
      id
      clientId
      unionid
    }
    status{
      message
      code
      status
    }
    iat
    exp
  }
}
    `,

    refreshToken: `
mutation RefreshToken($client: String!, $user: String!) {
    refreshToken(client: $client, user: $user) {
        token
        iat
        exp
    }
}
    `,

    user: `
query user(
  $id: String!
  $registerInClient: String!
  $userLoginHistoryPage: Int
  $userLoginHistoryCount: Int
) {
  user(
    id: $id
    registerInClient: $registerInClient
    userLoginHistoryPage: $userLoginHistoryPage
    userLoginHistoryCount: $userLoginHistoryCount
  ) {
    _id
    email
    phone
    emailVerified
    username
    nickname
    unionid
    openid
    company
    photo
    browser
    device
    registerInClient
    registerMethod
    oauth
    token
    tokenExpiredAt
    loginsCount
    lastLogin
    lastIP
    signedUp
    blocked
    isDeleted
    group {
      _id
      name
      descriptions
      createdAt
    }
    clientType {
      _id
      name
      description
      image
      example
    }
    userLocation {
      _id
      when
      where
    }
    userLoginHistory {
      totalCount
      list {
        _id
        when
        success
        ip
        result
        device
        browser
      }
    }
    systemApplicationType {
      _id
      name
      descriptions
      price
    }
  }
}
    `,

    users: `
query users($registerInClient: String, $page: Int, $count: Int, $populate: Boolean) {
    users(registerInClient: $registerInClient, page: $page, count: $count, populate: $populate) {
        totalCount
        list {
            _id
            email
            emailVerified
            username
            nickname
            photo
            loginsCount
            lastLogin
            phone
        }
    }
}    
    `,

    checkLoginStatus: `
query checkLoginStatus($token: String) {
    checkLoginStatus(token: $token) {
        message
        code
        status
        token {
            data {
                email
                id
                clientId
                unionid
            }
            iat
            exp
        }
    }
}
    `,

    removeUsers: `
mutation removeUsers($ids: [String], $registerInClient: String, $operator: String) {
    removeUsers(ids: $ids, registerInClient: $registerInClient, operator: $operator) {
        _id
    }
}
    `,

    updateUser: `
mutation UpdateUser(
  $id: String!
  $email: String
  $username: String
  $photo: String
  $nickname: String
  $company: String
  $password: String
  $oldPassword: String
  $registerInClient: String
  $phone: String
  $browser: String
) {
  updateUser(
    options: {
      _id: $id
      email: $email
      username: $username
      photo: $photo
      nickname: $nickname
      company: $company
      password: $password
      oldPassword: $oldPassword
      registerInClient: $registerInClient
      phone: $phone
      browser: $browser
    }
  ) {
    _id
    email
    emailVerified
    username
    nickname
    company
    photo
    browser
    registerInClient
    registerMethod
    oauth
    token
    tokenExpiredAt
    loginsCount
    lastLogin
    lastIP
    signedUp
    blocked
    isDeleted
  }
}  
    `,

    sendResetPasswordEmail: `
mutation SendResetPasswordEmail($email: String!, $client: String!) {
  sendResetPasswordEmail(email: $email, client: $client) {
    message
    code
  }
}   
    `,

    verifyResetPasswordVerifyCode: `
mutation VerifyResetPasswordVerifyCode(
  $email: String!
  $client: String!
  $verifyCode: String!
) {
  verifyResetPasswordVerifyCode(
    email: $email
    client: $client
    verifyCode: $verifyCode
  ) {
    message
    code
  }
}
    `,

    sendVerifyEmail: `
mutation SendVerifyEmail($email: String!, $client: String!) {
  sendVerifyEmail(email: $email, client: $client) {
    message
  }
}
    `,

    changePassword: `
mutation ChangePassword(
  $email: String!
  $client: String!
  $password: String!
  $verifyCode: String!
) {
  changePassword(
    email: $email
    client: $client
    password: $password
    verifyCode: $verifyCode
  ) {
    _id
    email
    emailVerified
    username
    nickname
    company
    photo
    browser
    registerInClient
    registerMethod
    oauth
    token
    tokenExpiredAt
    loginsCount
    lastLogin
    lastIP
    signedUp
    blocked
    isDeleted
  }
}  
    `,

    unbindEmail: `
mutation unbindEmail($user: String, $client: String) {
  unbindEmail(user: $user, client: $client) {
    _id
    email
  }
}
    `,

    userClients: `
query getUserClients($userId: String!, $page: Int, $count: Int) {
  userClients(userId: $userId, page: $page, count: $count) {
    totalCount
    list {
      _id
      name
      descriptions
      jwtExpired
      createdAt
      isDeleted
      secret
      logo
      clientType {
        _id
        name
        description
        image
        example
      }
    }
  }
}
    `,

    client: `
query client($id: String!, $userId: String!) {
  client(id: $id, userId: $userId) {
    _id
    name
    descriptions
    jwtExpired
    createdAt
    secret
    isDeleted
    logo
    emailVerifiedDefault
    registerDisabled
    showWXMPQRCode
    useMiniLogin
    allowedOrigins
    user {
      _id
      email
      username
      emailVerified
    }
    clientType {
      _id
      name
      description
      image
      example
    }
    frequentRegisterCheck {
      timeInterval
      limit
      enable
    }
    loginFailCheck {
      timeInterval
      limit
      enable
    }
    enableEmail
  }
}
    `,

    userClientTypes: `
query getUserClientType {
    userClientTypes {
        _id
        name
        description
        image
        example
    }
}  
    `,

    queryPermissionList: `
query queryPermissionList {
  queryPermissionList {
    list {
      _id
      name
      affect
      description
    }
  }
}
    `,

    isClientBelongToUser: `
query isClientBelongToUser(
    $userId: String
    $clientId: String
    $permissionDescriptors: [permissionDescriptorsListInputType]
) {
    isClientBelongToUser(userId: $userId, clientId: $clientId, permissionDescriptors: $permissionDescriptors)
}
    
    `,

    removeUserClients: `
mutation removeUserClients($ids: [String]) {
  removeUserClients(ids: $ids) {
    _id
  }
}  
    `,

    updateUserClient: `
mutation updateUserClient(
  $_id: String!
  $name: String
  $userId: String!
  $descriptions: String
  $allowedOrigins: String
  $jwtExpired: Int
  $registerDisabled: Boolean
  $showWXMPQRCode: Boolean
  $useMiniLogin: Boolean
  $emailVerifiedDefault: Boolean
  $frequentRegisterCheck: FrequentRegisterCheckConfigInput
  $loginFailCheck: LoginFailCheckConfigInput
  $enableEmail: Boolean
  $logo: String
) {
  updateUserClient(
    client: {
      _id: $_id
      name: $name
      userId: $userId
      descriptions: $descriptions
      jwtExpired: $jwtExpired
      allowedOrigins: $allowedOrigins
      registerDisabled: $registerDisabled
      showWXMPQRCode: $showWXMPQRCode
      useMiniLogin: $useMiniLogin
      emailVerifiedDefault: $emailVerifiedDefault
      frequentRegisterCheck: $frequentRegisterCheck
      loginFailCheck: $loginFailCheck
      enableEmail: $enableEmail
      logo: $logo
    }
  ) {
    _id
    name
    descriptions
    jwtExpired
    createdAt
    isDeleted
    allowedOrigins
    registerDisabled
    showWXMPQRCode
    useMiniLogin
    emailVerifiedDefault
    logo
    clientType {
      _id
      name
      description
      image
      example
    }
    user {
      _id
      email
      username
      emailVerified
    }
    frequentRegisterCheck {
      enable
      limit
      timeInterval
    }
    loginFailCheck {
      timeInterval
      limit
      enable
    }
    enableEmail
  }
}
    `,

    bindOtherOAuth: `
mutation bindOtherOAuth(
  $user: String
  $client: String
  $type: String!
  $unionid: String!
  $userInfo: String!
) {
  bindOtherOAuth(
    user: $user
    client: $client
    type: $type
    unionid: $unionid
    userInfo: $userInfo
  ) {
    _id
  }
}
    `,

    unbindOtherOAuth: `
mutation unbindOtherOAuth($user: String, $client: String, $type: String!) {
  unbindOtherOAuth(user: $user, client: $client, type: $type) {
    _id
    type
  }
}  
    `,

    setInvitationState: `
mutation setUserInvitationEnable($client: String!, $enablePhone: Boolean!) {
  setInvitationState(client: $client, enablePhone: $enablePhone) {
    client
    enablePhone
    createdAt
    updatedAt
  }
}
    `,

    queryInvitationState: `
query getUserInvitationEnable($client: String!) {
  queryInvitationState(client: $client) {
    client
    enablePhone
  }
}
    `,

    addToInvitation: `
mutation addInvitationUser($client: String!, $phone: String!) {
  addToInvitation(client: $client, phone: $phone) {
    client
    phone
  }
}
    `,

    removeFromInvitation: `
mutation removeInvitationUser($client: String!, $phone: String!) {
  removeFromInvitation(client: $client, phone: $phone) {
    client
    phone
  }
}   
    `,

    queryInvitation: `
query getUserInvitationList($client: String!) {
  queryInvitation(client: $client) {
    client
    phone
  }
}   
    `,

    queryMFA: `
query queryMFA($_id: String, $userId: String, $userPoolId: String) {
	queryMFA(_id: $_id, userId: $userId, userPoolId: $userPoolId) {
		_id
		userId
		userPoolId
		enable
		shareKey
	}
}
    `,

    changeMFA: `
mutation changeMFA($_id: String, $userId: String, $userPoolId: String, $enable: Boolean!, $refreshKey: Boolean) {
    changeMFA(_id: $_id, userId: $userId, userPoolId: $userPoolId, enable: $enable, refreshKey: $refreshKey) {
        _id
        userId
        userPoolId
        enable
        shareKey
    }
}    
    `,

    addClientWebhook: `
mutation addClientWebhook(
  $url: String!
  $events: [String!]!
  $client: String!
  $secret: String
  $contentType: String!
  $enable: Boolean!
) {
  addClientWebhook(
    url: $url
    events: $events
    client: $client
    secret: $secret
    enable: $enable
    contentType: $contentType
  ) {
    _id
  }
}    
    `,

    getAllWebhooks: `
query getAllWebhooks($client: String!) {
  getAllWebhooks(client: $client) {
    _id
    url
    events {
      name
      label
    }
    contentType
    client
    secret
    enable
    isLastTimeSuccess
  }
}  
    `,

    getWebhookLogs: `
query getWebhookLogs($webhook: String!) {
  getWebhookLogs(webhook: $webhook) {
    _id
    event
    response {
      statusCode
    }
    errorMessage
    when
  }
} 
    `,

    getWebhookLogDetail: `
query getWebhookLogDetail($id: String!) {
  getWebhookLogDetail(id: $id) {
    _id
    request {
      headers
      payload
    }
    response {
      headers
      body
      statusCode
    }
    errorMessage
    when
  }
}   
    `,

    getWebhookSettingOptions: `
query getWebhookSettingOptions{
  getWebhookSettingOptions{
    webhookEvents{
      name
    }
    contentTypes{
      name
    }
  } 
}
    `,

    updateClientWebhook: `
mutation updateClientWebhook(
  $id: String!
  $url: String!
  $events: [String!]!
  $secret: String
  $enable: Boolean!
  $contentType: String!
) {
  updateClientWebhook(
    id: $id
    url: $url
    events: $events
    secret: $secret
    enable: $enable
    contentType: $contentType
  ) {
    _id
  }
}
    `,

    deleteClientWebhook: `
mutation deleteClientWebhook($id: String!) {
  deleteClientWebhook(id: $id) {
    _id
  }
}
    `,

    SendWebhookTest: `
mutation SendWebhookTest($id: String!) {
  SendWebhookTest(id: $id)
} 
    `,

    LoginByLDAP: `
mutation LoginByLDAP($username: String!, $password: String!, $clientId: String!, $browser: String) {
	LoginByLDAP(username: $username, password: $password, clientId: $clientId, browser: $browser) {
		_id
		email
		unionid
		openid
		emailVerified
		phone
		phoneVerified
		username
		nickname
		company
		photo
		browser
		registerMethod
		registerInClient
		oauth
		token
		tokenExpiredAt
		loginsCount
		lastIP
		signedUp
		blocked
		isDeleted
	}
}

    `,

    GetUserAuthorizedApps: `
query GetUserAuthorizedApps(
  $clientId: String
  $userId: String
  $page: Int
  $count: Int
) {
  GetUserAuthorizedApps(
    clientId: $clientId
    userId: $userId
    page: $page
    count: $count
  ) {
    OAuthApps {
      _id
      name
      image
    }
    OIDCApps {
      _id
      name
      image
    }
    totalCount
  }
}  
    `,

    RevokeUserAuthorizedApp:`
mutation RevokeUserAuthorizedApp($appId: String, $userPoolId: String, $userId: String) {
	RevokeUserAuthorizedApp(appId: $appId, userId: $userId, userPoolId: $userPoolId) {
		_id
		appId
		userId
		scope
		type
		isRevoked
		when
	}
}
    `

}


export default queries