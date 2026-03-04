/**
 * upd_history_router.js
 * 수정이력(upd_history) 라우터
 * - 마운트 위치: /api/history
 * - GET  /support/:supCode?category_name=j0_00|j0_10|j0_20|j0_30  → 목록 조회
 * - POST /support/:supCode                                          → 수정이력 INSERT
 */
const express = require("express");
const router = express.Router();
const updHistoryService = require("../services/upd_history_service");

// 수정이력 목록 조회
router.get("/support/:supCode", async (req, res) => {
  try {
    const { supCode } = req.params;
    const categoryName = req.query.category_name || "j0_00";
    const data = await updHistoryService.getUpdHistoryByTarget(supCode, categoryName);
    return res.json(data);
  } catch (err) {
    console.error("[GET /history/support/:supCode]", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message || String(err),
    });
  }
});

// 수정이력 INSERT
router.post("/support/:supCode", async (req, res) => {
  try {
    const { supCode } = req.params;
    const { category_name, upd_member, upd_target, content, upd_content } =
      req.body || {};
    const result = await updHistoryService.insertUpdHistory({
      hisCategory: supCode,
      categoryName: category_name || "j0_00",
      updMember: upd_member || "",
      updTarget: upd_target || "",
      content: content || "",
      updContent: upd_content || "",
    });
    return res.status(201).json({ message: "ok", history_no: result.history_no });
  } catch (err) {
    console.error("[POST /history/support/:supCode]", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message || String(err),
    });
  }
});

module.exports = router;
