const express = require("express");
const router = express.Router();

const creationArray = (nbNodes) => {
  const nodeArray = [];

  for (var i = 0; i < nbNodes; ++i) {
    nodeArray[i] = {
      color: Math.floor(Math.random() * 3),
      blueCounter: 0,
      redCounter: 0,
    };
  }
  return nodeArray;
};

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

const arrayDeepCopy = (array) => {
  return JSON.parse(JSON.stringify(array));
};

const main = (nbNodes, m, k, alpha) => {
  let historyNodeArray = [];
  const initNodeArray = creationArray(nbNodes);
  historyNodeArray.push(initNodeArray);

  for (var i = 0; i < m - 1; i++) {
    let currentNodeArray = arrayDeepCopy(historyNodeArray[i]);
    for (var p = 0; p < nbNodes; p++) {
      if (currentNodeArray[p].color === 0) {
        continue;
      }
      const randomNodes = getRandomNodes(nbNodes, p, k);
      randomNodes.forEach((nodePosition) => {
        returnColor = query(
          currentNodeArray[p],
          currentNodeArray[nodePosition]
        );
        currentNodeArray[nodePosition].color = returnColor;
        if (returnColor === 1) {
          currentNodeArray[p].blueCounter++;
        } else {
          currentNodeArray[p].redCounter++;
        }
      });
      if (currentNodeArray[p].redCounter > alpha * k)
        currentNodeArray[p].color = 2;
      if (currentNodeArray[p].blueCounter > alpha * k)
        currentNodeArray[p].color = 1;
      [currentNodeArray[p].redCounter, currentNodeArray[p].blueCounter] = [
        0, 0,
      ];
    }
    historyNodeArray.push(currentNodeArray);
  }
  return historyNodeArray;
};

const getData = (nbNodes, m, k, alpha) => {
  returnArray = [];
  finalArrayNodes = main(nbNodes, m, k, alpha);
  finalArrayNodes.forEach((arrayNode) => {
    const nbNodeNeutre = arrayNode.filter((node) => node.color === 0).length;
    const nbNodeRed = arrayNode.filter((node) => node.color === 2).length;
    const nbNodeBlue = arrayNode.filter((node) => node.color === 1).length;
    returnArray.push([nbNodeNeutre, nbNodeBlue, nbNodeRed]);
  });
  return returnArray;
};

router.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const parameters = req.query;
  console.log(parameters);
  res.send(
    getData(parameters.nbNodes, parameters.m, parameters.k, parameters.alpha)
  );
});

module.exports = router;
