const queries = require("./queries").default

/*
{
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
    type: '用户池鉴权',
    tokenType: "both"
},
*/

const state = {
    drawerShow: false,
    apiInfo: {},
    dic: {},
    historyList: [],
    nowHistory: 0,
    queries,
    apiDocs: {},
    schemas: []
}

const getters = {
    drawerShow: () => state.drawerShow,
    apiInfo: () => state.apiInfo,
    dic: () => state.dic,
    historyList: () => state.historyList,
    nowHistory: () => state.nowHistory,
    apiDocs: () => state.apiDocs,
    queries: () => state.queries,
    schemas: () => state.schemas
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
    setApiDocs(state, { docs, queries }) {
        state.apiDocs = docs
        state.queries = queries
    },
    setSchemas(state, data) {
        state.schemas = data
    }
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
    },
    loadApiDocs({ commit }) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const data = JSON.parse(this.responseText)
                let docs = {}
                let queries = {}
                for (let key in data) {
                    let api = data[key]
                    let { name, description, query, doc, module } = api
                    docs[key] = {
                        name: description,
                        brief: doc,
                        type: module || ""
                    }
                    queries[key] = query
                }
                commit('setApiDocs', {
                    docs,
                    queries
                })
            }
        };
        xhttp.open("GET", "http://localhost:5678/list");
        xhttp.send();
    },
    setSchemas({ commit }, data) {
        commit('setSchemas', data)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}