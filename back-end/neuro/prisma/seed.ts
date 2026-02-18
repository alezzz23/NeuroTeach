import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios de ejemplo
  const hashedPassword = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@neuroteach.com' },
    create: {
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
    update: {
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'estudiante@neuroteach.com' },
    create: {
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
    update: {
      name: 'Estudiante Demo',
      password: hashedPassword,
      role: 'user',
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

  // Crear Track/Modules/Exercises de ejemplo para práctica/código
  const existingTrack = await prisma.track.findUnique({ where: { slug: 'algoritmos-basicos' }, select: { id: true } });
  if (existingTrack) {
    await prisma.enrollment.deleteMany({ where: { trackId: existingTrack.id } });
    const moduleIds = (await prisma.module.findMany({ where: { trackId: existingTrack.id }, select: { id: true } })).map((m) => m.id);
    const exerciseIds = moduleIds.length
      ? (await prisma.exercise.findMany({ where: { moduleId: { in: moduleIds } }, select: { id: true } })).map((e) => e.id)
      : [];
    if (exerciseIds.length) {
      await prisma.exerciseProgress.deleteMany({ where: { exerciseId: { in: exerciseIds } } });
      await prisma.exercise.deleteMany({ where: { id: { in: exerciseIds } } });
    }
    if (moduleIds.length) {
      await prisma.module.deleteMany({ where: { id: { in: moduleIds } } });
    }
    await prisma.track.delete({ where: { id: existingTrack.id } });
  }
  const track = await prisma.track.create({
    data: {
      slug: 'algoritmos-basicos',
      title: 'Algoritmos básicos',
      description: 'Practica fundamentos de programación con ejercicios guiados.',
      isPublished: true,
      order: 1,
      modules: {
        create: [
          {
            title: 'Fundamentos',
            description: 'Variables, funciones y lógica básica.',
            order: 1,
            exercises: {
              create: [
                {
                  slug: 'hola-mundo',
                  title: 'Hola Mundo',
                  description: 'Imprime el texto "Hola Mundo".',
                  type: 'algorithm',
                  language: 'python',
                  isPublished: true,
                  order: 1,
                  instructions: ['Usa print() para imprimir exactamente: Hola Mundo'],
                  starterCode: 'print("Hola Mundo")\n',
                  solutionCode: 'print("Hola Mundo")',
                  validation: {
                    kind: 'io',
                    normalization: { trim: true },
                    cases: [{ input: '', expectedOutput: 'Hola Mundo' }],
                  },
                  points: 10,
                },
                {
                  slug: 'suma-dos-numeros',
                  title: 'Suma de dos números',
                  description: 'Crea una función suma(a, b) que retorne a + b.',
                  type: 'algorithm',
                  language: 'python',
                  isPublished: true,
                  order: 2,
                  instructions: [
                    'Define una función suma(a, b)',
                    'Debe retornar a + b',
                  ],
                  starterCode:
                    'def suma(a, b):\n    # TODO\n    return 0\n\n# Entrada: dos enteros separados por espacio\na, b = map(int, input().split())\nprint(suma(a, b))\n',
                  solutionCode:
                    'def suma(a, b):\n    return a + b\n\n# Entrada: dos enteros separados por espacio\na, b = map(int, input().split())\nprint(suma(a, b))\n',
                  validation: {
                    kind: 'io',
                    normalization: { trim: true, ignoreWhitespace: true },
                    cases: [{ input: '2 3', expectedOutput: '5' }],
                  },
                  points: 15,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_trackId: { userId: studentUser.id, trackId: track.id } },
    create: { userId: studentUser.id, trackId: track.id },
    update: {},
  });

  console.log('✅ Seed completado exitosamente!');
  console.log(`👤 Usuario administrador creado: ${adminUser.email}`);
  console.log(`👤 Usuario estudiante creado: ${studentUser.email}`);
  console.log(`📚 ${sampleHistory.length} registros de historial creados`);
  console.log(`🧭 Track creado: ${track.slug}`);
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