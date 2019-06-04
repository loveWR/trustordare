let videoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    ad_id: wx.getStorageSync('bannerAd')[2],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化激励广告
    if (wx.createRewardedVideoAd && wx.getStorageSync('videoAd')[1]) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: wx.getStorageSync('videoAd')[1]
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { })
    }
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
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation

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
  romate() {
    var angel = Math.floor(Math.random() * 3600)
    this.animation.rotate(angel).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  video_ad: function (e) {
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
              
            })
        })
      }else{
        wx.showToast({
          title: '暂无信息',
          icon: 'none',
          duration: 1500
        });
      }
    },
  
})