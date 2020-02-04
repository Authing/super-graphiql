// 配置
const api = "https://authing.cn/api-docs/list"

const state = {
    drawerShow: false,
    apiInfo: {},
    dic: {},
    historyList: [],
    nowHistory: 0,
    queries: [],
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
                const { list, metadata } = data
                for (let api of list) {
                    let { name, description, query, doc, group, auth } = api
                    let tokenType = ""
                    if (auth === "admin") {
                        tokenType = "admin"
                    } else if (auth === "user") {
                        tokenType = "both"
                    }
                    docs[name] = {
                        name: description,
                        brief: doc,
                        type: group || "",
                        tokenType
                    }
                    queries[name] = query
                }
                commit('setApiDocs', {
                    docs,
                    queries
                })
            }
        };
        xhttp.open("GET", api);
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