"use strict";

const { count } = require("console");
const {
  parentPort,
  setEnvironmentData,
  getEnvironmentData,
} = require("worker_threads");

const getRandomNodes = (nbNodes, uPosition, k) => {
  const randomNodes = [];
  for (var i = 0; i < k; ++i) {
    let randomNode = null;
    while (randomNode === null || randomNode === uPosition) {
      randomNode = Math.floor(Math.random() * nbNodes);
      if (randomNode !== uPosition) randomNodes.push(randomNode);
    }
  }
  return randomNodes;
};

const query = (nodeOne, nodeTwo) => {
  if (nodeTwo.color === 0) {
    nodeTwo.color = nodeOne.color;
  }
  return nodeTwo.color;
};

counterM = 0;

parentPort.on("message", (message) => {
  if (counterM > getEnvironmentData("m") - 1) parentPort.close();
  currentNodeArray = message[0];
  p = message[1];
  if (currentNodeArray[p].color === 0) {
    counterM++;
  } else {
    const randomNodes = getRandomNodes(
      getEnvironmentData("nbNodes"),
      p,
      getEnvironmentData("k")
    );
    randomNodes.forEach((nodePosition) => {
      currentNodeArray[nodePosition].color = returnColor;
      if (returnColor === 1) {
        currentNodeArray[p].blueCounter++;
      } else {
        currentNodeArray[p].redCounter++;
      }
    });
    if (
      currentNodeArray[p].redCounter >
      getEnvironmentData("alpha") * getEnvironmentData("k")
    )
      currentNodeArray[p].color = 2;
    if (
      currentNodeArray[p].blueCounter >
      getEnvironmentData("alpha") * getEnvironmentData("k")
    )
      currentNodeArray[p].color = 1;
    counterM++;
    parentPort.postMessage([randomNodes, currentNodeArray]);
  }
});
