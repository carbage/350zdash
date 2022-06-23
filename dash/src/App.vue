<template>
  <div id="app">
    <h2>Dashboard</h2>
    <span v-text="result"></span>
    <vue-gauge :refid="'rpm-gauge'"></vue-gauge>
  </div>
</template>

<script>
import VueGauge from "vue-gauge";

export default {
  name: "App",
  data: function () {
    return {
      connection: null,
      result: null,
    };
  },
  methods: {},
  created: function () {
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://localhost:8000");
    this.result = "test";

    this.connection.onmessage = (event) => {
      console.log(event);
      this.result = event.data;
    };

    this.connection.onopen = function (event) {
      console.log(event);
    };
  },
  components: { VueGauge }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

