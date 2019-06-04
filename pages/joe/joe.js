const Util = require('../../utils/util.js')
Page({
    data: {
      year: (new Date()).getFullYear(),
      ad_id: wx.getStorageSync('bannerAd')[3],
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
        phoneNumber: '13148728223' //仅为示例，并非真实的电话号码
      })
    }
})