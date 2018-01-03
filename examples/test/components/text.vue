<template>
  <div class="ct">
    <text ref="simple" class="txt">simple text</text>
    <text ref="empty" class="txt"></text>
    <text ref="lines" class="txt lines">this text should be just in one line and the overflowed text would be replaced with ellipsis...</text>
  </div>
</template>

<style scoped>
.txt {
  border: 1px solid #333;
  background-color: #666;
  color: #ccc;
  margin: 30px;
  font-size: 42px;
}
.lines {
  width: 400px;
  lines: 1;
}
</style>
