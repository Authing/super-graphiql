const state = {
    drawerShow: false,
    apiInfo: {},
    dic: {},
    historyList: [],
    nowHistory: 0,
    apiDocs: {
        getClientWhenSdkInit: {
            name: '初始化',
            brief: 'SDK 初始化时获取客户端信息和 accessToken 信息，后续的管理用户的操作请发送此 Token，在下文中，此 Token 命名为「OwnerToken」。',
            type: '用户池鉴权'
        },
        login: {
            name: '登录',
            brief: '此接口用来执行用户登录的操作，登录成功后会返回 UserToken，建议单独维护此 Token。\n多种登录方式参见 https://docs.authing.cn/authing/sdk/open-graphql#deng-lu',
            type: '用户鉴权'
        },
        refreshToken: {
            name: '刷新 Token',
            brief: '此接口用来刷新 Token，Token 是用户登录的凭证',
            type: '用户鉴权'
        },
        register: {
            name: '注册',
            brief: '用户注册。\n此接口不需要发送任何 Token, 密码采用非对称加密方式。参见 https://docs.authing.cn/authing/sdk/open-graphql#zhu-ce',
            type: '用户鉴权'
        },
        user: {
            name: '读取用户资料',
            brief: '获取用户资料，建议使用 OwnerToken。\n支持批量获取用户资料，参见 https://docs.authing.cn/authing/sdk/open-graphql#du-qu-yong-hu-zi-liao',
            type: '用户管理'
        },
        users: {
            name: '获取用户列表',
            brief: '此接口用来读取用户列表，建议使用 OwnerToken',
            type: '用户管理'
        },
        checkLoginStatus: {
            name: '检查用户登录状态',
            brief: '此接口需要发送 Token，请使用 UserToken。',
            type: '用户管理'
        },
        removeUsers: {
            name: '删除用户数据',
            brief: '此接口用来删除用户数据，建议使用 OwnerToken。',
            type: '用户管理'
        },
        updateUser: {
            name: '更新用户资料',
            brief: '此接口用来更新用户资料，建议使用 OwnerToken。',
            type: '用户管理'
        },
        sendResetPasswordEmail: {
            name: '发送重置密码邮件',
            brief: '此接口用来发送验证码短信。',
            type: '用户管理'
        },
        verifyResetPasswordVerifyCode: {
            name: '验证重置密码验证码',
            brief: '此接口用来验证重置密码验证码。',
            type: '用户管理'
        },
        sendVerifyEmail: {
            name: '发送验证邮件',
            brief: '此接口用来发送验证邮件，注意：此接口不用发送任何 Token。',
            type: '用户管理'
        },
        changePassword: {
            name: '修改密码',
            brief: '此接口用来更改忘记密码后的新密码，需要携带 verifyCode，不用发送 Token，正常的密码修正请使用上面的 update 接口。',
            type: '用户管理'
        },
        decodeJwtToken: {
            name: '解析 JWT Token',
            brief: '此接口用来解析 JWT Token。',
            type: '用户管理'
        },

        client: {
            type: '用户池管理'
        },
        userClients: {
            type: '用户池管理'
        },
        userClientTypes: {
            type: '用户池管理'
        },
        isClientOfUser: {
            type: '用户池管理'
        },
        userClientList: {
            type: '用户池管理'
        },
        isClientBelongToUser: {
            type: '用户池管理'
        },
        queryClient: {
            type: '用户池管理'
        },
        UserClientType: {
            type: '用户池管理'
        },
        UserClient: {
            type: '用户池管理'
        },
        PagedUserClients: {
            type: '用户池管理'
        },
        PagedUserClientList: {
            type: '用户池管理'
        },
        pagedUserClientListItem: {
            type: '用户池管理'
        },
        newClient: {
            type: '用户池管理'
        },
        removeUserClients: {
            type: '用户池管理'
        },
        updateUserClient: {
            type: '用户池管理'
        },

        bindOtherOAuth: {
            name: '绑定社会化登录',
            brief: '用户绑定第三方登录方式。此接口发送 UserToken。',
            type: '社会化登录'
        },
        unbindOtherOAuth: {
            name: '取消绑定社会化登录',
            brief: '用户解绑第三方登录方式。此接口发送 UserToken。',
            type: '社会化登录'
        },
        unbindEmail: {
            name: '解绑邮箱',
            brief: '用户解绑 Email。',
            type: '用户管理'
        },
        setInvitationState: {
            name: '开启/关闭手机号注册白名单限制',
            brief: '开启或关闭手机号注册时的白名单限制。',
            type: '注册白名单'
        },
        queryInvitationState: {
            name: '查看用户池的手机号白名单开启状态',
            brief: '此接口需要发送 Token，建议直接使用 OwnerToken。',
            type: '注册白名单'
        },
        addToInvitation: {
            name: '增加手机号到白名单',
            brief: '此接口需要发送 Token，建议直接使用 OwnerToken。',
            type: '注册白名单'
        },
        removeFromInvitation: {
            name: '从白名单中删除手机号',
            brief: '此接口需要发送 Token，建议直接使用 OwnerToken。',
            type: '注册白名单'
        },
        queryInvitation: {
            name: '查看白名单中的手机号',
            brief: '此接口需要发送 Token，建议直接使用 OwnerToken。',
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
        getWebhookDetail: {
            type: 'WebHook API'
        },
        getAllWebhooks: {
            type: 'WebHook API'
        },
        getWebhookLogDetail: {
            type: 'WebHook API'
        },
        getWebhookLogs: {
            type: 'WebHook API'
        },
        getWebhookSettingOptions: {
            type: 'WebHook API'
        },
        ClientWebhook: {
            type: 'WebHook API'
        },
        WebhookEvent: {
            type: 'WebHook API'
        },
        WebhookLog: {
            type: 'WebHook API'
        },
        WebhookRequestType: {
            type: 'WebHook API'
        },
        WebhookResponseType: {
            type: 'WebHook API'
        },
        WebhookSettingOptions: {
            type: 'WebHook API'
        },
        WebhookContentType: {
            type: 'WebHook API'
        },
        addClientWebhook: {
            type: 'WebHook API'
        },
        updateClientWebhook: {
            type: 'WebHook API'
        },
        deleteClientWebhook: {
            type: 'WebHook API'
        },
        SendWebhookTest: {
            type: 'WebHook API'
        },
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