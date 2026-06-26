import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Placeholder: In production, send to OpenAI Whisper
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const transcription = await openai.audio.transcriptions.create({
    //   file: audioFile,
    //   model: 'whisper-1',
    // });

    // Mock transcription for development
    const mockTranscription = 'Criar tarefa: reunião com equipe amanhã às 10h';

    return NextResponse.json({
      text: mockTranscription,
      tasks: [
        { title: 'Reunião com equipe', dueDate: 'Amanhã 10:00' },
      ],
    });
  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}
