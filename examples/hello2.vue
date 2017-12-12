<template>
  <scroller>
    <!-- <image ref="img" class="img test" :src="url"
    style="width:750px;height:120px;display:flex;background-color:red;"
    quality="high"
    sharpen="sharpen"
    v-if="show"
    v-on:click="clickImg"
    @appear="imgAppear"
    test-attr="attr"
    resize="cover"
    ></image>
    <item @offsetAppear="handleAppear" appear-offset="300" @click="clickItem"></item>
    -->
    <!-- <a href="#" class="a-link"> -->
    <text @click="innerAClick" class="txt" :style="{ width: w, lines: nLines, backgroundColor: bgColor }">Hello World. Blar, Blar, Blar, Blar Blar, Blar Blar, Blar Blar</text>
    <!-- </a> -->
    <!-- <foo style="width:200px;height:300px;"></foo> -->
    <!-- <input type="text" style="placeholder-color:red;" placeholder="Input Text" class="input" :autofocus=true value="" /> -->
  </scroller>
</template>

<script>
// 750x234
const animation = weex.requireModule('animation')
const dom = weex.requireModule('dom')
const validUrl = '//img.alicdn.com/imgextra/i1/129/TB21cHVd4TI8KJjSspiXXbM4FXa_!!129-0-luban.jpg'
export default {
  components: {
    item: require('./item.vue'),
    foo: {
      render (createElement) {
        return createElement('div', {
          staticStyle: {backgroundColor: 'red'}
        })
      }
    }
  },
  data () {
    return {
      w: '400px',
      show: true,
      nLines: 1,
      url: '//test.ttt/test.jpg',
      bgColor: 'yellow'
    }
  },
  methods: {
    clickImg () {
      const img = this.$refs.img
      console.log('img ref: --- ', img)
      animation.transition(img, {
        duration: 1000,
        styles: {
          marginLeft: '100px'
        }
      }, function () {
        console.log('animation callback!!')
        dom.getComponentRect(img, function (res) {
          console.log('img rect:', JSON.stringify(res))
        })
      })
    },
    innerAClick () {
      console.log('inner a click')
      this.nLines = (this.nLines === 1 ? 2 : 1)
    },
    clickItem () {
      console.log('click on item')
    },
    imgAppear () {
      console.log('img appear!')
    },
    handleAppear () {
      console.log('offset appear!')
    }
  },
  mounted () {
    setTimeout(() => {
      this.url = validUrl
    }, 1000)
  }
} 
</script>

<style scoped>
.a-link {
  width: 750px;
  height: 200px;
  background-color: pink;
}
.img {
  width: 750px;
  height: 100px;
}
.txt {
  /* width: 400px; */
  background-color: blue;
  font-weight: bold;
  font-size: 100px;
  color: red;
}
</style>
