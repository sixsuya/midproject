const express = require("express");
const app = express(); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// 라우팅 등록 영역
app.get("/", (req, res) => {
  res.send("Welcome!");
});

const Router = require("./router/router.js");
app.use("/", Router);

// 서버 실행
const port = 3000;
app.listen(port, () => console.log(`서버 실행 http://localhost:${port}`));