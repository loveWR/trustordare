// pages/share/index.js
var requestUrl = "https://it.songvii.com/api/v2.truth/";
var actionFile = "applist";
Page({

  /**
   * 页面的初始数据
   */

    data: {
      grids: [],
      ad_id: wx.getStorageSync('bannerAd')[0],
    },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    wx.request({
      url: requestUrl + actionFile,
      data: {
        'not': 'wx909b20cf4174ec0c'
      },
      header: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // success
        var code = res.data.code;
        if (code != 1) {
          wx.showToast({
            title: '数据初始化失败',
            icon: 'none',
            duration: 1500
          });
        } else {
          var list = res.data.response.data;

          that.setData({
           grids:list
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to:function(e){
    var appid = e.currentTarget.dataset.id
    //console.log(appid)
    wx.navigateToMiniProgram({
      appId: appid,
      success(res) {
        // 打开成功
      }
    })
  }
})