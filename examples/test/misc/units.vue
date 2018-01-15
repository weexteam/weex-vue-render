<template>
  <div>
    <text class="txt" style="font-size: 32wx;">static style 32wx</text>
    <text class="txt" :style="{ fontSize: '32wx' }">style binding 32wx</text>
    <text class="txt wx">style tag 32wx</text>
  </div>
</template>

<style scoped>
.txt {
  margin: 10px;
  padding: 10px;
  background-color: #ddd;
  border-bottom: 1px solid #666;
}
.wx {
  font-size: 32wx;
}
</style>
