<script setup lang="ts">
import { ForceSimulation, Graph, LinkStrength } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import { ref } from "vue";
import Hexagon from "../scripts/hexagon";
import getTransactions from "../scripts/chain-data";

const inputAddress = ref("0x1234567890123456789012345678901234567890");

let graph: Graph = { nodes: [], links: [] };
const shapePattern = {
  type: "hexagon",
  scale: 1,
};

async function loadLayer() {
  const l = graph.nodes.length;

  for (let i = 1; i < l; i++) {
    let loaded = await getTransactions(graph.nodes[i].payload.title);

    loaded.forEach((t) => {
      if (t.to_address != inputAddress.value) {
        graph.nodes.push({
          id: t.hash,
          shape: shapePattern,
          payload: { title: t.from_address == graph.nodes[i].payload.title ? t.to_address : t.from_address, color: "cyan" },
        });

        graph.links.push({
          source: t.to_address == graph.nodes[i].payload.title ? t.hash : graph.nodes[i].id,
          target: t.to_address == graph.nodes[i].payload.title ? graph.nodes[i].id : t.hash,
          directed: true,
          strength: LinkStrength.Weak,
        });
      }
    });
  }

  //console.log(graph);
}

async function draw() {
  let transactions = await getTransactions(inputAddress.value);
  //console.log(transactions);

  const nodes: any[] = [],
    links: any[] = [];

  nodes.push({
    id: inputAddress.value,
    shape: shapePattern,
    payload: { title: inputAddress.value, color: "red" },
  });

  transactions.forEach((t) => {
    nodes.push({
      id: t.hash,
      shape: shapePattern,
      payload: { title: t.from_address == inputAddress.value ? t.to_address : t.from_address, color: "blue" },
    });

    links.push({
      source: t.to_address == inputAddress.value ? t.hash : inputAddress.value,
      target: t.to_address == inputAddress.value ? inputAddress.value : t.hash,
      directed: true,
      type: "solid",
      strength: LinkStrength.Weak,
    });
  });

  graph.links = links;
  graph.nodes = nodes;

  const svgDraw = document.getElementById("svgDraw");

  const simulation = new ForceSimulation(svgDraw);
  simulation.envGravity = -100;
  simulation.templateStore.add("hexagon", Hexagon);

  await loadLayer();
  simulation.render(graph);
}
</script>

<template>
  <input v-model="inputAddress" />
  <button @click="draw()">Draw graph</button>
  <svg id="svgDraw" width="100%" height="100%"></svg>
</template>
