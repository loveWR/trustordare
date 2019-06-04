//index.js
var util = require('../../utils/util.js');

//获取应用实例
const app = getApp()
var requestUrl = "https://it.songvii.com/api/v2.truth/";
var actionFile = "questions";

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
let videoAd = null
let videoAd1 = null
let interstitialAd = null
Page({
  data: {
    year: (new Date()).getFullYear(),
    tabs: ["真心话", "大冒险"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    timeid:null,
    question: "点击下一题开始",
    words: ['认真回答一个真心话'],
    crazy: ['认真执行一个大冒险'],
    wordsNum: 0,
    crazyNum: 0,
    rand: 0,
    totalNum: 1,
    sec:10,
    isRand: true,
    // isLogin: true,
    bgcolor: ["#fcf8e3", "#f2dede"],
    txtcolor: ["#8a6d3b", "#a94442"],
    modalhid:false,
    ad_id: wx.getStorageSync('bannerAd')[1],
  },
  onLoad: function (option) {
    var that = this;
    // 初始化分享数据
    if (JSON.stringify(option) != '{}') {
      that.setData({
        question: option.question,
        activeIndex: option.activeIndex,
        rand: Number(option.rand),
        totalNum: option.totalNum
      });
    }
    // 获取窗口宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    // 初始化数据
    this.initData(option);
    //初始化激励广告
    if (wx.createRewardedVideoAd && wx.getStorageSync('videoAd')[0]) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: wx.getStorageSync('videoAd')[0]
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose((res) => { })
    }
    if (wx.createRewardedVideoAd && wx.getStorageSync('videoAd')[1]) {
      videoAd1 = wx.createRewardedVideoAd({
        adUnitId: wx.getStorageSync('videoAd')[1]
      })
      videoAd1.onLoad(() => { })
      videoAd1.onError((err) => { })
      videoAd1.onClose((res) => { })
    }
    //初始化插屏广告
    if (wx.createInterstitialAd && wx.getStorageSync('cpAd')[0]) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: wx.getStorageSync('cpAd')[0]
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }
  },
  // 初始化数据
  initData: function (option) {
    var that = this;
    wx.request({
      url: requestUrl + actionFile,
      data: {
        'type': '1'
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
          var words = res.data.response.words;
          var wordsNum = res.data.response.wordsNum;
          var crazy = res.data.response.crazy;
          var crazyNum = res.data.response.crazyNum;
          var app = res.data.response.app;       
          that.setData({
            words: words,
            wordsNum: wordsNum,
            crazy: crazy,
            crazyNum: crazyNum,
            app:app
          });
        }
      }
    });

    

  },

  // 下一题
  bindNext: function () {
    var that = this;
    if (this.data.activeIndex == 0) {
      var rand = this.uniqueRand(this.data.wordsNum, this.data.isRand);
      if(rand>30&&rand<40){
        //this.video_ad()
      }
      this.setData({
        question: this.data.words[rand].question,
        rand: rand,
        totalNum: this.data.wordsNum
      });
    } else if (this.data.activeIndex == 1) {
      var rand = this.uniqueRand(this.data.crazyNum, this.data.isRand);
      if (rand > 30 && rand < 40) {
        //this.video_ad()
      }
      this.setData({
        question: this.data.crazy[rand].question,
        rand: rand,
        totalNum: this.data.crazyNum
      });
    }
    //wx.vibrateShort({});
  },
  // tab切换
  tabClick: function (e) {
    if (e.currentTarget.id != this.data.activeIndex) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
      this.bindNext();
    }
  },
  // 是否随机
  bindSortChange: function (e) {
    //wx.vibrateShort({});
    this.setData({
      isRand: !!e.detail.value.length
    });
  },
  // 获取随机数
  uniqueRand: function (maxNum, isRand) {
    if (isRand) {
      var newRand = Math.floor(Math.random() * maxNum);
      if (newRand == this.data.rand) {
        if(newRand>1 && newRand<=maxNum){
          newRand-=1
        }else{
          newRand+=1
        }
      }
      if(newRand==0){

        newRand=1;
      }

      return newRand;
    } else {
      var newRand = this.data.rand + 1;
      if (newRand >= maxNum) {
        newRand = 0;
      }
      return Number(newRand);
    }
  },
  // 分享回调
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
     // console.log(res.target)
    }
    return {
      title: '[' + this.data.tabs[this.data.activeIndex] + ']' + this.data.question,
      path: '/pages/index/index?question=' + this.data.question + '&activeIndex=' + this.data.activeIndex + '&rand=' + this.data.rand + '&totalNum=' + this.data.totalNum,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 1500
        });
      }
    }
  },

  video_ad:function(e){
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            if (videoAd1) {
              videoAd1.show().catch(() => {
                // 失败重试
                videoAd1.load()
                  .then(() => videoAd1.show())
                  .catch(err => {
                    wx.showToast({
                      title: '请稍后再试',
                      icon: 'none',
                      duration: 1500
                    });
                  })
              })
            }
          })
      })
    }
  },
  start:function(){
    wx.navigateTo({
      url: '/pages/index/start',
    })
  },
  cp_ad:function(){
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        wx.showToast({
          title: '暂无插屏信息',
          icon: 'none',
          duration: 1500
        });
      })
    }
  },
  jump:function(e){
    var apid = e.currentTarget.dataset.appid
    wx.navigateToMiniProgram({
      appId: apid,
      path: 'pages/index/index',
      success(res) {
        // 打开成功
      }

    })
  },

})