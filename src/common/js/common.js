/*****
 *  baseUrl
 */
// global.$basePath = 'http://mall.supersoco.com/server/index.php'    // 接口请求路径
// global.$bannerPath = 'http://wx.supersoco.com:8070'   // banner图获取接口路径
// global.$hostUrl='http://mall.supersoco.com/index/m-ch' //支付回调等
// global.$baseHead='http://mall.supersoco.com/server' //图片基本前缀

/*global.$bannerPath='http://wx.supersoco.com:8070'
global.$basePath = 'http://scshop.chuckchen.top/server/index.php'  
global.$hostUrl='http://scshop.chuckchen.top/index/m-ch'
global.$baseHead='http://scshop.chuckchen.top/server' */
 // global.$basePath = '/server/index.php'    // 打包正是环境
// global.$bannerPath = 'http://wx.supersoco.com:8070'   // 打包正是环境
 global.$basePath = 'adp'    // 本地测试接口
 global.$bannerPath = 'api/'  // 本地测试
 global.$hostUrl='http://127.0.0.1:8080/#'
 global.$baseHead='http://scshop.chuckchen.top/server'
 global.$codePicPath = $baseHead+'/data/image/code/' //操作码图片前缀
 global.$headPicPath = $baseHead //图片前缀
 global.$illegalCheck = /[@#\$%\^&\*<>\[\]\！\!\—\=\~\`\‘\“\：\；\/\+\-\?\,\'\"\:\;\{\}\|\.\s《》。，、\\]/i;
 global.$phoneCheck = /^1[3-9]\d{9}$/;
 global.$user = '';
// $user数据信息及字段名称格式
// address_id:"17"
// alias:"136****5903"
// auid:"af90d14366bd23fec1dc38fbdbbb4d4bbb01a80f"
// birthday:"0000-00-00"
// email:""
// head_pic:"head_20180109194206.jpeg"
// home_phone:""
// is_validated:"0"
// last_ip:"114.83.84.3"
// last_login:"1516007174"
// mobile_phone:"13671655903"
// office_phone:""
// password:"a653b11eb065b40b95c7faa2defd532dcf1a91ef"
// qq:""
// reg_time:"1515477765"
// salt:"ovCjF49H/9OiOtYtpeme9TovMtRs8E0zHZ63CUOnPgg="
// sex:"0"
// user_id:"15"
// user_name:"123456"
const baseUrl = 'http://wx.supersoco.com:8070/uploads/' //banner图前缀
global.$cart = ''
//订单状态
global.$order ={
	type:0
}
global.$orderTypeArray=['已完成','待付款','待收货','已收货','待退款','拒绝退款','已退款','已取消','已作废','待出库','备货中'];
global.$selectAddress=0;//选择地址
global.$invType=1;//发票信息
global.$invPayee='个人';//发票信息
global.$coName='';//发票信息
global.$coIdentNo='';//发票信息
global.$depBank='';//发票信息
global.$depBankNo='';//发票信息
global.$regAddress='';//发票信息
global.$regNumber='';//发票信息
global.$invFlag=true;//发票请求标志位 编辑订单内使用
export default baseUrl