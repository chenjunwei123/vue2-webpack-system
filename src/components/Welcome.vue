<template>
<div class="welcome-containder">
  <welcomeBackground/>
</div>
</template>

<script>
import welcomeBackground from './background/welcomeBackground '
export default {
  components: { welcomeBackground },
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style scoped lang='less'>
  .welcome-containder {
    background-color:#eee;
  }
</style>
