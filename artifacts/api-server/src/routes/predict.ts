import { Router, type IRouter } from "express";
import { PredictBusinessBody } from "@workspace/api-zod";
import { computePrediction } from "../lib/prediction";

const router: IRouter = Router();

router.post("/predict", async (req, res): Promise<void> => {
  const parsed = PredictBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = computePrediction(parsed.data);
  res.json(result);
});

export default router;
