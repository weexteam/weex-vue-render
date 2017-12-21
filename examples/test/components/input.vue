<template>
  <div>
    <div>
      <text ref="txtInput" style="font-size: 40px">oninput: {{txtInput}}</text>
      <text ref="txtChange" style="font-size: 40px">onchange: {{txtChange}}</text>
      <text ref="txtReturnType" style="font-size: 40px">onreturntype: {{txtReturnType}}</text>
      <text ref="txtSelection" style="font-size: 40px">selection: {{txtSelection}}</text>
    </div>
    <scroller>
      <input type="text" ref="inputText" class="input-placeholder input" placeholder="Input Text" :autofocus="true" value="" @change="onchange" @input="oninput"/>
      <input type="text" ref="inputReturnDefault" placeholder="please input" return-key-type="default" class="input" @change="onchange" @return = "onreturn" @input="oninput" />
      <input type="text" ref="inputReturnGo" placeholder="please input" return-key-type="go" class="input" @change="onchange" @return = "onreturn" @input="oninput" />
      <input type="text" ref="inputReturnNext" placeholder="please input" return-key-type="next" class="input" @change="onchange" @return = "onreturn" @input="oninput" />
      <input type="text" ref="inputReturnSearch" placeholder="please input" return-key-type="search" class="input" @change="onchange" @return = "onreturn" @input="oninput" />
      <input type="text" ref="inputReturnSend" placeholder="please input" return-key-type="send" class="input" @change="onchange" @return = "onreturn" @input="oninput" />
      <input type="text" ref="inputReturnDone" placeholder="please input" return-key-type="done" class="input" @change="onchange" @return = "onreturn" @input="oninput" />
      <text class="button" ref="buttonFocus" value="Focus" type="primary" @click="focus"></text>
      <text class="button" ref="buttonBlur" value="Blur" type="primary" @click="blur"></text>
      <input type="text" ref="input1" placeholder="Input1" class="input" value=""/>
      <text class="button" ref="buttonSetRange" value="setRange" type="primary" @click="setRange"></text>
      <text class="button" ref="buttonGetSelectionRange" value="getSelectionRange" type="primary" @click="getSelectionRange"></text>
      <input type="text"  ref="inputSelection" placeholder="please input" value="123456789"  class="input" @change="onchange" @return = "onreturn" @input="oninput"/>
    </scroller>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        txtInput: '',
        txtChange: '',
        txtReturnType: '',
        txtSelection:'',
        autofocus: false
      }
    },
    methods: {
      onchange: function (event) {
        this.txtChange = event.value
      },
      onreturn: function (event) {
        this.txtReturnType = event.returnKeyType
      },
      oninput: function (event) {
        this.txtInput = event.value
      },
      focus: function () {
        this.$refs['input1'].focus()
      },
      blur: function () {
        this.$refs['input1'].blur()
      },
      setRange: function() {
        this.$refs["inputselection"].setSelectionRange(2, 6)
      },
      getSelectionRange: function() {
        this.$refs["inputselection"].getSelectionRange(e => {
          this.txtSelection = e.selectionStart +'-' + e.selectionEnd
        })
      }
    }
  }
</script>
