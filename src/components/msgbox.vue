<template>
  <div>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{msg}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'inputbar',
  data() {
    return {}
  },
  methods: {},
  props: ['messages']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#messages { list-style-type: none; margin: 0; padding: 0; }

#messages li { padding: 5px 10px; }

#messages li:nth-child(odd) { background: #eee; }
</style>
