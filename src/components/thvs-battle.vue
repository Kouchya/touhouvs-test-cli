<template>
  <div>
    <div class="row">
      <div class="col-lg-6 char-display tac">
        <h3>{{$t(`reminder.battle.self`)}}</h3>
        <ul>
          <li>{{$t(`char['${player.name}'].name`)}}</li>
          <li>{{player.hp}}/{{player.basehp}}</li>
        </ul>
        <span>
          <button v-for="(card, index) in player.handcards" :key="index" @click="prepareToUse(index)" :class="{'handcard-display': true}" :disabled="!operable || chosen.length >= player.uselimit || chosen.includes(index)">
            <ruby>{{$t(`card['${card.name}'].name`)}}<rt>{{card.atk}}/{{card.dfs}}</rt></ruby>
          </button>
        </span>
      </div>
      <div class="col-lg-6 char-display tac">
        <h3>{{$t(`reminder.battle.oppo`)}}</h3>
        <ul>
          <li>{{$t(`char['${oppo.name}'].name`)}}</li>
          <li>{{oppo.hp}}/{{oppo.basehp}}</li>
        </ul>
        <span>
          <button v-for="(card, index) in oppo.handcards" :key="index" :class="{'handcard-display': true}" disabled>
            <ruby>{{$t(`card['${card.name}'].name`)}}<rt>{{card.atk}}/{{card.dfs}}</rt></ruby>
          </button>
        </span>
      </div>
    </div>
    <div class="chosen-cards tac">
      <span>
        <h4 class="chosen-title">{{$t(`reminder.battle.chosen`)}}</h4>
        <button class="handcard-display" v-for="(cardid, index) in chosen" :key="index" @click="cancelPrepare(index)" :disabled="!operable">
          <ruby>{{$t(`card['${player.handcards[cardid].name}'].name`)}}<rt>{{player.handcards[cardid].atk}}/{{player.handcards[cardid].dfs}}</rt></ruby>
        </button>
      </span>
    </div>
    <div class="use-btn tac">
      <button @click="useCards" :disabled="!operable || chosen.length === 0">{{$t(`reminder.battle.use`)}}</button>
    </div>
    <div class="console-container">
      <thvs-console class="col-lg-12 tac" :info="info"></thvs-console>
    </div>
  </div>
</template>

<script>
import ThvsConsole from './thvs-console.vue'

export default {
  name: 'thvsBattle',
  components: {
    ThvsConsole
  },
  data () {
    return {
      chosen: [],
      operable: true
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
      this.operable = false
      this.$socket.emit('use', this.chosen)
    }
  },
  mounted () {
    this.$socket.on('battle', () => {
      this.operable = true
      this.chosen = []
    })
  },
  props: ['player', 'oppo', 'info']
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
  margin-bottom: 2em;
  margin-top: 4em;
}

.chosen-title {
  display: inline;
}

.use-btn {
  margin-top: 1em;
}

.console-container {
  padding-left: 2em;
  padding-right: 2em;
}
</style>