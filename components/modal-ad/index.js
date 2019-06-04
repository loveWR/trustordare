const app = getApp()

Component({

  data: {
    modalhid: false,
    sec: 10
  },
  ready(){
    var that=this
    this.countTime(this.data.sec);
    // setTimeout(function () {
    //   that.setData({ modalhid: true });
    // }, 10000);
  },
  methods: {
    close: function (e) {
      this.setData({
        modalhid: true
      })
    },
    countTime: function (num) {
      var that = this
      num--
      if (num > -1) {
        setTimeout(function () {
          that.setData({ sec: num });
          that.countTime(num)
        }, 1000);
      }else{
        that.setData({ modalhid: true });
      }
    }
  }
})
