import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "4Infinity Care Plan API" });
});

// Main analyze endpoint
app.post(
  "/analyze",
  upload.array("photos", 4), // matches <input name="photos">
  (req, res) => {
    const {
      clientName,
      clientEmail,
      ageRange,
      hairType,
      mainConcern = "",
      habits = "",
      goals = "",
    } = req.body;

    const concern = mainConcern.toLowerCase();
    const type = (hairType || "").toLowerCase();

    // --- VERY SIMPLE RULES (you can expand later) ---
    let insights = "";
    let care = "";
    let nextSteps = "";
    let hairstyle = "";

    if (concern.includes("shedding") || concern.includes("thinning")) {
      insights +=
        "You are noticing changes in density or increased shedding in certain areas. ";
      care +=
        "Protect the hairline and crown with low‑tension styles and gentle cleansing, while tracking any patterns in when shedding increases. ";
      nextSteps +=
        "Your consultation can explore hormones, nutrition, stress, and styling history connected to this shedding. ";
    }

    if (concern.includes("flakes") || concern.includes("itch") || concern.includes("itchy")) {
      insights +=
        "Scalp flaking or itch suggests surface dryness, buildup, or irritation on the scalp. ";
      care +=
        "Use a pH‑balanced cleanser on the scalp, reduce heavy oils on the scalp itself, and include periodic clarifying to lift buildup. ";
      nextSteps +=
        "Clear photos of your part line, crown, and hairline will help map how widespread the flaking or irritation is. ";
    }

    if (concern.includes("breakage")) {
      insights +=
        "Breakage and trouble retaining length point toward mechanical or chemical stress on the hair fiber. ";
      care +=
        "Reduce direct heat, avoid aggressive detangling, and rotate in moisture and strength treatments at the mid‑lengths and ends. ";
      nextSteps +=
        "Your specialist can help set a protective styling and trim schedule to protect new growth. ";
    }

    if (!insights) {
      insights =
        "Your notes focus on overall improvement rather than a single problem, which is a strong starting point for a balanced care plan. ";
    }

    if (type.includes("coily") || type.includes("kinky") || type.includes("curly")) {
      care +=
        "Keep hydration high with deep conditioning, gentle section‑by‑section detangling, and limited direct heat to preserve your curl pattern. ";
    } else if (type.includes("wavy")) {
      care +=
        "Use lighter products so waves stay defined without feeling coated or weighed down. ";
    } else if (type.includes("straight")) {
      care +=
        "Choose lightweight, buildup‑free formulas so the scalp can breathe and roots stay lifted. ";
    }

    if (!care) {
      care =
        "Start with consistent cleansing, conditioning, and moisture, then adjust based on how your scalp and ends respond over several weeks. ";
    }

    if (goals) {
      nextSteps +=
        `Your stated goals (“${goals}”) will shape the specific plan created during your 4Infinity session. `;
    }

    // 4–12 week recommendation
    nextSteps +=
      "Plan to continue guided consultations every 4–12 weeks so your care plan can be adjusted as your scalp and hair respond over time. ";

    // Simple hairstyle suggestion (same idea as front‑end)
    if (type.includes("coily") || type.includes("kinky")) {
      hairstyle =
        "Consider soft, low‑tension styles like chunky twists, flexi‑rod sets, or a loose halo braid that keeps edges free and protected.";
    } else if (type.includes("curly")) {
      hairstyle =
        "A wash‑and‑go with curl clumping or a stretched set (flexi‑rods, banding) can define curls while limiting daily manipulation.";
    } else if (type.includes("wavy")) {
      hairstyle =
        "Soft beach waves created with braids or large rollers (instead of high heat) will flatter your natural pattern without heavy buildup.";
    } else if (type.includes("straight")) {
      hairstyle =
        "A collarbone‑length blunt cut or sleek low‑tension wrap style can keep things polished while protecting your lengths.";
    } else {
      hairstyle =
        "Choose a simple, low‑tension style you can maintain easily—like a loose bun, soft twists, or a polished ponytail—until your specialist gives more tailored ideas.";
    }

    // DEMO numeric scores (you can refine later)
    const scores = {
      cuticle: 0.7,
      shaft: concern.includes("breakage") ? 0.5 : 0.7,
      scalp: concern.includes("flakes") || concern.includes("itch") ? 0.5 : 0.7,
    };

    const growthCycle = { anagen: 0.8, catagen: 0.02, telogen: 0.18 };
    const lossProfile = {
      shedding: concern.includes("shedding") ? 0.7 : 0.5,
      breakage: concern.includes("breakage") ? 0.7 : 0.3,
    };

    res.json({
      clientName,
      clientEmail,
      assessment_insights: insights,
      care_priorities: care,
      next_steps: nextSteps,
      hairstyle,
      scores,
      growth_cycle: growthCycle,
      loss_profile: lossProfile,
    });
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("4Infinity Care Plan API listening on port " + port);
});
