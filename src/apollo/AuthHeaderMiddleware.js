export default function (req, next) {
  if (!req.options.headers) {
    req.options.headers = {}
  }

  const token = localStorage.getItem('token')
  let headers = JSON.parse(localStorage.getItem('headers'))
  req.options.headers.authorization = token ? `Bearer ${token}` : null
  if (typeof headers == 'object') {
    for (let key in headers) {
      req.options.headers[key] = headers[key]
    }
  }
  next()
}
