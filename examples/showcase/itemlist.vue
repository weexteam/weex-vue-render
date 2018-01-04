<template>
  <list class="list" @loadmore="loadmore" :loadmoreoffset="0">
    <text class="btn" @click="loadmore">ADD {{groupCount}} CELLS</text>
    <text class="btn clear" @click="clear">CLEAR ALL</text>
    <cell class="cell" v-for="item in shopList" :id="`item-${item.id}`" :key="item.id" :scope="item.scopeValue" @click="oncellclick(item.id)">
      <div class="shop-div">
        <div class="shop-header">
          <div class="shop-header-icon">
            <div>
              <image class="test" :src="item.PersonPhoto"></image>
            </div>
            <div style="flex-direction:column;margin-left:5px;">
              <div style="margin-top:5px;">
                <text style="font-size:20px;">{{item.PersonName}}</text>
              </div>
              <div style="margin-top:5px;">
                <text style="font-size:20;color:#cccccc;">{{item.PersonVisitTime}}</text>
              </div>
            </div>
          </div>
          <div style="flex:5;flex-direction:row;">
            <div style="flex-direction:row;margin-left:10px;margin-top:10px;">
              <div>
                <image style="width:20px;height:20px;"
                  src="https://img.alicdn.com/tps/i4/TB1zkDeIFXXXXXrXVXX07tlTXXX-200-200.png_88x88xz.jpg"></image>
              </div>
              <div>
                <text style="font-size:20px;">Hope</text>
              </div>
            </div>
            <div style="position:absolute;left:90px;top:10px;flex-direction:row;">
              <div>
                <image style="width:20px;height:20px;"
                  src="https://img.alicdn.com/tps/i2/TB1hRb1IXXXXXX3XVXXXQaP.pXX-87-87.jpeg"></image>
              </div>
              <div>
                <text style="font-size:20px;">Mem</text>
              </div>
            </div>
            <div style="position:absolute;left:170px;top:10px;flex-direction:row;">
              <div>
                <image style="width:20px;height:20px;"
                  src="https://img.alicdn.com/tps/i3/TB1DGkJJFXXXXaZXFXX07tlTXXX-200-200.png"></image>
              </div>
              <div>
                <text style="font-size:20px;">auth</text>
              </div>
            </div>
            <div style="position:absolute;left:250px;top:10px;flex-direction:row;">
              <div>
                <image style="width:20px;height:20px;"
                  src="https://img.alicdn.com/tps/i1/TB1nFvPIXXXXXbUXXXXUAkPJpXX-87-87.png"></image>
              </div>
              <div>
                <text style="font-size:20px;">Friend</text>
              </div>
            </div>
            <div style="position:absolute;left:330px;top:10px;flex-direction:row;">
              <div>
                <image style="width:20px;height:20px;"
                  src="https://img.alicdn.com/tps/i2/TB1CpD7IXXXXXbSXXXXUAkPJpXX-87-87.png"></image>
              </div>
              <div>
                <text style="font-size:20px;">issue</text>
              </div>
            </div>
            <div style="position:absolute;left:410px;top:10px;flex-direction:row;">
              <div>
                <image style="width:20px;height:20px;"
                  src="https://gtms02.alicdn.com/tps/i2/TB11ZZfIVXXXXbMXFXXEDhGGXXX-32-32.png"></image>
              </div>
              <div>
                <text style="font-size:20px;">super</text>
              </div>
            </div>
          </div>
        </div>
        <div class="shopBody" style="flex-direction:column;">
          <div class="descDiv" style="margin-top:10px;margin-left:10px;">
            <text class="shopDesc" style="font-size:25px;">{{item.shopDesc}}</text>
          </div>
          <div style="flex-direction:row;">
            <div class="imgDiv" style="flex:1;height:300px;flex-direction:column;margin:10px;" v-for="img in item.shopImgList">
              <div>
                <image class="shopImg" :src="img.shopImg"></image>
              </div>
              <div style="flex:1;margin-top:10px;flex-direction:row;">
                <div style="flex:1;justify-content:center;flex-direction:row;">
                  <div>
                    <image style="width:20px;height:20px;"
                           src="https://img.alicdn.com/tps/i1/TB1nFvPIXXXXXbUXXXXUAkPJpXX-87-87.png"></image>
                  </div>
                  <div style="margin-left:5px;">
                    <text style="font-size:20px;text-align:center;">Up</text>
                  </div>
                </div>
                <div style="flex:1;justify-content:center;flex-direction:row;">
                  <div>
                    <image style="width:20px;height:20px;"
                           src="https://img.alicdn.com/tps/i2/TB1CpD7IXXXXXbSXXXXUAkPJpXX-87-87.png"></image>
                  </div>
                  <div style="margin-left:5px;">
                    <text style="font-size:20px;text-align:center;">down</text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="shop-footer" style="flex-direction:row;margin-top:10px;margin-left:10px;justify-content:flex-end;">
          <div style="margin-right:5px;">
            <image class="shopLikeImg small-img" :src="item.shopLikeImg"></image>
          </div>
          <div style="margin-right:15px;">
            <text class="shopLikeText" style="font-size:20px;">{{item.shopLikeText}}</text>
          </div>
          <div style="margin-right:5px;">
            <image class="shopCommentImg small-img" :src="item.shopCommentImg"></image>
          </div>
          <div style="margin-right:15px;">
            <text class="shopCommentText" style="font-size:20px;">{{item.shopCommentText}}</text>
          </div>
          <div style="margin-right:5px;">
            <image class="shopLookImg small-img" :src="item.shopLookImg"></image>
          </div>
          <div style="margin-right:15px;">
            <text class="shopLookText" style="font-size:20px;">{{item.shopLookText}}</text>
          </div>
          <div style="margin-right:5px;">
            <image class="shareImg small-img" :src="item.shareImg"></image>
          </div>
          <div style="margin-right:20px;">
            <text class="shareText" style="font-size:20px;">{{item.shareText}}</text>
          </div>
        </div>
      </div>
    </cell>
  </list>
</template>

<script>
  var modal = weex.requireModule('modal')
  module.exports = {
    data: function () {
      return {
        groupCount: 20,
        loadmoreCount: 0,
        shopList: [],
        group: [],
        timestamp: 0,
        loadmoreTimestamp: 0,
        items: [
          {
            id: 1,
            scopeValue: 1,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Mendeleyev',
            PersonVisitTime: 'today',
            shopDesc: 'Genius only means hard-working all one\'s life',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/bao/uploaded/i2/TB1rtOnHpXXXXXLaXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/bao/uploaded/i4/TB15KrfFVXXXXXJXXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/bao/uploaded/i2/TB1t5YBGVXXXXXcaXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 2,
            scopeValue: 2,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Napoleon',
            PersonVisitTime: 'yesterday',
            shopDesc: 'The man who has made up his mind to win will never say "impossible "',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd1.alicdn.com/imgextra/i1/2655929383/TB2.qITjpXXXXcIXXXXXXXXXXXX_!!2655929383.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd3.alicdn.com/imgextra/i3/2655929383/TB2eWwZjpXXXXbHXXXXXXXXXXXX_!!2655929383.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/imgextra/i2/2655929383/TB2tgQWjpXXXXbZXXXXXXXXXXXX_!!2655929383.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 3,
            scopeValue: 3,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Balzac',
            PersonVisitTime: 'yesterday',
            shopDesc: 'There is no such thing as a great talent without great will - power',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd1.alicdn.com/imgextra/i1/TB1AFz9LXXXXXbrXVXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/imgextra/i2/2557954751/TB2is2njXXXXXatXpXXXXXXXXXX_!!2557954751.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/imgextra/i2/2557954751/TB2PNYGjXXXXXbXXXXXXXXXXXXX_!!2557954751.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 4,
            scopeValue: 4,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Thomas Carlyle',
            PersonVisitTime: '3 day ago',
            shopDesc: 'Cease to struggle and you cease to live',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/imgextra/i4/69426324/TB2zbwdfXXXXXa4XpXXXXXXXXXX_!!69426324.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/imgextra/i4/69426324/TB2L7ZAfXXXXXXOXXXXXXXXXXXX_!!69426324.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/imgextra/i4/69426324/TB2p9wufXXXXXbiXXXXXXXXXXXX_!!69426324.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 5,
            scopeValue: 5,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Addison',
            PersonVisitTime: 'yesterday',
            shopDesc: 'A strong man will struggle with the storms of fate',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd3.alicdn.com/bao/uploaded/i3/TB1MQ8_KVXXXXaLXVXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/imgextra/i2/53218032/TB2bGSqiXXXXXXyXpXXXXXXXXXX_!!53218032.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/bao/uploaded/i2/TB1kP2zKFXXXXbIXXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 6,
            scopeValue: 1,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Ruskin',
            PersonVisitTime: 'yesterday',
            shopDesc: 'Living without an aim is like sailing without a compass',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/bao/uploaded/i4/TB11yFnHXXXXXakaXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/imgextra/i4/32720628/TB2CRJUcXXXXXXwXpXXXXXXXXXX_!!32720628.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/bao/uploaded/i2/TB17LUzHXXXXXcEaXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 7,
            scopeValue: 2,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Yiming',
            PersonVisitTime: 'today',
            shopDesc: 'Live a noble and honest life. Reviving past times in your old age will help you to enjoy your life again',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/bao/uploaded/i4/TB1hvNoJXXXXXaMaXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/imgextra/i4/2058567235/TB2V8iygFXXXXaRXpXXXXXXXXXX_!!2058567235.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/imgextra/i2/2058567235/TB2im1QgFXXXXX8XXXXXXXXXXXX_!!2058567235.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 8,
            scopeValue: 3,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'Brown',
            PersonVisitTime: 'yesterday',
            shopDesc: 'Behind every successful man there\'s a lot u unsuccessful years',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd1.alicdn.com/bao/uploaded/i1/TB18BZ2KFXXXXb8XFXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd1.alicdn.com/imgextra/i1/2775383848/TB2r012jVXXXXXHXpXXXXXXXXXX_!!2775383848.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd3.alicdn.com/imgextra/i3/2775383848/TB2iI9VjVXXXXaoXpXXXXXXXXXX_!!2775383848.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 9,
            scopeValue: 4,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'YIMING',
            PersonVisitTime: 'today',
            shopDesc: 'Enrich your life today,. yesterday is history.tomorrow is mystery',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd1.alicdn.com/bao/uploaded/i1/TB1JB.rLpXXXXXLXXXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd4.alicdn.com/imgextra/i4/2702739128/TB2JdvmjVXXXXXjXXXXXXXXXXXX_!!2702739128.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd2.alicdn.com/imgextra/i2/2702739128/TB2A.e6jVXXXXXGXpXXXXXXXXXX_!!2702739128.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",

          },
          {
            id: 10,
            scopeValue: 5,
            PersonPhoto: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_60x60.jpg',
            PersonName: 'YIMING',
            PersonVisitTime: 'yesterday',
            shopDesc: 'The secret of success is constancy to purpose',
            shopImgList: [{
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd3.alicdn.com/bao/uploaded/i3/TB17zXOGXXXXXbEXVXXXXXXXXXX_!!0-item_pic.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd1.alicdn.com/imgextra/i1/2265445951/TB22ACTbFXXXXXBXXXXXXXXXXXX_!!2265445951.jpg_220x220.jpg'
            }, {
              shopImgWidth: '220px',
              shopImgHeight: '220px',
              shopImg: 'https://gd3.alicdn.com/imgextra/i3/2265445951/TB2oXqUbFXXXXXIXXXXXXXXXXXX_!!2265445951.jpg_220x220.jpg'
            }],
            shopLikeImg: 'https://img.alicdn.com/tps/i1/TB1jTxXIVXXXXb8XXXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopLikeText: '6',
            shopCommentImg: 'https://img.alicdn.com/tps/i1/TB1kTKyIVXXXXacXFXX07tlTXXX-200-200.png_88x88xz.jpg',
            shopCommentText: '97',
            shopLookImg: 'https://img.alicdn.com/imgextra/i4/397746073/TB2IseKeFXXXXcVXXXXXXXXXXXX-397746073.png_88x88xz.jpg',
            shopLookText: '1003',
            shareImg: 'https://cbu01.alicdn.com/cms/upload/2015/930/224/2422039_702806130.png_88x88xz.jpg',
            shareText: "10",
          }
        ]
      }
    },
    created () {
      let arr = this.items.slice()
      let len = this.groupCount / 10
      while (--len) {
        arr = arr.concat(arr)
      }
      // each group has count * 10 cells.
      // each cell has 104 nodes.
      // each cell has 3 shop items.
      this.group = arr
    },
    updated () {
      const begin = this.timestamp
      const end = +new Date()
      const len = this.shopList.length
      if (len === 0) {
        return
      }
      modal.toast({
        'message': `updated in ${end-begin}ms. total: ${len} cells.`,
        'duration': 2.0
      });
    },
    methods: {
      getNextGroup (loadmoreCount) {
        const len = this.groupCount
        const base = loadmoreCount * len
        const arr = this.group.slice()
        for (let i = 0; i < len; i++) {
          arr[i].id = base + i + 1
        }
        return arr
      },

      loadmore: function(e) {
        const now = +new Date()
        this.timestamp = now
        if (now - this.loadmoreTimestamp < 100) {
          return
        }
        this.loadmoreTimestamp = now
        const loadmoreCount = this.loadmoreCount
        modal.toast({
          'message': `loadmore ${loadmoreCount + 1}.`
        })
        this.shopList = this.shopList.concat(this.getNextGroup(loadmoreCount))
        this.loadmoreCount++
      },

      clear () {
        this.shopList = []
        this.loadmoreCount = 0
      },

      oncellclick: function(id) {
        modal.toast({
          'message': 'row ' + id + ' clicked',
          'duration': 2.0
        });
      }
    }

  }
</script>

<style scoped>
  .flexRow {
    flex-direction: row;
  }

  .flexColumn {
    flex-direction: column;
  }
  
  .btn {
    position: fixed;
    z-index: 999;
    width: 370px;
    height: 300px;
    text-align: center;
    justify-content: center;
    top: 30px;
    right: 30px;
    font-size: 32px;
    border-radius: 10px;
    font-weight: bold;
    color: #666;
    background-color: #f7f7f7;
  }

  .btn.clear {
    top: 340px;
  }

  .fixed {
    position: fixed;
    bottom: 50px;
    left: 50px;
    width: 300px;
    height: 50px;
    align-items: center;
    justify-content: center
  }

  .shopImg {
    width: 220px;
    height: 220px;
  }

  .list {
    flex-direction: column;
    overflow: hidden;
    width: 750px;
    height: 1200px;
    background-color: #dddddd;
  }

  .cell {
    background-color: #dddddd;
    flex-direction: column;
    width: 750px;
  }

  .test {
    width:60px;
    height:60px;
  }

  .shop-div {
    flex-direction: column;
    background-color: #ffffff;
    margin: 5px;
    padding: 10px;
    border-width: 1px;
    border-color: #cccccc;
    overflow: visible;
  }

  .shopRowList {
    flex-direction: column;
    border-width: 1px;
    border-color: #cccccc;
    overflow: visible;
    margin: 5px;
    padding: 10px;
    background-color: #ffffff;
  }

  .shop-header {
    flex-direction: row;
    width: 720px;
  }
  
  .shop-header-icon {
    flex: 2;
    flex-direction: row;
  }

  .shop-footer {
    flex-direction: row;
    width: 720px;
  }

  .small-img {
    width: 20px;
    height: 20px;
  }
</style>

