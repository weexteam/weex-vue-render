<template>
  <!-- <scroller> -->
  <div>
    <!-- <image ref="img" class="img test" :src="url"
    style="width:750px;height:120px;display:flex;background-color:red;"
    quality="high"
    sharpen="sharpen"
    v-if="show"
    v-on:click="clickImg"
    @load="imgLoad"
    @appear="imgAppear"
    test-attr="attr"
    :resize="resize"
    ></image> -->
    <text class="txt">HELLO</text>
    <item></item>
    <!-- <item @userDef="userDef" @offsetAppear="handleAppear" appear-offset="300" @click="clickItem"></item> -->
    <!-- <a href="#" class="a-link">   -->
    <!-- <div class="outer2" @click="outerClick2">
      <div class="outer" @click="outerClick" bubble="true">
        <text @click="innerAClick" class="txt1">Hello World. Blar, Blar, Blar, Blar Blar, Blar Blar, Blar Blar</text>
      </div>
    </div> -->
    <!-- <text @click="innerAClick" class="txt" :style="{ width: w, lines: nLines, backgroundColor: bgColor }">Hello World. Blar, Blar, Blar, Blar Blar, Blar Blar, Blar Blar</text> -->
    <!-- <text @click="innerAClick" class="txt" :style="v.bindingStyleObj">Hello World. Blar, Blar, Blar, Blar Blar, Blar Blar, Blar Blar</text> -->
    <!-- </a> -->
    <!-- <foo style="width:200px;height:300px;"></foo> -->
    <!-- <input type="text" style="placeholder-color:red;" placeholder="Input Text" class="input" :autofocus=true value="" /> -->
  </div>
  <!-- </scroller> -->
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
      resize: 'cover',
      w: '400px',
      show: true,
      nLines: 1,
      url: '//test.ttt/test.jpg',
      bgColor: 'yellow'
    }
  },
  computed: {
    v () {
      return {
        bindingStyleObj: this.bindingStyleObj
      }
    },
    bindingStyleObj () {
      return {
        width: this.w,
        lines: this.nLines,
        backgroundColor: this.bgColor
      }
    }
  },
  methods: {
    clickImg () {
      const img = this.$refs.img
      console.log('img ref: --- ', img)
      animation.transition(img, {
        duration: 1000,
        styles: {
          marginLeft: '100px',
          transform: 'translate(100px, 0)'
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
    outerClick () {
      console.log('outer click')
    },
    outerClick2 () {
      console.log('outer click 2!')
    },
    userDef (e) { 
      console.log(e.type, e)
    },
    clickItem () {
      console.log('click on item')
    },
    imgAppear () {
      console.log('img appear!')
    },
    imgLoad () {
      console.log('img loaded!')
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
.txt {
  color: red;
}
/* 
.input {
  placeholder-color: green;
}
.a-link {
  width: 750px;
  height: 200px;
  background-color: pink;
}
.img {
  width: 750px;
  height: 100px;
}
.txt1 {
  width: 400px;
  lines: 1;
  background-color: blue;
  font-weight: bold;
  font-size: 100px;
  color: red;
}
.txt {
  background-color: blue;
  font-weight: bold;
  font-size: 100px;
  color: red;
}
.outer {
  width: 500px;
  height: 200px;
  background-color: yellow;
}
.outer2 {
  transform: translate(3px, 0px);
  width: 750px;
  height: 300px;
  background-color: blue;
}
 */
</style>
