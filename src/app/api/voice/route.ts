import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_TRANSCRIPTION = 'Reunião com a equipe amanhã às 10h';

function hasOpenAIKey() {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key !== 'placeholder' && key.startsWith('sk-'));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!(audioFile instanceof File)) {
      return NextResponse.json({ error: 'Nenhum áudio enviado' }, { status: 400 });
    }

    // Without a real OpenAI key, return a deterministic mock so the flow works locally.
    if (!hasOpenAIKey()) {
      return NextResponse.json({ text: FALLBACK_TRANSCRIPTION, mock: true });
    }

    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, audioFile.name || 'audio.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', 'pt');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: whisperForm,
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Whisper API error:', res.status, detail);
      return NextResponse.json({ error: 'Falha na transcrição' }, { status: 502 });
    }

    const data = (await res.json()) as { text?: string };
    return NextResponse.json({ text: data.text ?? '' });
  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json({ error: 'Falha ao processar o áudio' }, { status: 500 });
  }
}
