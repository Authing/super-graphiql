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

export default {
  name: "draver",

  components: {
    VueMarkdown
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
      codevalue: "hello"
    };
  },
  computed: {
    ...mapGetters("apollo", [
      "drawerShow",
      "apiInfo",
      "dic",
      "nowHistory",
      "historyList",
      "apiDocs"
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
    hideDrawer() {
      this.changeDrawerShow({ show: false });
      this.modalShow = false;
      this.args = [];
      this.fields = [];
      this.clearHistoryList();
    },
    dealWithApiInfo() {
      let api = this.apiInfo;
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
      let str = "";
      let that = this;
      function getArgs(list, showType) {
        if (!list) {
          return false;
        }
        let tmp = list.args || list.inputFields || list.fields || [];
        let arr = [];
        for (let i = 0; i < tmp.length; i++) {
          try {
            let tp = tmp[i]["type"]["ofType"]
              ? tmp[i]["type"]["ofType"]["name"]
              : tmp[i]["type"]["name"];
            //alert(JSON.stringify(tmp[i]))
            //alert(tp)
            if (tmp[i] && tmp[i]["type"]) {
              if (getArgs(that.dic[tp])) {
                arr.push(getArgs(that.dic[tp]));
              } else {
                if (tmp[i]["type"]["kind"] == "NON_NULL") {
                  arr.push("$" + tmp[i]["name"] + ": " + tp + "!");
                } else {
                  arr.push("$" + tmp[i]["name"] + ": " + tp);
                }
              }
            }
          } catch (err) {
            alert(err);
          }
        }
        return arr.join(", ");
      }

      function getFirstArgsInObject(list) {
        let tmp = list.args || list.inputFields || list.fields || [];
        let arr = [];
        for (let i = 0; i < tmp.length; i++) {
          let tp = tmp[i]["type"]["ofType"]
            ? tmp[i]["type"]["ofType"]["name"]
            : tmp[i]["type"]["name"];
          // if (
          //   tp !== "String" &&
          //   tp !== "Boolean" &&
          //   tp !== "Int" &&
          //   tp !== "Float" &&
          //   that.dic[tp]
          // ) {
          //   tp = "{" + getArgs(that.dic[tp]) + "}";
          //   arr.push(tmp[i]["name"] + ": " + tp);
          // } else {
          arr.push(tmp[i]["name"] + ": $" + tmp[i]["name"]);
          //}
        }
        return arr;
      }

      function getSecondArgs(list, showType) {
        let tmp = list.args || list.inputFields || list.fields || [];
        let arr = [];
        for (let i = 0; i < tmp.length; i++) {
          let tp = tmp[i]["type"]["ofType"]
            ? tmp[i]["type"]["ofType"]["name"]
            : tmp[i]["type"]["name"];
          if (
            tp !== "String" &&
            tp !== "Boolean" &&
            tp !== "Int" &&
            tp !== "Float" &&
            that.dic[tp]
          ) {
            tp = "{" + getArgs(that.dic[tp]) + "}";
            arr.push(tmp[i]["name"] + ": " + tp);
          } else {
            arr.push(tmp[i]["name"] + ": $" + tmp[i]["name"]);
          }
        }
        return arr.join(", ");
      }

      function giveMeSpace(number) {
        let space = "";
        while (space.length < number) {
          space = space + "  ";
        }
        return space;
      }

      function renderFields(info, level) {
        let lev = level; //把层级给存起来
        let fields = [];
        let tmpstr = "";
        if (!info) {
          return "";
        }
        try {
          if (
            typeof info.fields == "object" &&
            info.fields.length &&
            info.fields.length > 0
          ) {
            fields = info.fields;
          } else if (
            typeof info.inputFields == "object" &&
            info.inputFields.length &&
            info.inputFields.length > 0
          ) {
            fields = info.inputFields;
          }
        } finally {
          if (fields.length > 0) {
            for (let i = 0; i < fields.length; i++) {
              if (
                (fields[i]["type"] &&
                  fields[i]["type"]["name"] &&
                  that.dic[fields[i]["type"]["name"]]) ||
                (fields[i]["type"] &&
                  fields[i]["type"]["ofType"] &&
                  that.dic[fields[i]["type"]["ofType"]["name"]])
              ) {
                let typeName = fields[i]["type"]["name"];
                if (
                  fields[i]["type"] &&
                  fields[i]["type"]["ofType"] &&
                  fields[i]["type"]["ofType"]["name"] &&
                  that.dic[fields[i]["type"]["ofType"]["name"]]
                ) {
                  //alert(fields[i]['type']['ofType']['name'])
                  typeName = fields[i]["type"]["ofType"]["name"];
                }
                let res = renderFields(that.dic[typeName], lev + 1);
                //alert(JSON.stringify(res))
                if (res !== "") {
                  res =
                    giveMeSpace(lev) +
                    fields[i]["name"] +
                    " {\n" +
                    res +
                    giveMeSpace(lev) +
                    "}\n";
                } else {
                  res = giveMeSpace(lev) + fields[i]["name"] + "\n";
                }
                tmpstr = tmpstr + res;
              } else {
                tmpstr = tmpstr + giveMeSpace(lev) + fields[i]["name"] + "\n";
              }
            }
          } else {
            //可能是直接返回一个 schema
            if (
              (info["type"] &&
                info["type"]["name"] &&
                that.dic[info["type"]["name"]]) ||
              (info["type"] &&
                info["type"]["ofType"] &&
                that.dic[info["type"]["ofType"]["name"]])
            ) {
              let typeName = "";
              if (
                info["type"] &&
                info["type"]["ofType"] &&
                info["type"]["ofType"]["name"]
              ) {
                typeName = info["type"]["ofType"]["name"];
              } else {
                typeName = info["type"]["name"];
              }
              tmpstr =
                tmpstr +
                //info["name"] +
                renderFields(that.dic[typeName], lev + 1) +
                "\n";
            }
          }
        }
        return tmpstr;
      }

      str =
        str +
        this.apiInfo.type_.toLowerCase() +
        " " +
        (this.apiInfo.name == "User" ? "user" : this.apiInfo.name) +
        "(" +
        getArgs(this.apiInfo) +
        ") {\n";
      str =
        str +
        (this.apiInfo.name == "User" ? "user" : this.apiInfo.name) +
        "(" +
        getSecondArgs(this.apiInfo) +
        ") { \n" +
        renderFields(this.apiInfo, 2) +
        "\n  }\n}";
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
      copyText(str);
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

.markdownDocContainer ul{
  margin-left: 13.5px;
}

.markdownDocContainer img{
  width: 100%
}

blockquote {
  border-left: 4px solid #ccc;
  padding-left: 11px;
}
</style>