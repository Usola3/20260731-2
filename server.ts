import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini AI API Route for IEP Evaluation Recommendation
app.post('/api/gemini/iep-evaluation', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY가 설정되어 있지 않습니다. AI Studio 비밀번호/환경변수 설정을 확인해 주세요.',
      });
    }

    const { studentName, schoolName, iepGoal, area, logHistory, semester } = req.body;

    if (!studentName || !iepGoal) {
      return res.status(400).json({
        error: '학생 이름과 IEP 목표는 필수 입력 항목입니다.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Format log history into digestible text
    let logHistoryText = '누적된 일지 기록이 없습니다.';
    if (Array.isArray(logHistory) && logHistory.length > 0) {
      logHistoryText = logHistory
        .map(
          (log: any, index: number) =>
            `[기록 ${index + 1}] 일시: ${log.date || ''} (${log.time || ''}) / 교육영역: ${
              log.domain || area || ''
            }\n- 교육내용: ${log.content || '내용 없음'}\n- 특이사항/비고: ${log.remarks || '없음'}`
        )
        .join('\n\n');
    }

    const prompt = `너는 대한민국 특수교육 현장을 대단히 잘 이해하고 있는 최고 수준의 특수교사이자 IEP(개별화교육계획) 평가 전문가야.
특수교육 대상 학생의 기본 정보, 설정된 IEP 목표, 그리고 순회교사가 작성한 누적 순회교육일지를 바탕으로 생활기록부 및 IEP 평가란에 기재할 전문적이고 품격 있는 서술형 평가 문구를 작성해 줘.

[학생 및 목표 정보]
- 학생명: ${studentName} (${schoolName || '특수학급/원적교'})
- evaluation area / 영역: ${area || '통합영역'}
- 설정된 IEP 학기 목표: ${iepGoal}
- 학기/기간: ${semester || '2026학년도 1학기'}

[누적 순회교육일지 지도 기록 (총 ${Array.isArray(logHistory) ? logHistory.length : 0}건)]
${logHistoryText}

[작성 지침 - 엄격 준수]
1. 총 3~4문장의 깔끔하고 격식 있는 특수교육 표준 서술체(~함, ~임, ~를 나타냄)로 작성할 것.
2. 학생의 강점, 시도, 구체적인 수행 변화 및 성취 정도를 명확히 언급할 것.
3. 순회교육 일지 기록상의 구체적 활동과 IEP 목표와의 연계성을 부각할 것.
4. 향후 지속적인 교육 지원 및 원적학급/가정에서의 연계 지도 방향을 마지막 문장에 서술할 것.
5. 오직 3~4문장의 평가 문구 본문만 깔끔하게 출력할 것 (부연설명이나 인사말 금지).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const recommendation = response.text ? response.text.trim() : '';

    return res.json({
      success: true,
      recommendation,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error.message || 'Gemini AI 평가 문구 생성 중 오류가 발생했습니다.',
    });
  }
});

// CORS Proxy for Google Apps Script Web App (optional convenience endpoint)
app.post('/api/gas/proxy', async (req, res) => {
  try {
    const { gasUrl, payload } = req.body;
    if (!gasUrl) {
      return res.status(400).json({ error: 'GAS Web App URL이 지정되지 않았습니다.' });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'GAS 전송 중 오류가 발생했습니다.' });
  }
});

// Setup Vite Dev Middleware or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Special Ed Itinerant Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
