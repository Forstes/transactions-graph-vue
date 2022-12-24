<script setup lang="ts">
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import { onMounted } from "vue";
import Hexagon from "../scripts/hexagon";

onMounted(() => {
  const svgDraw = document.getElementById("svgDraw");
  const simulation = new ForceSimulation(svgDraw);
  simulation.templateStore.add("hexagon", Hexagon);
  simulation.render(graph);
});

const graph = {
  nodes: [
    {
      id: "node1",
      shape: {
        type: "hexagon",
        scale: 1,
      },
      x: -150,
      y: 30,
      payload: {
        title: "",
        color: "#9575cd",
      },
    },
    {
      id: "node2",
      shape: {
        type: "hexagon",
        scale: 1,
      },
      x: 150,
      y: -30,
      payload: {
        title: "",
        color: "#9575cd",
      },
    },
  ],
  links: [
    {
      source: "node1",
      target: "node2",
      directed: true,
      strength: "weak",
    },
  ],
};
</script>

<template>
  <svg ref="svgDraw" width="100%" height="100%"></svg>
</template>
