import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Đọc file system cấu hình cho Panet
  app.get("/api/system-config", async (req, res) => {
    try {
      const configPath = path.join(process.cwd(), "panet_system.txt");
      const content = await fs.readFile(configPath, "utf-8");
      res.json({ systemPrompt: content });
    } catch (error) {
      res.status(500).json({ error: "Không thể đọc file panet_system.txt" });
    }
  });

  // API Lưu file system cấu hình cho Panet
  app.post("/api/save-system-config", express.json(), async (req, res) => {
    try {
      const { systemPrompt } = req.body;
      if (!systemPrompt) return res.status(400).json({ error: "Nội dung trống" });
      
      const configPath = path.join(process.cwd(), "panet_system.txt");
      await fs.writeFile(configPath, systemPrompt, "utf-8");
      res.json({ success: true, message: "Đã cập nhật file panet_system.txt" });
    } catch (error) {
      res.status(500).json({ error: "Không thể ghi vào file panet_system.txt" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Panet đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
