import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios de ejemplo
  const hashedPassword = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@neuroteach.com',
      password: hashedPassword,
      role: 'admin',
      totalPoints: 1000,
      level: 5,
      currentStreak: 10,
      longestStreak: 15,
      lastSessionDate: new Date(),
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Estudiante Demo',
      email: 'estudiante@neuroteach.com',
      password: hashedPassword,
      role: 'user',
      totalPoints: 250,
      level: 2,
      currentStreak: 3,
      longestStreak: 7,
      lastSessionDate: new Date(),
    },
  });

  // Crear historial de ejemplo para el estudiante
  const sampleHistory = [
    {
      userId: studentUser.id,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      topic: 'Matemáticas',
      emotion: 'concentrado',
      score: 85,
      duration: 45,
      difficulty: 'medium',
      pointsEarned: 25,
    },
    {
      userId: studentUser.id,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      topic: 'Ciencias',
      emotion: 'feliz',
      score: 92,
      duration: 30,
      difficulty: 'easy',
      pointsEarned: 30,
    },
    {
      userId: studentUser.id,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      topic: 'Historia',
      emotion: 'motivado',
      score: 78,
      duration: 60,
      difficulty: 'hard',
      pointsEarned: 35,
    },
    {
      userId: studentUser.id,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      topic: 'Lenguaje',
      emotion: 'concentrado',
      score: 88,
      duration: 40,
      difficulty: 'medium',
      pointsEarned: 28,
    },
  ];

  await prisma.history.createMany({
    data: sampleHistory,
  });

  console.log('✅ Seed completado exitosamente!');
  console.log(`👤 Usuario administrador creado: ${adminUser.email}`);
  console.log(`👤 Usuario estudiante creado: ${studentUser.email}`);
  console.log(`📚 ${sampleHistory.length} registros de historial creados`);
  console.log('🔑 Contraseña para ambos usuarios: 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });