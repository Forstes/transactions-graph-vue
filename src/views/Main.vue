<script setup lang="ts">
import { ForceSimulation, Graph, LinkStrength } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import { onMounted } from "vue";
import Hexagon from "../scripts/hexagon";
import getTransactions from "../scripts/chain-data";

let graph: Graph = { nodes: [], links: [] };
let inputAddress = "0x1234567890123456789012345678901234567890";

onMounted(async () => {
  let transactions = await getTransactions(inputAddress);

  console.log(transactions);

  const shapePattern = {
    type: "hexagon",
    scale: 1,
  };

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
console.log(graph);
  const svgDraw = document.getElementById("svgDraw");
  const simulation = new ForceSimulation(svgDraw);
  simulation.templateStore.add("hexagon", Hexagon);
  simulation.render(graph);
});

const a: Graph = {
  nodes: [
    {
      id: "node1",
      shape: {
        type: "hexagon",
        scale: 1,
      },
      payload: {
        title: "My Node 1",
        color: "#9575cd",
      },
    },
    {
      id: "node2",
      shape: {
        type: "hexagon",
        scale: 1,
      },
      payload: {
        title: "My Node 15151616777777",
        color: "blue",
      },
    },
  ],
  links: [
    {
      source: "node1",
      target: "node2",
      directed: true,
      strength: LinkStrength.Weak,
    },
  ],
};
</script>

<template>
  <svg id="svgDraw" width="100%" height="100%"></svg>
</template>
