import Env from './env'
let base = location.hostname

if (
  // eslint-disable-next-line eqeqeq
  base == 'localhost' ||
  base.indexOf('dodora.cn') > -1 ||
  // eslint-disable-next-line eqeqeq
  base == '0.0.0.0' ||
  // eslint-disable-next-line eqeqeq
  base == 'local.authing.cn' ||
  // eslint-disable-next-line eqeqeq
  base == 'client.dev0.j1lbfyvz.authing.cn'
) {
  window.dev = true
}

let urlList = {
  pay: 'https://pay.authing.cn',
  users: 'https://users.authing.cn',
  emails: 'https://emails.authing.cn',
  oauth: 'https://oauth.authing.cn'
}

if (window.dev) {
  for (var service in urlList) {
    urlList[service] = urlList[service]
      .replace('authing.cn', 'authing.dodora.cn')
      .replace('https', 'http')
  }
}
// eslint-disable-next-line eqeqeq
if (base == 'localhost') {
  urlList = {
    pay: 'https://pay.authing.cn',
    users: 'https://users.authing.cn',
    emails: 'https://emails.authing.cn',
    oauth: 'https://oauth.authing.cn'
  }
}

if (base === '0.0.0.0') {
  // 必须所有服务都运行在本地
  urlList = {
    pay: 'http://localhost:5510',
    users: 'http://localhost:5510',
    emails: 'http://localhost:5510',
    oauth: 'http://localhost:5510'
  }
}
// eslint-disable-next-line eqeqeq
if (base == 'local.authing.cn') {
  // 必须所有服务都运行在本地
  urlList = {
    pay: 'http://local.authing.cn:5510',
    users: 'http://local.authing.cn:5510',
    emails: 'http://local.authing.cn:5510',
    oauth: 'http://local.authing.cn:5510'
  }
}

let config = {
  api: "https://1390279131788301.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/authing-graphql-api/nodejs8/",
  env: Env,
  accessToken: {
    days: 15
  },
  openSSLSecret: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4xKeUgQ+Aoz7TLfAfs9+paePb
5KIofVthEopwrXFkp8OCeocaTHt9ICjTT2QeJh6cZaDaArfZ873GPUn00eOIZ7Ae
+TiA2BKHbCvloW3w5Lnqm70iSsUi5Fmu9/2+68GZRH9L7Mlh8cFksCicW2Y2W2uM
GKl64GDcIq3au+aqJQIDAQAB
-----END PUBLIC KEY-----
`, // 加密密码时用的秘钥
  clientId: '59f86b4832eb28071bdd9214',
  baseUrls: {
    pay: {
      uri: `${urlList['pay']}`
    },

    users: {
      uri: `${urlList['users']}`
    },

    emails: {
      uri: `${urlList['emails']}`
    },

    oauth: {
      uri: `${urlList['oauth']}`
    }
  }
}
export default config
