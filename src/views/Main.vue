<script setup lang="ts">
import { ForceSimulation, Graph, LinkStrength } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import { onMounted, ref } from "vue";
import Hexagon from "../scripts/hexagon";
import getTransactions from "../scripts/chain-data";

const inputAddress = ref("0x1234567890123456789012345678901234567890");
const depth = ref(1);
const maxAddresses = 3;

let svgDraw, simulation;

let graph: Graph = { nodes: [], links: [] };
const shapePattern = {
  type: "hexagon",
  scale: 1,
};

async function loadLayer(deep = 2) {
  if (deep < 1) return;

  if (deep > depth.value) {
    const currD = graph.nodes.filter((n) => n.depth == depth.value);
    depth.value++;

    const color = getRandomColor();

    const iter = currD.length <= maxAddresses ? currD.length : maxAddresses;

    for (let i = 1; i < iter; i++) {
      let loaded = await getTransactions(currD[i].payload.title);

      const iter2 = loaded.length <= maxAddresses ? loaded.length : maxAddresses;

      for (let t = 0; t < iter2; t++) {
        if (loaded[t].to_address != inputAddress.value) {
          graph.nodes.push({
            id: loaded[t].hash,
            shape: shapePattern,
            payload: {
              title: loaded[t].from_address == currD[i].payload.title ? loaded[t].to_address : loaded[t].from_address,
              color,
            },
            depth: deep,
          });

          graph.links.push({
            source: loaded[t].to_address == currD[i].payload.title ? loaded[t].hash : currD[i].id,
            target: loaded[t].to_address == currD[i].payload.title ? currD[i].id : loaded[t].hash,
            directed: true,
            strength: LinkStrength.Strong,
            depth: deep,
          });
        }
      }
    }
    draw();
  } else if (deep < depth.value) {
    graph.nodes = graph.nodes.filter((n) => n.depth != depth.value);
    graph.links = graph.links.filter((n) => n.depth != depth.value);
    depth.value--;
    draw();
  }
  //console.log(graph);
}

async function loadInitial() {
  let transactions = await getTransactions(inputAddress.value);

  const nodes: any[] = [],
    links: any[] = [];

  nodes.push({
    id: inputAddress.value,
    shape: shapePattern,
    payload: { title: inputAddress.value, color: "red" },
    depth: 0,
  });

  transactions.forEach((t) => {
    nodes.push({
      id: t.hash,
      shape: shapePattern,
      payload: { title: t.from_address == inputAddress.value ? t.to_address : t.from_address, color: "blue" },
      depth: depth.value,
    });

    links.push({
      source: t.to_address == inputAddress.value ? t.hash : inputAddress.value,
      target: t.to_address == inputAddress.value ? inputAddress.value : t.hash,
      directed: true,
      strength: LinkStrength.Strong,
      depth: depth.value,
    });
  });

  graph.links = links;
  graph.nodes = nodes;

  draw();
}

onMounted(() => {
  svgDraw = document.getElementById("svgDraw");
  simulation = new ForceSimulation(svgDraw);
  simulation.envGravity = 10;
  simulation.templateStore.add("hexagon", Hexagon);
});

async function draw() {
  simulation.render(graph);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
</script>

<template>
  <input v-model="inputAddress" />
  <button @click="loadInitial()">Draw graph</button>
  <h5 style="margin-inline: 1rem">Depth: {{ depth }}</h5>
  <button @click="loadLayer(depth + 1)">+</button><button @click="loadLayer(depth - 1)">-</button>
  <svg id="svgDraw" width="100%" height="90%"></svg>
</template>
