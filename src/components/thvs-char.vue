<template>
	<div class="tac" v-if="!chosen">
		<p>{{$t(`reminder.char.selectchar`)}}</p>
    <button v-for="(char, key) in chars" :key="key" @click="select(key)">{{$t(`char['${key}'].name`)}}</button>
	</div>
  <div class="tac" v-else>
    <p>{{$t(`reminder.char.waiting`)}}</p>
  </div>
</template>

<script>
export default {
  name: 'thvsChar',
  components: {},
  data () {
    return {
      chosen: false
    }
  },
  methods: {
    select (char) {
      this.$socket.emit('select char', char)
      this.chosen = true
    }
  },
  props: ['chars', 'id']
}
</script>

<style scoped>

</style>