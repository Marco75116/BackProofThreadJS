const express = require("express");
const router = express.Router();
const {
  Worker,
  setEnvironmentData,
  getEnvironmentData,
} = require("worker_threads");

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

const arrayDeepCopy = (array) => {
  return JSON.parse(JSON.stringify(array));
};

function _useWorker(filepath, nbNodes, m, k, alpha) {
  return new Promise((resolve, reject) => {
    let historyNodeArray = [];
    let initNodeArray = creationArray(nbNodes);
    historyNodeArray.push(initNodeArray);
    setEnvironmentData("m", m);
    setEnvironmentData("nbNodes", nbNodes);
    setEnvironmentData("k", k);
    setEnvironmentData("alpha", alpha);
    let workerArray = [];

    for (var p = 0; p < nbNodes; p++) {
      workerArray[p] = new Worker(filepath);
      workerArray[p].on("message", (messageFromWorker) => {
        currentNodeArray = messageFromWorker[1];
        messageFromWorker[0].forEach(
          (nodePosition) =>
            (initNodeArray[nodePosition] = currentNodeArray[nodePosition])
        );
        return resolve;
      });
    }

    setInterval(() => historyNodeArray.push(initNodeArray), 1000);
  });
}

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
