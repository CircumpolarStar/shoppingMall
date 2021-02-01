// pages/classDetail/classDetail.js
const app=getApp();
var appSeleType=app.globalData.seleType;
const db=wx.cloud.database();
const $=db.command.aggregate;
const _=db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seleType:[],
    guessColor:"orange",
    goodsList:[],
    goodsList1:[],
    goodsList2:[],
    seleIndex:0,
    total:0,
    searchWord:'',
    ifDiscount:'block',
    screenBox:[
      {
        title:"品牌",
        img:"/font/up.png"
      },
      {
        title:"销量",
        img:"/font/up.png"
      },
      {
        title:"类别",
        img:"/font/up.png"
      },
    ],
    seleScnSeat:"-50%",
    seleScn:"none",
    mask:'none',
    seleScnText:[],
    getWord2:[],
    overFlow:''
  },
  onScreen(e){
    // console.log('onScreen',e);
    var index=e.currentTarget.dataset.index
    var seleScnText=[];
    var seleScnSeat='';
    var screenBox=this.data.screenBox;
    var getWord2=[]
    switch (index) {
      case 0:
        seleScnSeat="2%";
        break;
      case 1:
        seleScnSeat="35%";
        break;
      case 2:
        seleScnText=[
          {text:"零食",color:"#494848"},
          {text:"乳饮冰",color:"#494848"}
        ];
        seleScnSeat="68%";
        break;
      default:
        break;
    }
    for (let i = 0; i < screenBox.length; i++) {
      screenBox[i].img="/font/up.png"
    }
    for (let i = 0; i < seleScnText.length; i++) {
      getWord2[i]=''
    }
    screenBox[index].img="/font/down.png";
    this.setData({
      seleScnText:seleScnText,
      seleScnSeat:seleScnSeat,
      screenBox:screenBox,
      getWord2:getWord2,
      seleScn:"flex",
      mask:'block',
    overFlow:'hidden'
    })
  },
  toRe(){
    var seleScnText=this.data.seleScnText
    var getWord2=[]
    for (let i = 0; i < seleScnText.length; i++) {
      seleScnText[i].color="#494848" 
      getWord2[i]=''
    }
    this.setData({
      seleScnText:seleScnText,
      getWord2:getWord2
    })
  },

  toScreen(e){
    var getWord2=this.data.getWord2
    var that=this;
    var searchWord=''
    for (let i = 0; i < getWord2.length; i++) {
      searchWord=searchWord + getWord2[i]
      console.log('searchWord',searchWord);
    }
    if (searchWord != '') {
      db.collection('small_shopping_mall').where({
        type:db.RegExp({
          regexp:searchWord
        })
      }).get({
        success(res){
          that.setData({
            goodsList:res.data
          })
          console.log('toScreen goodsList',that.data.goodsList);
          that.onSplit()
        }
      })
    }
    this.setData({
      seleScn:"none",
      mask:'none',
    seleScnSeat:"-50%",
    overFlow:''
    })

  },
  onText(e){
    console.log("text",e);
    var seleScnText=this.data.seleScnText
    var index=e.currentTarget.dataset.index
    var word=e.currentTarget.dataset.text
    var getWord2=this.data.getWord2
    if (seleScnText[index].color == "#494848") {
      seleScnText[index].color="red"
      getWord2[index]=word
    }else{
      seleScnText[index].color="#494848"
      getWord2[index]=''
    }
    console.log("getWord2",getWord2);
    this.setData({
      seleScnText:seleScnText,
      getWord2:getWord2
    })
  },

  selectedColor(e){
    var sele=e.target.dataset.id
    var seleClassType=this.data.seleType
    var getWord=this.data.getWord
    var that=this
    this.getCount();
    if (sele == 'guess') {
      console.log('guess',sele);
      for(var i=0;i<seleClassType.length;i++){
        seleClassType[i].color="white"
      }
      this.setData({
        guessColor:'orange',
        seleType:seleClassType,
        seleIndex:0
      })
      db.collection('small_shopping_mall').where({
        type:db.RegExp({
          regexp:getWord[0]
        })
      }).get({
        success:res=>{
          var goodsList=res.data
          // console.log('guess展示商品',res.data);
          for (let i = 0; i < res.data.length; i++) {
            if (goodsList[i].discount == 0) {
            goodsList[i].ifDiscount='none'
            }else{
              goodsList[i].ifDiscount='block'
            }
          };
          that.setData({
            goodsList:res.data
          })
          that.onSplit()
        }
      })
    }else{
        for(var i=0;i<seleClassType.length;i++){
          seleClassType[i].color="white"
        }
      console.log(seleClassType[sele].color);
      seleClassType[sele].color="orange"
      db.collection('small_shopping_mall').where({
        type:db.RegExp({
          regexp:getWord[sele + 1]
        })
      }).get({
        success:res=>{
          console.log('展示商品',res.data);
          var goodsList=res.data
          for (let i = 0; i < res.data.length; i++) {
            if (goodsList[i].discount == 0) {
            goodsList[i].ifDiscount='none'
            }else{
              goodsList[i].ifDiscount='block'
            }
          }
          that.setData({
            goodsList:goodsList,
            seleIndex:sele + 1
          })
          that.onSplit()
        }
      })
      this.setData({
        guessColor:'white',
        seleType:seleClassType
      })
    }
  },
  onSplit(){
    var goodsList1=[];
    var goodsList2=[];
    var goodsList=this.data.goodsList;
    var goodLength=goodsList.length/2;
    for (let i = 0; i < goodLength; i++) {
      goodsList1.push(goodsList[i]) 
    }
    for (let i = goodLength; i < goodLength*2; i++) {
      goodsList2.push(goodsList[i]) 
    }
    this.setData({
      goodsList1:goodsList1,
      goodsList2:goodsList2
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("首页传值",options);
var that=this
var getWord=[];
getWord[0]='食品'

    db.collection("small_shopping_classDetailType").where({
      "_id":"be7fb3985ff4977902e8814a6b0422fb"
    }).get({
      success(res){
        appSeleType=res.data[0].seleType[0]
        for (let i = 0; i < appSeleType.length; i++) {
          getWord.push(appSeleType[i].type)
        }
        that.setData({
          seleType:appSeleType,
          getWord:getWord
        })
      }
    })
    db.collection('small_shopping_mall').where({
      type:db.RegExp({
        regexp:getWord[0]
      })
    }).get({
      success:res=>{
        var goodsList=res.data
        for (let i = 0; i < res.data.length; i++) {
          if (goodsList[i].discount == 0) {
          goodsList[i].ifDiscount='none'
          }else{
            goodsList[i].ifDiscount='block'
          }
        }
        that.setData({
          goodsList:goodsList,
        })
        that.onSplit()
      }
    })
  },
  getCount(){
    var that=this;
    var getWord=this.data.getWord
        var i=this.data.seleIndex
    db.collection('small_shopping_mall').where({
      type:db.RegExp({
        regexp:getWord[i]
      })
    }).count({
      success(res){
        console.log(res);
        that.setData({
          total:res.total
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

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
          wx.showToast({
            title: '没有更多商品了',
            icon:'none',
            duration:500
          })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})