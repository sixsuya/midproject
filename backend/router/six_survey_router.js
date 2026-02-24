const express = require("express");
const router = express.Router();
const sixSurveyService = require("../services/six_survey_service");

// ✅ GET /surveys  (목록)
router.get("/surveys", async (req, res) => {
  try {
    const data = await sixSurveyService.getSurveyList();
    return res.json(data);
  } catch (err) {
    console.error("[GET /surveys]", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ 지원대상자 목록: GET /targets
router.get("/targets", async (req, res) => {
  try {
    const data = await sixSurveyService.getTargets();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 질문지 트리 조회
router.get("/surveys/:sverCode", async (req, res) => {
  try {
    const { sverCode } = req.params;
    const data = await sixSurveyService.getSurveyTree(sverCode);

    if (!data) {
      return res.status(404).json({
        message: "Survey not found",
        sver_code: sverCode,
      });
    }
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
