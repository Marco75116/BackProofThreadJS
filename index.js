const express = require("express");
const product = require("./api/product");
const app = express();
const port = process.env.PORT || 8080;

app.use("/api/product", product);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
