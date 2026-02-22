import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class TutorService {
  private buildSystemPrompt(emotion?: string): string {
    const basePrompt = `Eres un tutor educativo de IA llamado NeuroTeach. Tu objetivo es ayudar a los estudiantes a aprender de forma efectiva y personalizada.
Reglas:
- Responde en español.
- Usa explicaciones claras y ejemplos prácticos.
- Si el estudiante tiene dudas, desglosa el concepto paso a paso.
- Cuando incluyas código, usa bloques de código con el lenguaje adecuado.
- Sé amable, paciente y motivador.`;

    if (!emotion || emotion === 'neutral') {
      return basePrompt;
    }

    const emotionInstructions: Record<string, string> = {
      feliz: 'El estudiante está feliz y motivado. Aprovecha su energía positiva para profundizar en temas complejos y proponer retos.',
      frustrado: 'El estudiante está frustrado. Simplifica tus explicaciones, sé especialmente paciente, y desglosa todo en pasos muy pequeños. Ofrece ánimo.',
      aburrido: 'El estudiante está aburrido. Haz la explicación más dinámica, usa analogías interesantes, propón ejercicios interactivos y datos curiosos.',
      confundido: 'El estudiante está confundido. Vuelve a lo básico, usa analogías simples, y pregunta qué parte específica no entiende.',
      triste: 'El estudiante parece triste. Sé especialmente cálido y empático. Resalta sus logros y progreso.',
      enojado: 'El estudiante está molesto. Mantén la calma, valida sus sentimientos, y ofrece un enfoque práctico y directo.',
      asustado: 'El estudiante parece ansioso. Tranquilízalo, recuérdale que es normal no saber todo, y ve paso a paso.',
    };

    const instruction = emotionInstructions[emotion.toLowerCase()] || 
      `El estudiante parece estar sintiendo: ${emotion}. Adapta tu tono y enfoque acorde.`;

    return `${basePrompt}\n\nEstado emocional detectado: ${emotion}.\n${instruction}`;
  }

  async askTutor(prompt: string, emotion?: string, messageHistory?: ChatMessage[]): Promise<any> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('OpenRouter API key not set');
    }

    const systemPrompt = this.buildSystemPrompt(emotion);
    
    // Build messages array with history for conversational context
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add previous conversation history (limit to last 20 messages to avoid token overflow)
    if (messageHistory && messageHistory.length > 0) {
      const recentHistory = messageHistory.slice(-20);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'NeuroTeach-Tutor',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Error al consultar OpenRouter: ' + error.message);
    }
  }
}