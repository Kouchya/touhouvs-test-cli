<template>
  <div>
    <div class="char-display tac">
      <h3>{{$t(`reminder.battle.self`)}}</h3>
      <ul>
        <li>{{$t(`char['${player.name}'].name`)}}</li>
        <li>{{player.hp}}/{{player.basehp}}</li>
      </ul>
      <span>
        <button class="handcard-display" v-for="(card, index) in player.handcards" :key="index" @click="prepareToUse(index)" :disabled="chosen.length >= player.uselimit || chosen.includes(index)">
          <ruby>{{$t(`card['${card.name}'].name`)}}<rt>{{card.atk}}/{{card.dfs}}</rt></ruby>
        </button>
      </span>
    </div>
    <div class="char-display tac">
      <h3>{{$t(`reminder.battle.oppo`)}}</h3>
      <ul>
        <li>{{$t(`char['${oppo.name}'].name`)}}</li>
        <li>{{oppo.hp}}/{{oppo.basehp}}</li>
      </ul>
      <span>
        <button class="handcard-display" v-for="(card, index) in oppo.handcards" :key="index" disabled>
          <ruby>{{$t(`card['${card.name}'].name`)}}<rt>{{card.atk}}/{{card.dfs}}</rt></ruby>
        </button>
      </span>
    </div>
    <div class="chosen-cards tac">
      <span>
        <h4 class="chosen-title">{{$t(`reminder.battle.chosen`)}}</h4>
        <button class="handcard-display" v-for="(cardid, index) in chosen" :key="index" @click="cancelPrepare(index)">
          <ruby>{{$t(`card['${player.handcards[cardid].name}'].name`)}}<rt>{{player.handcards[cardid].atk}}/{{player.handcards[cardid].dfs}}</rt></ruby>
        </button>
      </span>
    </div>
    <div class="use-btn tac">
      <button @click="useCards" :disabled="chosen.length === 0">{{$t(`reminder.battle.use`)}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'thvsBattle',
  components: {},
  data () {
    return {
      chosen: []
    }
  },
  methods: {
    prepareToUse (index) {
      this.chosen.push(index)
    },
    cancelPrepare (index) {
      this.chosen.splice(index, 1)
    },
    useCards () {
      this.$socket.emit('use', this.chosen)
    }
  },
  props: ['player', 'oppo']
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

.handcard-display {
  display: inline;
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.char-display {
  margin-bottom: 4em;
  margin-top: 4em;
}

.chosen-title {
  display: inline;
}

.use-btn {
  margin-top: 1em;
}
</style>