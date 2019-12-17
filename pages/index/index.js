//index.js
var util = require('../../utils/util.js');
const updateManager = wx.getUpdateManager()
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
    show:false,
    likeNum:0,
    points:0
  },
  onLoad: function (option) {
    var points=wx.getStorageSync('points');
    if(!points){
      points=0;
    }
    this.setData({
      points: points
    })
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
      // videoAd.onLoad(() => { })
      videoAd.onError((err) => { 
        console.log(err)
      })
      videoAd.onClose((res) => { 
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          wx.showToast({
            title: '积分又涨了！',
          })
          that.reward()

        } else {
          console.log('no reward')
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
    // if (wx.createRewardedVideoAd && wx.getStorageSync('videoAd')[1]) {
    //   videoAd1 = wx.createRewardedVideoAd({
    //     adUnitId: wx.getStorageSync('videoAd')[1]
    //   })
    //   videoAd1.onLoad(() => { })
    //   videoAd1.onError((err) => { })
    //   videoAd1.onClose((res) => { })
    // }
    //初始化插屏广告
    if (wx.createInterstitialAd && wx.getStorageSync('cpAd')[0]) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: wx.getStorageSync('cpAd')[0]
      })
      interstitialAd.onError((err) => {
        console.log(err)
      })
      // interstitialAd.onLoad(() => { })
      
      // interstitialAd.onClose(() => { })
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
      success:res=>{
        //console.log(res)
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
          var show=false;
          wx.setStorageSync('words', res.data.response.words);
          wx.setStorageSync('wordsNum', res.data.response.wordsNum);
          wx.setStorageSync('crazy', res.data.response.crazy);
          wx.setStorageSync('crazyNum', res.data.response.crazyNum);
          wx.setStorageSync('linkNum', res.data.response.likesNum);
          if (res.data.response.likesNum>0){
            show=true
          }       
          that.setData({
            words: words,
            wordsNum: wordsNum,
            crazy: crazy,
            crazyNum: crazyNum,
            show:show
          });
        }
      },
      onError:function(res){
        wx.showToast({
          title: '无法连接服务器',
        })
        console.log('fail:'+res)

      }
    });

    

  },
  next:function(){
    var that=this
    var words = wx.getStorageSync('words')
    var wordsNum = wx.getStorageSync('wordsNum')
    var crazy = wx.getStorageSync('crazy')
    var crazyNum = wx.getStorageSync('crazyNum')
    var likeNum = wx.getStorageSync('likeNum')
    var show = true
    if (likeNum>0){
      var show =true
        this.setData({
          show: show
        })
    }
    if (wordsNum == 0 || crazyNum == 0) {
      wx.showModal({
        title: '系统错误提示',
        content: '请下拉刷新页面，或到‘关于’页面联系客服',
        showCancel: false,
        confirmText: '知道了',
      });
      return;
    }
    if (this.data.activeIndex == 0) { 
      var rand = this.uniqueRand(wordsNum, this.data.isRand);
      if (rand > 30 && rand < 40 && that.data.isRand && show) {
        wx.showModal({
          title: '系统提示',
          content: '发现一款好玩的游戏，前往体验？',
          success(res) {
            if (res.confirm) {
              that.video_ad()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
      this.setData({
        question: words[rand].question,
        rand: rand,
        totalNum: wordsNum
      });
    } else if (this.data.activeIndex == 1) {
      var rand = this.uniqueRand(crazyNum, this.data.isRand);
      this.setData({
        question: crazy[rand].question,
        rand: rand,
        totalNum: crazyNum
      });
    }
  },
  // 下一题
  bindNext: function () {
    var that = this;
    var words = this.data.words
    var wordsNum = this.data.wordsNum
    var crazy = this.data.crazy
    var crazyNum = this.data.crazyNum
    var likeNum = this.data.likeNum
    if (this.data.wordsNum==0||this.data.crazyNum==0) { 
      words = wx.getStorageSync('words')
      wordsNum = wx.getStorageSync('wordsNum')
      crazy = wx.getStorageSync('crazy')
      crazyNum = wx.getStorageSync('crazyNum')
      likeNum = wx.getStorageSync('likeNum')
      // this.next()
      // return;
    }
    if(likeNum>0){
      this.setData({
        show:true
      })
    }
    
    if (this.data.activeIndex == 0) {
      var rand = this.uniqueRand(wordsNum, this.data.isRand);
      this.bounus(rand,wordsNum)
      this.setData({
        question: words[rand].question,
        rand: rand,
        totalNum: wordsNum
      });
    } else if (this.data.activeIndex == 1) {
      var rand = this.uniqueRand(crazyNum, this.data.isRand);
      this.bounus(rand, crazyNum)
      this.setData({
        question: crazy[rand].question,
        rand: rand,
        totalNum: crazyNum
      });
    }

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
/**
 * 激励视频
 */
  video_ad:function(e){
    var that=this
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            wx.showToast({
              title: '请稍后再试',
              icon: 'none',
              duration: 1500
            });
            // if (videoAd1) {
            //   videoAd1.show().catch(() => {
            //     // 失败重试
            //     videoAd1.load()
            //       .then(() => videoAd1.show())
            //       .catch(err => {
            //         wx.showToast({
            //           title: '请稍后再试',
            //           icon: 'none',
            //           duration: 1500
            //         });
            //       })
            //   })
            // }
          })
      })

    }
  },
  /**
   * 开始页面
   */
  start:function(){
    wx.navigateTo({
      url: '/pages/index/start',
    })
  },
  /**
   * 插屏广告
   */
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
  /**
   * 打开小程序
   */
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
  /**
   * 监听广告错误
   */
  // ad_err:function(e){
  //   console.log(e)
  // },
  /**
   * 下拉更新
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh({
      success:function(){
        
        /**
       * 清理指定缓存
       */
        wx.removeStorage({ key: 'words' })
        wx.removeStorage({ key: 'wordsNum' })
        wx.removeStorage({ key: 'crazy' })
        wx.removeStorage({ key: 'crazyNum' })
        wx.removeStorage({ key: 'likeNum' })
        /**清理结束 */
        //重新打开首页
        wx.reLaunch({
          url: '/pages/index/index',
        })
      
      }
    })
  },
  /**
   * 触发激励
   */
  bounus:function(rand,total){
    var that=this
    let cache = wx.getStorageSync('show_bonus');
    var date = +new Date;
    //60秒内不显示
    var cur_had_tips = parseInt((date - cache)/1000)< 60;

    if (cache&&cur_had_tips) {
      return;
    }
    
    //console.log(that.data.show)
    if (rand > 30 && rand < 40 && that.data.isRand && that.data.show) {
      wx.showModal({
        title: '系统提示',
        content: '获得一次查看视频奖励积分机会，前往领取',
        cancelText:'不需要',
        confirmText:"立刻领取",
        success(res) {
          wx.setStorageSync('show_bonus', +new Date)
          if (res.confirm) {
            that.video_ad()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  /**
   * 发放奖励
   */
  reward(){
    var points=this.data.points
    points=points+1
    //console.log(points)
    this.setData({
      points:points
    })
    wx.setStorageSync('points', points)
  }
})