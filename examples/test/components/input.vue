<template>
  <div>
    <div class="info-panel">
      <text ref="txtInput" class="info">oninput: {{txtInput}}</text>
      <text ref="txtChange" class="info">onchange: {{txtChange}}</text>
      <text ref="txtReturnType" class="info">onreturntype: {{txtReturnType}}</text>
      <text ref="txtSelection" class="info">selection: {{txtSelection}}</text>
      <text ref="vModelText" class="info">{{vModelValue}}</text>
    </div>
    <scroller class="input-panel">
      <input type="text" ref="inputText"
        class="input-placeholder input"
        placeholder="Input Text"
        :autofocus="true"
        value=""
        @change="onchange"
        @input="oninput"/>
      <input type="text" ref="vModelInput"
        class="input-placeholder input"
        placeholder="Input Text"
        :autofocus="true"
        v-model="vModelValue"/>
      <input type="text" ref="inputReturnDefault"
        placeholder="return key default"
        return-key-type="default"
        class="input"
        @return = "onreturn"
        />
      <input type="text" ref="inputReturnGo"
        placeholder="return key go"
        return-key-type="go"
        class="input"
        @return = "onreturn"
        />
      <input type="text" ref="inputReturnNext"
        placeholder="return key next"
        return-key-type="next"
        class="input"
        @return = "onreturn"
        />
      <input type="text" ref="inputReturnSearch"
        placeholder="return key search"
        return-key-type="search"
        class="input"
        @return = "onreturn"
        />
      <input type="text" ref="inputReturnSend"
        placeholder="return key send"
        return-key-type="send"
        class="input"
        @return = "onreturn"
        />
      <input type="text" ref="inputReturnDone"
        placeholder="return key done"
        return-key-type="done"
        class="input"
        @return = "onreturn"
        />
      <div class="btn-group">
        <text class="button" ref="buttonFocus"
          @click="focus">FOCUS</text>
        <text class="button" ref="buttonBlur"
          @click="blur">BLUR</text>
      </div>
      <input type="text" ref="input1"
        placeholder="focus & blur"
        class="input focus"
        value=""/>
      <text class="button" ref="buttonSetRange"
        value="setRange"
        @click="setRange"></text>
      <text class="button" ref="buttonGetSelectionRange"
        value="getSelectionRange"
        @click="getSelectionRange"></text>
      <input type="text"  ref="inputSelection"
        placeholder="please input"
        value="123456789"
        class="input"
        @return = "onreturn"
        />
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
        vModelValue: 'two way binding value',
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

<style scoped>
.info-panel {
  width: 750px;
  padding: 20px;
  border-bottom: 1px solid #ccc;
}
.input-panel {
  width: 750px;
  padding: 20px;
}
.input {
  font-size: 32px;
  line-height: 32px;
  color: #333;
  height: 40px;
  margin: 10px;
  border: 1px solid #999;
  background-color: #ccc;
}
.btn-group {
  flex-direction: row;
}
.button {
  margin: 10px;
  padding: 10px;
  font-size: 32px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #eee;
  color: #666;
}
.info {
  font-size: 32px;
  color: #666;
}
.focus:focus {
  background-color: green;
}
</style>

