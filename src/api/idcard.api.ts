import express from "express";
import path from "path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { getRobloxUserIdByUsername, getRobloxAvatarHeadshot } from "../services/roblox.service";

export const idCardRouter = express.Router();

function randomIdShort(): string {
  // ID corto tipo 6-7 dígitos
  return String(Math.floor(100000 + Math.random() * 900000));
}

idCardRouter.get("/idcard", async (req, res) => {
  try {
    const robloxUsername = String(req.query.robloxUsername || "").trim();
    const birth = String(req.query.birth || "").trim();
    const blood = String(req.query.blood || "").trim();

    if (!robloxUsername || !birth || !blood) {
      return res.status(400).json({
        error: "Faltan parámetros. Usa: robloxUsername, birth, blood"
      });
    }

    const userId = await getRobloxUserIdByUsername(robloxUsername);
    if (!userId) {
      return res.status(404).json({ error: "Roblox username no encontrado" });
    }

    const avatarUrl = await getRobloxAvatarHeadshot(userId);
    if (!avatarUrl) {
      return res.status(500).json({ error: "No se pudo obtener el avatar" });
    }

    // ✅ Load template + signature + avatar
    const templatePath = path.join(process.cwd(), "src/assets/template.png");
    const signaturePath = path.join(process.cwd(), "src/assets/signature.png");

    const [templateImg, signatureImg, avatarImg] = await Promise.all([
      loadImage(templatePath),
      loadImage(signaturePath),
      loadImage(avatarUrl)
    ]);

    const canvas = createCanvas(templateImg.width, templateImg.height);
    const ctx = canvas.getContext("2d");

    // dibuja plantilla
    ctx.drawImage(templateImg, 0, 0);

    // ✅ Avatar (ajusta coordenadas según tu template)
    // Ejemplo: cuadrado de foto
    const avatarX = 930;
    const avatarY = 310;
    const avatarW = 290;
    const avatarH = 290;
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarW, avatarH);

    // ✅ Textos
    const idNumber = randomIdShort();

    ctx.fillStyle = "#111";
    ctx.font = "bold 52px Arial";
    ctx.fillText("RECLUTA", 1320, 220);

    ctx.font = "bold 44px Arial";
    ctx.fillText("Ejército", 1320, 320);

    ctx.font = "40px Arial";
    ctx.fillText(idNumber, 1320, 420);

    ctx.fillText(birth, 1320, 520);
    ctx.fillText(blood.toUpperCase(), 1320, 620);

    ctx.font = "bold 44px Arial";
    ctx.fillText(robloxUsername, 980, 680);

    // ✅ Firma fija
    ctx.drawImage(signatureImg, 1180, 840, 360, 120);

    // ✅ Export PNG
    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    return res.send(buffer);
  } catch (err) {
    console.error("❌ Error generando ID card:", err);
    return res.status(500).json({ error: "Error interno generando carnet" });
  }
});
