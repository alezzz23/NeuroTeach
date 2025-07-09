import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TutorService {
  async askTutor(prompt: string, emotion: string): Promise<any> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('OpenRouter API key not set');
    }
    const systemPrompt = `Eres un tutor de IA. Explica el siguiente tema como si el usuario estuviera sintiendo: ${emotion}.`;
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
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