const Util = require('../../utils/util.js')
Page({
    data: {
      year: (new Date()).getFullYear(),
      ad_id: wx.getStorageSync('bannerAd')[0],
        // canUseSetClipboardData: wx.canIUse('setClipboardData')
    },
    payMeMoney() {
      wx.previewImage({ urls: ['https://it.songvii.com/paywx.jpg'] })
    },
    onLoad() {
        wx.setNavigationBarTitle({ title: '关于' })
    },
    // 定义转发
    onShareAppMessage: function(){

      return {
        title: '聚会必备，真心话大冒险,敢玩才刺激！',
        path: '/pages/joe/joe'
      }
    },
    call(){
      wx.makePhoneCall({
        phoneNumber: '13148728223' 
      })
    },
  share() {
    wx.previewImage({ urls: ['https://it.songvii.com/upload/applist/share.jpg'] })
  },
  help(){
    wx.showModal({
      title: '系统帮助',
      content: '积分用于增值服务，敬请期待',
      showCancel:false,
      confirmText:'我知道了',
      confirmColor:'black',
      success:function(res){
        console.log(res)
      },
      fail:function(res){
        console.log('fail:'+res)
      }
    })
  },
  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },

})