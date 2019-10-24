<template>
  <div>
    <Drawer :closable="false" width="640" v-model="modalShow" @on-close="hideDrawer">
      <div class="bottomBox">
        <div class="bottomItem" @click="lastPage">
          <Icon type="md-arrow-round-back" />
          <span class="txt">上一条：{{ nowHistory - 1 >= 0 ? historyList[nowHistory - 1].name : '无' }}</span>
        </div>
        <div
          v-if="historyList.length > 0 && (historyList.length - 1) > nowHistory"
          class="bottomItem"
          @click="nextPage"
        >
          <span class="txt">下一条：{{ historyList[nowHistory + 1].name }}</span>
          <Icon type="md-arrow-round-forward" />
        </div>
      </div>
      <div class="topBox">
        <div class="firstTitle" :style="pStyle">
          <span>
            <Tag color="primary">
              <span style="font-size: 14px;font-weight: bold;">{{ apiInfo.type_ || 'Type' }}</span>
            </Tag>
            {{ apiInfo.name }}
          </span>
          <span
            class="a"
            v-if="(apiInfo.type_ == 'Query' || apiInfo.type_ == 'Mutation') && (apiInfo.name !== 'Query' && apiInfo.name !== 'Mutation')"
            @mousedown="makeGQLCode"
            href="javascript: void(0)"
          >
            <Icon type="md-code-working" size="16" style="margin-right: 4px;" />生成查询语句
          </span>
        </div>

        <Alert v-if="apiScenes==='admin'">
          提示
          <template slot="desc">
            <span
              @click="showUsageModal('admin')"
              class="tokenUsageReminderText"
            >此接口需要发送用户池管理员 Token, 发送方式点击这里查看</span>
          </template>
        </Alert>

        <Alert v-if="apiScenes==='both'">
          提示
          <template slot="desc">
            <span
              @click="showUsageModal('both')"
              class="tokenUsageReminderText"
            >此接口需要发送用户池管理员 Token 或用户 Token, 了解二者不同以及发送方式点击这里查看</span>
          </template>
        </Alert>

        <Alert v-if="apiScenes==='user'">
          提示
          <template slot="desc">
            <span
              @click="showUsageModal('user')"
              class="tokenUsageReminderText"
            >此接口需要发送用户 Token, 发送方式点击这里查看</span>
          </template>
        </Alert>

        <Alert v-if="apiScenes==='mfa'">
          提示
          <template slot="desc">
            <span
              @click="showUsageModal('mfa')"
              class="tokenUsageReminderText"
            >MFA 多因素认证接口需要发送 Token, 发送方式点击这里查看</span>
          </template>
        </Alert>

        <Modal
          v-model="showAdminTokenUsage"
          title="如何使用管理员 Token?"
          @on-ok="hideUsageModal('admin')"
        >
          <ol>
            <li>如何获取管理员 Token?</li>
            <span>
              调用
              <b>用户池鉴权</b> ->
              <b>初始化</b> 接口会返回管理员 Token。(即
              <code>accessToken</code> )
            </span>
            <li>如何发送 Token？</li>
            <span>
              添加到 HTTP 请求的
              <a
                href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authorization"
              >Authorization Header</a> 中，
              并在前面加上 "
              <code>Bearer</code>"（别忘了空格），比如你获取到的
              <code>accessToken</code> 为
              <code>eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>,
              那么最终的 Authorization 请求头就是
              <code>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>
            </span>
            <li>如何在界面中模拟发送 Token</li>
            <span>在 Headers 编辑器中输入正确的 Authorization 请求头，同时勾选上右上角的复选框。</span>
            <img
              src="http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102730.png"
              style="width: 100%;"
              alt
            />
          </ol>
        </Modal>

        <Modal v-model="showUserTokenUsage" title="如何使用用户 Token?" @on-ok="hideUsageModal('user')">
          <ol>
            <li>如何获取用户 Token?</li>
            <span>
              调用
              <b>用户鉴权</b> ->
              <b>登陆</b> 接口会返回用户 Token。
            </span>
            <li>如何发送 Token？</li>
            <span>
              添加到 HTTP 请求的
              <a
                href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authorization"
              >Authorization Header</a> 中，
              并在前面加上 "
              <code>Bearer</code>"（别忘了空格），比如你获取到的
              <code>accessToken</code> 为
              <code>eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>,
              那么最终的 Authorization 请求头就是
              <code>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>
            </span>
            <li>如何在界面中模拟发送 Token</li>
            <span>在 Headers 编辑器中输入正确的 Authorization 请求头，同时勾选上右上角的复选框。</span>
            <img
              src="http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102730.png"
              style="width: 100%;"
              alt
            />
          </ol>
        </Modal>

        <Modal
          v-model="showMFATokenUsage"
          title="如何发送 MFA  多因素认证所需的 Token?"
          @on-ok="hideUsageModal('mfa')"
        >
          <ol>
            <li>修改 MFA 和 查询 MFA使用的 Token 有所区别</li>
            <span>修改 MFA 必须使用终端用户的 Token, 查询 MFA 可以使用终端用户的 Token 和管理员的 Token。</span>
            <span>终端用户的 Token 只能查询自己的 MFA, 而管理员的 Token 可以用户池所有用户的 MFA。</span>
            <li>如何获取管理员 Token?</li>
            <span>
              调用
              <b>用户池鉴权</b> ->
              <b>初始化</b> 接口会返回管理员 Token。(即
              <code>accessToken</code> )
            </span>
            <li>如何获取用户 Token?</li>
            <span>
              调用
              <b>用户鉴权</b> ->
              <b>登陆</b> 接口会返回用户 Token。
            </span>
            <li>如何发送 Token？</li>
            <span>
              添加到 HTTP 请求的
              <a
                href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authorization"
              >Authorization Header</a> 中，
              并在前面加上 "
              <code>Bearer</code>"（别忘了空格），比如你获取到的
              <code>accessToken</code> 为
              <code>eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>,
              那么最终的 Authorization 请求头就是
              <code>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>
            </span>
            <li>如何在界面中模拟发送 Token</li>
            <span>在 Headers 编辑器中输入正确的 Authorization 请求头，同时勾选上右上角的复选框。</span>
            <img
              src="http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102730.png"
              style="width: 100%;"
              alt
            />
          </ol>
        </Modal>

        <Modal
          v-model="showBothTokenUsage"
          title="如何判断你需要那种 Token? 如何发送 Token？"
          @on-ok="hideUsageModal('both')"
        >
          <ol>
            <li>管理员Token 和用户 Token 适用的目标用户不同。</li>
            <span>用户池管理员 Token 可以操作该用户池中所有的用户。</span>
            <span>终端用户的 Token 只能操作该用户自己。</span>
            <li>如何获取管理员 Token?</li>
            <span>
              调用
              <b>用户池鉴权</b> ->
              <b>初始化</b> 接口会返回管理员 Token。(即
              <code>accessToken</code> )
            </span>
            <li>如何获取用户 Token?</li>
            <span>
              调用
              <b>用户鉴权</b> ->
              <b>登陆</b> 接口会返回用户 Token。
            </span>
            <li>如何发送 Token？</li>
            <span>
              添加到 HTTP 请求的
              <a
                href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authorization"
              >Authorization Header</a> 中，
              并在前面加上 "
              <code>Bearer</code>"（别忘了空格），比如你获取到的
              <code>accessToken</code> 为
              <code>eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>,
              那么最终的 Authorization 请求头就是
              <code>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6I...</code>
            </span>
            <li>如何在界面中模拟发送 Token</li>
            <span>在 Headers 编辑器中输入正确的 Authorization 请求头，同时勾选上右上角的复选框。</span>
            <img
              src="http://lcjim-img.oss-cn-beijing.aliyuncs.com/2019-10-24-102730.png"
              style="width: 100%;"
              alt
            />
          </ol>
        </Modal>

        <VueMarkdown :source="doc" class="markdownDocContainer"></VueMarkdown>

        <Divider />
        <p
          v-if="(apiInfo.fields || apiInfo.inputFields) && fields.length > 0"
          :style="pStyle"
        >子项（fields）</p>
        <div
          v-if="(apiInfo.fields || apiInfo.inputFields) && fields.length > 0"
          class="demo-drawer-profile"
        >
          <Row>
            <Col span="24" class="setfontsize apiname">
              <span style="color: #515a6e;margin-right: 6px;">type</span>
              {{ apiInfo.name }} {
            </Col>
            <Col v-for="(item, index) in fields" :key="index" span="12" class="setfontsize">
              <span
                @click="findInDic(apiInfo.name == 'Schemas' ? item.name : item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                    ? item.type.name
                    : item.type.kind).replace('NON_NULL', '必填').replace('NON_NULL', '必填'))"
                class="text"
              >
                {{ item.name }}
                <span style="color: #000;margin: 0 3px;">:</span>
              </span>

              <Tooltip
                placement="right"
                :content="getTootips((apiInfo.name == 'Schemas' ? item.name : (item.type.name
                ? item.type.name
                : item.type.kind)).replace('NON_NULL', '必填'))"
              >
                <!-- <Tag
                  :color="getTagColor(apiInfo.name == 'Schemas' ? item.name : (item.type.name
                ? item.type.name
                : item.type.kind))"
                >-->
                <span
                  :style="getTagStyle(apiInfo.name == 'Schemas' ? item.name : (item.type.name
                ? item.type.name
                : item.type.kind))"
                  @click="findInDic(apiInfo.name == 'Schemas' ? item.name : item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                    ? item.type.name
                    : item.type.kind).replace('NON_NULL', '必填').replace('NON_NULL', '必填'))"
                >
                  {{ (apiInfo.name == 'Schemas' ? item.name : item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                  ? item.type.name
                  : item.type.kind).replace('NON_NULL', '必填')) }}{{(apiInfo.name == 'Schemas' ? item.name : item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                  ? item.type.name
                  : item.type.kind)) == 'NON_NULL' ? '!' : ''}}
                </span>
                <!-- </Tag> -->
              </Tooltip>
            </Col>
            <Col span="24" class="setfontsize apiname">}</Col>
          </Row>
        </div>
        <div
          v-if="(apiInfo.fields || apiInfo.inputFilds) && fields.length > 0"
          style="margin-top: 33px;width: 100%; height: 1px;"
        ></div>
        <p v-if="apiInfo.args && args.length > 0" :style="pStyle">参数（args）</p>
        <div v-if="apiInfo.args && args.length > 0" class="demo-drawer-profile">
          <Row>
            <Col span="24" class="setfontsize apiname">{{ apiInfo.name }} (</Col>

            <Col v-for="(item, index) in args" :key="index" span="12" class="setfontsize">
              <span
                @click="findInDic(item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                  ? item.type.name
                  : item.type.kind))"
                class="text"
              >
                {{ item.name }}
                <span style="color: #000;margin: 0 3px;">:</span>
              </span>
              <Tooltip
                placement="right"
                :content="getTootips((item.type.name
                ? item.type.name
                : item.type.kind).replace('NON_NULL', '必填'))"
              >
                <!-- <Tag
                  :color="getTagColor(item.type.name
              ? item.type.name
              : item.type.kind)"
                  @click="findInDic((item.type.name
                ? item.type.name
                : item.type.kind))"
                >-->
                <span
                  :style="getTagStyle(item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                  ? item.type.name
                  : item.type.kind))"
                  @click="findInDic(item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                  ? item.type.name
                  : item.type.kind))"
                >
                  {{ item.type.ofType && item.type.ofType.name ? item.type.ofType.name : (item.type.name
                  ? item.type.name
                  : item.type.kind).replace('NON_NULL', '必填') }}{{(item.type.name
                  ? item.type.name
                  : item.type.kind) == 'NON_NULL' ? '!' : ''}}
                </span>
                <!-- </Tag> -->
              </Tooltip>
            </Col>

            <Col span="24" class="setfontsize apiname">
              )
              <span v-if="apiInfo.type.name" @click="findInDic(apiInfo.type.name)">
                :
                <span :style="getTagStyle(apiInfo.type.name)">{{ apiInfo.type.name }}</span>
              </span>
            </Col>
          </Row>
        </div>
        <!-- <Divider v-if="apiInfo.type && apiInfo.type.name && dic[apiInfo.type.name]" /> -->
        <!-- <p
          v-if="apiInfo.type && apiInfo.type.name && dic[apiInfo.type.name]"
          :style="pStyle"
        >返回类型（Schema）</p>
        <div
          v-if="apiInfo.type && apiInfo.type.name && dic[apiInfo.type.name]"
          class="demo-drawer-profile"
        >
          <Row>
            <Col span="12" class="setfontsize">
              <Tooltip
                placement="right"
                :content="getTootips(apiInfo.type.name.replace('NON_NULL', '必填'))"
              >
                <Tag :color="getTagColor(apiInfo.type.name)">
                  <span
                    @click="findInDic(apiInfo.type.name)"
                  >{{ apiInfo.type.name.replace('NON_NULL', '必填') }}</span>
                </Tag>
              </Tooltip>
              <span class="text">{{ apiInfo.type.name }}</span>
            </Col>
          </Row>
        </div>-->
      </div>
    </Drawer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import VueMarkdown from "vue-markdown";
import { Alert, Modal } from "view-design";

export default {
  name: "draver",

  components: {
    VueMarkdown,
    Alert,
    Modal
  },

  data() {
    return {
      args: [],
      fields: [],
      modalShow: false,
      pStyle: {
        fontSize: "16px",
        color: "rgba(0,0,0,0.85)",
        lineHeight: "24px",
        display: "block",
        marginBottom: "16px"
      },
      codevalue: "hello",
      showAdminTokenUsage: false,
      showUserTokenUsage: false,
      showMFATokenUsage: false,
      showBothTokenUsage: false,
      apiScenes: undefined
    };
  },
  computed: {
    ...mapGetters("apollo", [
      "drawerShow",
      "apiInfo",
      "dic",
      "nowHistory",
      "historyList",
      "apiDocs",
      "queries"
    ]),

    doc() {
      const emptyDoc =
        "暂无描述，详情请见文档：[https://docs.authing.cn/authing/sdk/open-graphql](https://docs.authing.cn/authing/sdk/open-graphq)";
      const apiName = this.apiInfo["name"];
      const apiDoc = this.apiDocs[apiName];
      const brief = apiDoc && apiDoc["brief"] ? apiDoc["brief"] : undefined;
      return brief || emptyDoc;
    }
  },
  watch: {
    drawerShow() {
      this.modalShow = this.drawerShow;
      this.dealWithApiInfo();
    },
    apiInfo() {
      this.dealWithApiInfo();
    }
  },
  methods: {
    ...mapActions("apollo", [
      "changeDrawerShow",
      "setApiInfo",
      "clearHistoryList",
      "setNowHistory",
      "addToHistoryList",
      "lastHistory",
      "nextHistory"
    ]),

    showUsageModal(type) {
      if (type === "admin") {
        this.showAdminTokenUsage = true;
      } else if (type === "user") {
        this.showUserTokenUsage = true;
      } else if (type === "mfa") {
        this.showMFATokenUsage = true;
      } else if (type == "both") {
        this.showBothTokenUsage = true;
      }
    },

    hideUsageModal(type) {
      if (type === "admin") {
        this.showAdminTokenUsage = false;
      } else if (type === "user") {
        this.showUserTokenUsage = false;
      } else if (type === "mfa") {
        this.showMFATokenUsage = false;
      } else if (type == "both") {
        this.showBothTokenUsage = false;
      }
    },

    hideDrawer() {
      this.changeDrawerShow({ show: false });
      this.modalShow = false;
      this.args = [];
      this.fields = [];
      this.clearHistoryList();
    },

    updateAPIScenes(apiName) {
      const apiDoc = this.apiDocs[apiName];
      this.apiScenes = apiDoc.tokenType;
    },

    dealWithApiInfo() {
      let api = this.apiInfo;
      this.updateAPIScenes(api.name);
      try {
        if (
          api.args &&
          typeof api.args == "object" &&
          api.args.length &&
          api.args.length > 0
        ) {
          this.args = api.args;
        }
      } finally {
        try {
          if (
            api.fields &&
            typeof api.fields == "object" &&
            api.fields.length &&
            api.fields.length > 0
          ) {
            this.fields = api.fields;
          }
        } finally {
          try {
            if (
              api.inputFields &&
              typeof api.inputFields == "object" &&
              api.inputFields.length &&
              api.inputFields.length > 0
            ) {
              this.fields = api.inputFields;
            }
          } finally {
            console.log("ok");
          }
        }
      }
    },
    findInDic(key) {
      if (this.dic[key]) {
        this.setApiInfo({ info: this.dic[key] });
        this.addToHistoryList(this.dic[key]);
      }
    },
    getTootips(item) {
      switch (item.toLowerCase()) {
        case "string":
          return "基本类型：字符串 (String) ";
          break;

        case "boolean":
          return "基本类型：布尔值 (Boolean) ";
          break;

        case "int":
          return "基本类型：整数型 (Boolean) ";
          break;

        case "float":
          return "基本类型：浮点型 (Float) ";
          break;

        // case "list":
        //   return "基本类型：数组 (Array / list) ";
        //   break;

        case "必填":
          return "不可为空";
          break;

        default:
          return "自定义类型：" + item;
      }
    },

    getTagStyle(item) {
      switch (item.toLowerCase()) {
        case "string":
          return "color: #27ae60";
          break;

        case "boolean":
          return "color: #27ae60";
          break;

        case "int":
          return "color: #27ae60";
          break;

        // case "list":
        //   return "success";
        //   break;

        case "float":
          return "color: #27ae60";
          break;

        case "non_null":
          return "color: #27ae60";
          break;

        default:
          return "cursor: pointer;color: #fe7c6c";
      }
      //return 'success'
    },

    getTagColor(item) {
      switch (item.toLowerCase()) {
        case "string":
          return "success";
          break;

        case "boolean":
          return "success";
          break;

        case "int":
          return "success";
          break;

        // case "list":
        //   return "success";
        //   break;

        case "float":
          return "success";
          break;

        case "non_null":
          return "default";
          break;

        default:
          return "warning";
      }
      //return 'success'
    },

    nextPage() {
      this.nextHistory();
    },
    lastPage() {
      this.lastHistory();
    },
    makeGQLCode() {
      const apiName = this.apiInfo.name;
      const query = this.queries[apiName];

      function copyText(text, callback) {
        // 网上找的，为了不多加库真的很拼
        var tag = document.createElement("textarea");
        tag.setAttribute("id", "cp_hgz_input");
        tag.setAttribute("warp", "hard");
        tag.value = text;
        document.getElementsByTagName("body")[0].appendChild(tag);
        document.getElementById("cp_hgz_input").select();
        document.execCommand("copy");
        document.getElementById("cp_hgz_input").remove();
        if (callback) {
          callback(text);
        }
      }
      copyText(query);
      //alert(str);
      this.$Message.success("复制成功");
    },

    clearUrlInString(str) {
      let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#)+)/g;
      return str.replace(reg, "") || "";
    },

    getUrlInString(str) {
      let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#)+)/g;
      if (str && str.indexOf("https://") > -1) {
        return reg.exec(str)[0];
      } else {
        return null;
      }
    }
  }
};
</script>
<style>
.ivu-drawer-body {
  box-sizing: border-box;
  padding: 0 !important;
}

.firstTitle {
  width: 100%;
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.firstTitle > span.a {
  font-size: 14px;
  color: #515151;
  cursor: pointer;
}

.setfontsize {
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 3px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

span.text {
  margin-left: 11px;
  color: #1a5390;
}

.ivu-tooltip-popper {
  z-index: 999 !important;
}

.bottomBar {
  width: 100%;
  height: 33px;
}

.topBox {
  width: 100%;
  height: calc(100% - 61px);
  max-height: calc(100% - 61px);
  overflow-y: scroll;
  padding: 33px;
}

.bottomBox {
  width: 100%;
  border-top: 1px solid #f3f3f3;
  height: 60px;
  padding: 0 33px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 4px 0 8px 0 rgba(132, 164, 194, 0.1);
}

.bottomItem {
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.bottomItem:hover {
  color: #313131;
}

.bottomItem > span.txt {
  margin: 0 6px;
}

.apiname {
  color: #203053;
  font-weight: bold;
}

.markdownDocContainer {
  margin-left: 20px;
}

.ivu-modal-body ol {
  margin-left: 11px;
}

.ivu-modal-body ol li {
  font-size: 15px;
  font-weight: bold;
}

.ivu-modal-body image {
  width: 100%;
}

.markdownDocContainer ul {
  margin-left: 13.5px;
}

.markdownDocContainer img {
  width: 100%;
}

.markdownDocContainer > ol > li {
  margin-top: 5px;
}

blockquote {
  border-left: 4px solid #ccc;
  padding-left: 11px;
}

.tokenUsageReminderText:hover {
  cursor: pointer;
}
</style>