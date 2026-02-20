// 각자 자신이 구현하는 기능에 맞게 파일을 추가하기, 대신 파일명에 어떤 기능의 라우터인지 알기 쉽게 영문으로 적어주는 걸 권장

// express의 router 모듈
const express = require("express");
const router = express.Router();

const bookService = require("../services/svc.js");
// 도서 전체 조회
router.get("/books", async (req, res) => {
  const result = await bookService.findAll().catch((err) => console.error(err));
  res.send(result);
});

// 도서 상세 조회
router.get("/books/:no", async (req, res) => {
  const no = req.params.no;
  const result = await bookService
    .findByBookNo(no)
    .catch((err) => console.error(err));
  res.send(result);
});

// 도서 등록
router.post("/books", async (req, res) => {
  const bookInfo = req.body;
  const result = await bookService
    .addNewBook(bookInfo)
    .catch((err) => console.error(err));
  res.send(result);
});

// 도서 수정

// 도서 삭제

module.exports = router;
