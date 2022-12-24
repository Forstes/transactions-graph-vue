<script setup lang="ts">
import { ForceSimulation, Graph, LinkStrength } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import { onMounted } from "vue";
import Hexagon from "../scripts/hexagon";
import getTransactions from "../scripts/chain-data";

let graph: Graph = { nodes: [], links: [] };
const shapePattern = {
  type: "hexagon",
  scale: 1,
};

let inputAddress = "0x1234567890123456789012345678901234567890";

async function loadLayer() {
  const l = graph.nodes.length;

  for (let i = 1; i < 2; i++) {
    let loaded = await getTransactions(graph.nodes[i].payload.title);
console.log(loaded)
    loaded.forEach((t) => {
      if (t.to_address != inputAddress) {
        graph.nodes.push({
          id: t.hash,
          shape: shapePattern,
          payload: { title: t.from_address == graph.nodes[i].payload.title ? t.to_address : t.from_address, color: "#9575cd" },
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

  console.log(graph);
}

onMounted(async () => {
  let transactions = await getTransactions(inputAddress);
  console.log(transactions);

  const nodes: any[] = [],
    links: any[] = [];

  nodes.push({
    id: inputAddress,
    shape: shapePattern,
    payload: { title: inputAddress, color: "#9575cd" },
  });

  transactions.forEach((t) => {
    nodes.push({
      id: t.hash,
      shape: shapePattern,
      payload: { title: t.from_address == inputAddress ? t.to_address : t.from_address, color: "#9575cd" },
    });

    links.push({
      source: t.to_address == inputAddress ? t.hash : inputAddress,
      target: t.to_address == inputAddress ? inputAddress : t.hash,
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
  //simulation.render(graph);
  await loadLayer();
  simulation.render(graph);
});
</script>

<template>
  <svg id="svgDraw" width="100%" height="100%"></svg>
</template>
