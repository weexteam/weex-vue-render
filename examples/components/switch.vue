<template>
  <div>
    <text class="title">Colorful Weex Switch</text>
    <div class="example">
      <text class="label">Default</text>
      <switch></switch>
       <switch disabled="true" checked="true"></switch>
      <switch disabled="true"></switch>
    </div>
  
    
     <div class="example">
      <text class="label">Colorful</text>
      <switch onTintColor="#C33D3E" 
              thumbTintColor="#FF7703" 
              tintColor="#850B0B"></switch>
    </div>
    
    <div class="example">
      <text class="label">Colorful disabled</text>
      <switch onTintColor="#C33D3E" 
              thumbTintColor="#FF7703"
              tintColor="#850B0B" 
              checked="true"
              disabled="true"></switch>
              
      <switch onTintColor="#C33D3E" 
              thumbTintColor="#FF7703" 
              tintColor="#850B0B" 
              disabled="true"></switch>
    </div>
    
    
     <div class="example">
      <text class="label">Colorful updated</text>
      <switch :on-tint-color="onTintColor" 
              :thumb-tint-color="thumbTintColor" 
              :tint-color="tintColor"
              checked="true"></switch>
      <div class="btn" @click="onchange">
        <text class="btn-text">Change color</text>
      </div>
    </div>
    
    
  </div>
</template>


<script>
export default {
  data: () => ({
    onTintColor:'#C33D3E',
    thumbTintColor:'#FF7703',
    tintColor:'#850B0B'
  }),
  methods:{
    onchange(){
      this.onTintColor=this.onTintColor=='#C33D3E'?'#FDED4A':'#C33D3E';
      this.thumbTintColor=this.thumbTintColor=='#FF7703'?'#8A6C59':'#FF7703';
      this.tintColor= this.tintColor == '#850B0B'?'#555555':'#850B0B';
    }
  }
}
</script>

<style scoped>
.btn{
  width:200px;
  height:70px;
  background-color:#C33D3E;
  justify-content:center;
  align-items:center;
  margin-left:40px;
  border-radius:10px;
}
.btn-text{
  font-size:30px;
  color:#fff;
}
    .title{
      color:#333;
      font-size:40px;
      margin-top:100px;
      margin-bottom:50px;
      margin-left:180px;
    }
    
  .example {
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 60px;
  }
  .label {
    font-size: 40px;
    line-height: 60px;
    width: 350px;
    color: #666;
    text-align: right;
    margin-right: 36px;
  }
  .info {
    font-size: 30px;
    line-height: 60px;
    color: #BBB;
    margin-left: 10px;
  }
</style>