<template>
  <div>
    <div class="tac">
      <h1 v-if="player.win">胜利</h1>
      <h1 v-else>败北</h1>
    </div>
    <div class="tac">
      本场使用角色：{{$t(`char['${player.name}'].name`)}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'thvsEnd',
  components: {},
  data () {
    return {}
  },
  methods: {},
  props: ['player']
}
</script>

<style scoped>

</style>