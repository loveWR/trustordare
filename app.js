var requestUrl = "https://it.songvii.com/api/v2.truth/";
App({
  onLaunch: function () {
      var that = this;
      wx.request({
        url: requestUrl + 'adlist',
        data: {
          'appid': 'wx909b20cf4174ec0c'
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
            var adList = res.data.response.data
           // console.log(adList)
            var videoAd=new Array()
            var cpAd = new Array()
            var bannerAd = new Array()
            for (var v in adList) {
              if (adList[v]['type'] == 1 ) {
                videoAd.push(adList[v]['ad_id'])
                
              }
              if (adList[v]['type'] == 2) {
                cpAd.push(adList[v]['ad_id'])
              }
              if (adList[v]['type'] == 3) {
                bannerAd.push(adList[v]['ad_id'])
              }
            }
            wx.setStorageSync('videoAd', videoAd)
            wx.setStorageSync('bannerAd', bannerAd)
            wx.setStorageSync('cpAd', cpAd)
          }
        }
      });
    
  },

  statusBarHeight: 0
})