import Vue from 'vue'
import Router from 'vue-router'
import SOCOIndex from '@/components/soco_index.vue'
import shoppingCart from '@/components/shoppingCartService/shoppingCart.vue' //购物车页-主路由页 -  xzj
import shoppingCartServiceShopping from '@/components/shoppingCartService/shoppingCartServiceShopping.vue' //购物车页 - 购物车列表 xzj
import shoppingCartServiceManage from '@/components/shoppingCartService/shoppingCartServiceManage.vue' //购物车页 - 购物车管理列表 xzj
import shoppingCartOrder from '@/components/shoppingCartService/shoppingCartOrder.vue' //购物车页 - 购物车订单页 xzj
import shoppingCartInvoice from '@/components/shoppingCartService/shoppingCartInvoice.vue' //购物车页 - 购物车发票页 xzj
import shoppingCartAddress from '@/components/shoppingCartService/shoppingCartAddress.vue' //购物车页 - 购物车地址 xzj
import shoppingCartAddressAdd from '@/components/shoppingCartService/shoppingCartAddressAdd.vue' //购物车页 - 购物车地址添加 xzj
import shoppingCartPay from '@/components/shoppingCartService/shoppingCartPay.vue' //购物车页 - 购物车支付 xzj
import shoppingCartSuccess from '@/components/shoppingCartService/shoppingCartSuccess.vue' //购物车页 - 购物车成功 xzj
import shoppingCartFail from '@/components/shoppingCartService/shoppingCartFail.vue' //购物车页 - 购物车成功 xzj

import Login from '@/components/registration/login.vue' // 登录
import Register from '@/components/registration/register.vue' // 注册
import Registration_Successful from '@/components/registration/registration_Successful.vue' // 成功
import Goods_selective from '@/components/purchase_particulars/goods_selective_purchasing.vue'  // 商品选购
import info_order_goods from '@/components/order/info_order_goods.vue' // 订单信息
import info_my_order from '@/components/order/my_order.vue' // 我的订单
import info_order_pay from '@/components/order/info_order_pay.vue'  // 订单支付
import info_order_details from '@/components/order/order_details.vue'  // 订单详情
import info_order_details_edit from '@/components/order/order_details_edit.vue' //订单编辑
import info_order_details_address from '@/components/order/order_details_address.vue'  // 订单详情地址编辑
import info_order_details_address_edit from '@/components/order/order_details_address_edit.vue' //订单新增编辑
import order_details_Invoice from '@/components/order/order_details_Invoice.vue'//订单详情发票编辑
import info_address from '@/components/order/info_address.vue'  // 我的地址
import info_address_edit from '@/components/order/info_address_edit.vue'  // 地址详情
import after_sale_order from '@/components/order/after_sale_order.vue'  // 申请售后服务
import info_index from '@/components/order/info_index.vue'

import dialogEditPhoneOne from '@/components/dialog/dialogEditPhoneOne.vue' //修改手机号一
import dialogEditPhoneTwo from '@/components/dialog/dialogEditPhoneTwo.vue' //修改手机号二
import dialogSuccess from '@/components/dialog/dialogSuccess.vue' //修改成功提示
import dialogEditUserName from '@/components/dialog/dialogEditUserName.vue' //修改用户名
import dialogEditPassword from '@/components/dialog/dialogEditPassword.vue' //修改密码
import dialogEditPasswordOne from '@/components/dialog/dialogEditPasswordOne.vue' //忘记密码一
import dialogEditPasswordTwo from '@/components/dialog/dialogEditPasswordTwo.vue' //忘记密码二
import dialogAddress from '@/components/dialog/dialogAddress.vue' //地址列表模板
import dialogAddressAdd from '@/components/dialog/dialogAddressAdd.vue' //添加、编辑模板

import afterSaleService from '@/components/afterSale/afterSaleService.vue' //售后服务类型
import afterSaleList from '@/components/afterSale/afterSaleList.vue' //售后选择选择商品
import afterSaleServiceOneApply from '@/components/afterSale/afterSaleServiceOneApply.vue' //仅退款申请
import afterSaleServiceTwoApply from '@/components/afterSale/afterSaleServiceTwoApply.vue' //退货退款申请
import afterSaleServiceThreeApply from '@/components/afterSale/afterSaleServiceThreeApply.vue' //换货申请

import afterSaleServiceEdit from '@/components/afterSale/afterSaleServiceEdit.vue' //申请编辑
import afterSaleOrderOneApplyEdit from '@/components/afterSale/afterSaleOrderOneApplyEdit.vue' //仅退款申请
import afterSaleOrderTwoApplyEdit from '@/components/afterSale/afterSaleOrderTwoApplyEdit.vue' //退货退款申请
import afterSaleOrderThreeApplyEdit from '@/components/afterSale/afterSaleOrderThreeApplyEdit.vue' //换货申请

import afterSaleServiceAddress from '@/components/afterSale/afterSaleServiceAddress.vue' //换货申请地址选择
import afterSaleServiceAddressEdit from '@/components/afterSale/afterSaleServiceAddressEdit.vue' //换货申请地址编辑

import afterSaleOrderAddress from '@/components/afterSale/afterSaleOrderAddress.vue' //换货编辑申请地址选择
import afterSaleOrderAddressEdit from '@/components/afterSale/afterSaleOrderAddressEdit.vue' //换货编辑申请地址编辑

import afterSaleOrder from '@/components/afterSale/afterSaleOrder.vue' //售后订单
import afterSaleCheckOrder from '@/components/afterSale/afterSaleCheckOrder.vue' //售后
import afterSaleOrderDetail from '@/components/afterSale/afterSaleOrderDetail.vue' //售后订单详情
import afterSaleOrderReturn from '@/components/afterSale/afterSaleOrderReturn.vue' //售后订单寄回商品
import afterSaleOrderPay from '@/components/afterSale/afterSaleOrderPay.vue' //售后订单寄回商品
Vue.use(Router)

export default new Router({
  routes: [
  {
      path: '/',
      name: 'soco_index',
      component: SOCOIndex
  },{
      path: "*",
      redirect: "/"
  },{
	    path:'/shoppingCart',//购物车路由模块
	    component: shoppingCart,
      children:[
        { path: '', component: shoppingCartServiceShopping},//购物车页 - 主路由 xzj 默认
        { path: '/shoppingCart/Service', component: shoppingCartServiceShopping},//购物车页 - 购物车列表 xzj 
        //{ path: '/shoppingCart/Service/Manage', component: shoppingCartServiceManage}, //购物车页 - 购物车管理列表 xzj
        { path: '/shoppingCart/Order', component: shoppingCartOrder}, //购物车页 - 购物车订单 xzj
        { path: '/shoppingCart/Invoice',component:shoppingCartInvoice}, //购物车页 - 购物车订单 xzj
        { path: '/shoppingCart/Address',component:shoppingCartAddress},
        { path: '/shoppingCart/Address/add',component:shoppingCartAddressAdd,name:'/shoppingCart/Address/add'},
        { path: '/shoppingCart/Address/edit/:id',component:shoppingCartAddressAdd,name:'/shoppingCart/Address/edit'},
        { path: '/shoppingCart/Pay/:id',component:shoppingCartPay,name:'/shoppingCart/Pay'},
        { path: '/shoppingCart/Success/:id',component:shoppingCartSuccess,name:'/shoppingCart/Success'},
        { path: '/shoppingCart/Fail',component:shoppingCartFail}
        ]
    },{
      path:'/info',//个人中心路由模块
      component: info_index,
      children:[
        {path: '',component: info_order_goods,name:'info_order_goods'},//个人中心
        {path: '/info/order',component: info_my_order,name:'info_my_order' }, //我的订单
        {path: '/info/order/detail/:id',component:info_order_details,name:'info_order_details'},//订单详情
        {path: '/info/order/detail/edit/:id',component:info_order_details_edit,name:'info_order_details_edit'},//订单编辑
        {path: '/info/order/detail/address/:orderId',component:info_order_details_address,name: 'info_order_details_address'},//订单地址详情
        {path: '/info/order/detail/address/:orderId/add',component:info_order_details_address_edit,name: 'info_order_details_address_add'},//订单详情新增地址
        {path: '/info/order/detail/address/:orderId/edit/:id',component:info_order_details_address_edit,name: 'info_order_details_address_edit'},//订单详情编辑地址
        {path: '/info/order/detail/invoice/:orderId',component:order_details_Invoice,name:'order_details_Invoice'},//订单详情编辑发票
        {path: '/info/order/pay/:id',component:info_order_pay,name:'/info/order/pay'},
        {path: '/info/editPhoneOne',component:dialogEditPhoneOne},  //修改手机号-验证手机
        {path: '/info/editPhoneTwo',component:dialogEditPhoneTwo,name:'/info/editPhoneTwo'},  //修改手机号-修改手机
        {path: '/info/editUserName',component:dialogEditUserName},//修改用户名
        {path: '/info/editPassword',component:dialogEditPassword},//修改密码
        {path: '/info/address',component:info_address},//我的地址
        {path: '/info/address/add',component:info_address_edit,name:'/info/address/add'},//添加地址
        {path: '/info/address/edit/:id',component:info_address_edit,name:'/info/address/edit'},//编辑地址
        {path: '/after_sale_order',component:after_sale_order,name:'after_sale_order'},//售后订单审核
        {path: '/afterSale/afterSaleList/:id',component:afterSaleList,name:'/afterSale/afterSaleList'},//选择售后商品
        {path: '/afterSale/afterSaleService/:id',component:afterSaleService,name:'/afterSale/afterSaleService'},
        {path: '/afterSale/afterSaleServiceOneApply/:id',component:afterSaleServiceOneApply,name:'/afterSale/afterSaleServiceOneApply'},
        {path: '/afterSale/afterSaleServiceTwoApply/:id',component:afterSaleServiceTwoApply,name:'/afterSale/afterSaleServiceTwoApply'},
        {path: '/afterSale/afterSaleServiceThreeApply/:id',component:afterSaleServiceThreeApply,name:'/afterSale/afterSaleServiceThreeApply'},
        {path: '/afterSale/afterSaleServiceAddress/:recId',component:afterSaleServiceAddress,name:'/afterSale/afterSaleServiceAddress'},
        {path: '/afterSale/afterSaleServiceAddress/:recId/add',component:afterSaleServiceAddressEdit,name:'/afterSale/afterSaleServiceAddress/add'},
        {path: '/afterSale/afterSaleServiceAddress/:recId/edit/:id',component:afterSaleServiceAddressEdit,name:'/afterSale/afterSaleServiceAddress/edit'},
        {path: '/afterSaleOrder/afterSaleService/:id',component:afterSaleServiceEdit,name:'/afterSaleOrder/afterSaleService'},
        {path: '/afterSaleOrder/afterSaleServiceOneApply/edit/:id',component:afterSaleOrderOneApplyEdit,name:'/afterSaleOrder/afterSaleServiceOneApply/edit'},
        {path: '/afterSaleOrder/afterSaleServiceTwoApply/edit/:id',component:afterSaleOrderTwoApplyEdit,name:'/afterSaleOrder/afterSaleServiceTwoApply/edit'},
        {path: '/afterSaleOrder/afterSaleServiceThreeApply/edit/:id',component:afterSaleOrderThreeApplyEdit,name:'/afterSaleOrder/afterSaleServiceThreeApply/edit'},
        {path: '/afterSaleOrder/afterSaleServiceAddress/:returnGoodsId',component:afterSaleOrderAddress,name:'/afterSaleOrder/afterSaleServiceAddress'},
        {path: '/afterSaleOrder/afterSaleServiceAddress/:returnGoodsId/add',component:afterSaleOrderAddressEdit,name:'/afterSaleOrder/afterSaleServiceAddress/add'},
        {path: '/afterSaleOrder/afterSaleServiceAddress/:returnGoodsId/edit/:id',component:afterSaleOrderAddressEdit,name:'/afterSaleOrder/afterSaleServiceAddress/edit'}
        ]
    },{
      path:'/afterSaleOrder',//售后路由模块
      component: afterSaleOrder,
      children:[
      {path: '',component:afterSaleCheckOrder},
      {path: '/afterSaleOrder/check/:id',component:afterSaleCheckOrder,name:'/afterSaleOrder/check'},
      {path: '/afterSaleOrder/apply/:id',component:afterSaleOrderDetail,name:'/afterSaleOrder/apply'},
      {path: '/afterSaleOrder/return/:id',component:afterSaleOrderReturn,name:'/afterSaleOrder/return'},
      {path: '/afterSaleOrder/pay/:id',component:afterSaleOrderPay,name:'/afterSaleOrder/pay'}
      ]
  },
  {path: '/login',name: 'login',component: Login},
  {path: '/register',name: 'register',component: Register},
  {path: '/detail/:id',name:'detail',component: Goods_selective},
  {path: '/editPasswordOne',component:dialogEditPasswordOne},
  {path: '/editPasswordTwo',component:dialogEditPasswordTwo,name:'/editPasswordTwo'},
  {path: '/success',component:dialogSuccess,name:'/success'},
  {path: '/fail',component:dialogSuccess,name:'/fail'},
  ]
})
