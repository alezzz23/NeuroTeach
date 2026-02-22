import { Body, Controller, Post, UseGuards, Get, Param, Req } from '@nestjs/common';
import { TutorService, ChatMessage } from './tutor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('tutor')
export class TutorController {
  constructor(
    private readonly tutorService: TutorService,
    private readonly prisma: PrismaService,
  ) { }

  @Post('ask')
  @UseGuards(JwtAuthGuard)
  async askTutor(
    @Body('prompt') prompt: string,
    @Body('emotion') emotion: string,
    @Body('messageHistory') messageHistory?: ChatMessage[],
    @Body('conversationId') conversationId?: number,
    @Req() req?: any,
  ): Promise<any> {
    const userId = req?.user?.userId;
    const result = await this.tutorService.askTutor(prompt, emotion, messageHistory);

    // Save conversation to database if user is authenticated
    if (userId && conversationId) {
      const assistantContent = result?.choices?.[0]?.message?.content || '';

      // Save user message
      await this.prisma.chatMessage.create({
        data: {
          conversationId,
          role: 'user',
          content: prompt,
        },
      });

      // Save assistant response
      await this.prisma.chatMessage.create({
        data: {
          conversationId,
          role: 'assistant',
          content: assistantContent,
        },
      });

      // Update conversation timestamp and emotion
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastEmotion: emotion || undefined,
          updatedAt: new Date(),
        },
      });
    }

    return result;
  }

  // Create a new conversation
  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  async createConversation(
    @Body('title') title: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.prisma.conversation.create({
      data: {
        userId,
        title: title || 'Nueva conversación',
      },
    });
  }

  // Get user's conversations
  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  async getConversations(@Req() req: any) {
    const userId = req.user.userId;
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Get messages for a conversation
  @Get('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getConversationMessages(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: Number(id), userId },
    });
    if (!conversation) {
      return { error: 'Conversación no encontrada' };
    }
    return this.prisma.chatMessage.findMany({
      where: { conversationId: Number(id) },
      orderBy: { createdAt: 'asc' },
    });
  }
}