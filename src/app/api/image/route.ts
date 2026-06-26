import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_TASKS = ['Revisar anotações da imagem', 'Organizar lista de compras'];

function hasOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key !== 'placeholder' && key.startsWith('sk-'));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    // Without a real OpenAI key, return deterministic mock tasks so the flow works locally.
    if (!hasOpenAIKey()) {
      return NextResponse.json({ tasks: FALLBACK_TASKS, mock: true });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const dataUrl = `data:${image.type || 'image/png'};base64,${bytes.toString('base64')}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Extraia as tarefas acionáveis desta imagem. Responda apenas com um ' +
                  'array JSON de strings curtas em português, sem texto adicional.',
              },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Vision API error:', res.status, detail);
      return NextResponse.json({ error: 'Falha ao analisar a imagem' }, { status: 502 });
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? '[]';
    const tasks = parseTaskList(raw);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({ error: 'Falha ao processar a imagem' }, { status: 500 });
  }
}

function parseTaskList(raw: string): string[] {
  // The model may wrap the JSON in markdown fences — strip them before parsing.
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed.map((t) => String(t).trim()).filter(Boolean).slice(0, 20);
    }
  } catch {
    // Fall back to splitting lines if the model didn't return valid JSON.
  }
  return cleaned
    .split('\n')
    .map((l) => l.replace(/^[-*\d.\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 20);
}
