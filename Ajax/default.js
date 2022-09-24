//默认参数
import {HTTP_GET,CONTENT_TYPE_FORM_URLENCODED} from "./constants.js"


const DEFAULTS = {
  method: HTTP_GET,
  params: null,
  data:null,
  contentType:CONTENT_TYPE_FORM_URLENCODED,
  responseType:'',
  timeoutTime:0,
  withCredentials:false,

  //方法
  success(){},
  httpCodeError(){},
  error(){},
  abort(){},
  timeout(){}
}
export default DEFAULTS