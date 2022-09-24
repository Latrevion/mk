import {HTTP_GET, CONTENT_TYPE_FORM_URLENCODED, CONTENT_TYPE_JSON} from "./constants.js"


//Ajax类
import {serialize, addURLData, serializeJSON} from "./utils.js"

import DEFAULTS from "./default.js"


class Ajax {
  constructor(url, options) {
    this.url = url
    this.options = Object.assign({}, DEFAULTS, options)
    this.init()
  }

  init() {
    const xhr = new XMLHttpRequest()
    this.xhr = xhr
    this.bindEvents()

    xhr.open(this.options.method, this.url + this.addParam(), true)

    this.setResponseType()

    this.setCookie()

    this.setTimeout()

    this.sendData()
  }

  bindEvents() {
    const xhr = this.xhr

    const {success, httpCOdeError, error, abort, timeout} = this.options

    xhr.addEventListener(
      "load",
      () => {
        if (this.ok()) {
          success(xhr.response, xhr)
        } else {
          httpCOdeError(xhr.status, xhr)
        }
      },
      false
    )


    xhr.addEventListener(
      "error",
      () => {
        error(xhr)
      },
      false
    )

    xhr.addEventListener(
      "abort",
      () => {
        abort(xhr)
      },
      false
    )

    xhr.addEventListener(
      "timeout",
      () => {
        timeout(xhr)
      },
      false
    )

  }

  ok() {

    const xhr = this.xhr
    return (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304
  }

  addParam() {
    const {params} = this.options
    if (!params) {
      return ""
    }
    return addURLData(this.url, serialize(params))

  }



  setResponseType() {
    this.xhr.responseType = this.options.responseType;
  }

  setCookie() {
    if (this.options.withCredentials) {
      this.xhr.withCredentials = true
    }
  }

  setTimeout() {
    const {timeoutTime} = this.options
    if (timeoutTime > 0) {
      this.xhr.timeout = timeoutTime
    }
  }

  sendData() {
    const xhr = this.xhr
    if (!this.isSendData()) {
      return xhr.send(null)
    }
    let resultData = null
    const {data} = this.options

    if (this.isFormData()) {
      resultData = data
    } else if (this.isFormURLEncodedData()) {

      this.setContentType(CONTENT_TYPE_FORM_URLENCODED)
      resultData = serialize(data)
    } else if (this.isJSONData()) {
      this.setContentType(CONTENT_TYPE_JSON)
      resultData = serializeJSON(data)
    } else {
      this.setContentType()
      resultData = data
    }


    xhr.send(resultData)
  }


  isSendData() {
    const {data, method} = this.options
    if (!data) {return false}
    if (method.toLowerCase() === HTTP_GET.toLowerCase()) {return false}
    return true
  }

  isFormData() {
    return this.options.data instanceof FormData
  }

  isFormURLEncodedData() {
    return this.options.contentType.toLowerCase().includes(CONTENT_TYPE_FORM_URLENCODED)
  }

  isJSONData() {
    return this.options.contentType.toLowerCase().includes(CONTENT_TYPE_JSON)
  }

  setContentType(contentType = this.options.contentType) {
    if (!contentType) {
      return
    }

    this.xhr.setRequestHeader("Content-Type", contentType)
  }

  getXHR() {
    return this.xhr
  }

}

export default Ajax