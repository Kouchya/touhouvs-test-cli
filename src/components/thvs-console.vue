<template>
  <textarea ref="log" class="console" :placeholder="$t(`reminder.console.defaultlog`)" :value="info" disabled></textarea>
</template>

<script>
export default {
  name: 'thvsConsole',
  components: {},
  data () {
    return {
      chosen: []
    }
  },
  methods: {},
  watch: {
    info () {
      this.$nextTick(() => {
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight
      })
    }
  },
  props: ['info']
}
</script>

<style scoped>
.console {
  height: 300px;
  margin-top: 1em;
  margin-bottom: 2em;
  background-color: #fff;
  resize: none;
  border-radius: 3px;
  border-color: #ddd;
  font-size: 1.2em;
}

.console::-webkit-input-placeholder { /* FIXME */
  color: #8c8c8c;
}
</style>