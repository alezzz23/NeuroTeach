"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');
    const mathCourse = await prisma.course.create({
        data: {
            title: 'Matemáticas Básicas',
            description: 'Aprende los fundamentos de las matemáticas con ejercicios interactivos y explicaciones claras.',
            category: 'mathematics',
            difficulty: 'beginner',
            estimatedHours: 8,
            imageUrl: '/images/math-course.svg',
            order: 1,
        },
    });
    const scienceCourse = await prisma.course.create({
        data: {
            title: 'Ciencias Naturales',
            description: 'Explora el mundo natural a través de experimentos y conceptos científicos fundamentales.',
            category: 'science',
            difficulty: 'beginner',
            estimatedHours: 6,
            imageUrl: '/images/science-course.svg',
            order: 2,
        },
    });
    const languageCourse = await prisma.course.create({
        data: {
            title: 'Comprensión Lectora',
            description: 'Mejora tus habilidades de lectura y comprensión de textos con ejercicios prácticos.',
            category: 'language',
            difficulty: 'intermediate',
            estimatedHours: 5,
            imageUrl: '/images/language-course.svg',
            order: 3,
        },
    });
    const historyCourse = await prisma.course.create({
        data: {
            title: 'Historia Universal',
            description: 'Descubre los eventos más importantes de la historia humana y aprende sobre civilizaciones antiguas.',
            category: 'history',
            difficulty: 'intermediate',
            estimatedHours: 7,
            imageUrl: '/images/history-course.svg',
            order: 4,
        },
    });
    const artCourse = await prisma.course.create({
        data: {
            title: 'Arte y Creatividad',
            description: 'Explora el mundo del arte, desde técnicas básicas hasta grandes maestros de la pintura.',
            category: 'art',
            difficulty: 'beginner',
            estimatedHours: 6,
            imageUrl: '/images/art-course.svg',
            order: 5,
        },
    });
    const musicCourse = await prisma.course.create({
        data: {
            title: 'Música y Ritmo',
            description: 'Aprende sobre instrumentos musicales, teoría musical y grandes compositores.',
            category: 'music',
            difficulty: 'beginner',
            estimatedHours: 5,
            imageUrl: '/images/music-course.svg',
            order: 6,
        },
    });
    const geographyCourse = await prisma.course.create({
        data: {
            title: 'Geografía Mundial',
            description: 'Descubre países, continentes, océanos y las maravillas naturales del mundo.',
            category: 'geography',
            difficulty: 'intermediate',
            estimatedHours: 8,
            imageUrl: '/images/geography-course.svg',
            order: 7,
        },
    });
    const programmingCourse = await prisma.course.create({
        data: {
            title: 'Programación para Niños',
            description: 'Introducción a la programación con JavaScript de manera divertida y práctica.',
            category: 'programming',
            difficulty: 'intermediate',
            estimatedHours: 12,
            imageUrl: '/images/programming-course.svg',
            order: 8,
        },
    });
    const englishCourse = await prisma.course.create({
        data: {
            title: 'Inglés Básico',
            description: 'Aprende inglés desde cero con vocabulario, gramática y conversación básica.',
            category: 'english',
            difficulty: 'beginner',
            estimatedHours: 10,
            imageUrl: '/images/english-course.svg',
            order: 9,
        },
    });
    const advancedMathCourse = await prisma.course.create({
        data: {
            title: 'Matemáticas Avanzadas',
            description: 'Domina conceptos avanzados de matemáticas incluyendo cálculo, álgebra lineal y estadística.',
            category: 'mathematics',
            difficulty: 'advanced',
            estimatedHours: 15,
            imageUrl: '/images/advanced-math-course.svg',
            order: 10,
        },
    });
    const quantumPhysicsCourse = await prisma.course.create({
        data: {
            title: 'Física Cuántica',
            description: 'Explora los misterios del mundo cuántico y las leyes fundamentales de la física moderna.',
            category: 'physics',
            difficulty: 'advanced',
            estimatedHours: 20,
            imageUrl: '/images/quantum-physics-course.svg',
            order: 11,
        },
    });
    const pythonProgrammingCourse = await prisma.course.create({
        data: {
            title: 'Programación en Python',
            description: 'Aprende Python desde cero hasta nivel avanzado con proyectos prácticos y aplicaciones reales.',
            category: 'programming',
            difficulty: 'intermediate',
            estimatedHours: 25,
            imageUrl: '/images/python-course.svg',
            order: 12,
        },
    });
    const artHistoryCourse = await prisma.course.create({
        data: {
            title: 'Historia del Arte',
            description: 'Descubre la evolución del arte a través de los siglos, desde el arte clásico hasta el contemporáneo.',
            category: 'art',
            difficulty: 'intermediate',
            estimatedHours: 12,
            imageUrl: '/images/art-history-course.svg',
            order: 13,
        },
    });
    const molecularBiologyCourse = await prisma.course.create({
        data: {
            title: 'Biología Molecular',
            description: 'Estudia la estructura y función de las moléculas biológicas y los procesos celulares fundamentales.',
            category: 'biology',
            difficulty: 'advanced',
            estimatedHours: 18,
            imageUrl: '/images/molecular-biology-course.svg',
            order: 14,
        },
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Introducción a los Números',
                content: `# Introducción a los Números

## ¿Qué son los números?

Los números son símbolos que utilizamos para contar, medir y ordenar. Son la base de todas las matemáticas.

### Tipos de números básicos:

1. **Números naturales**: 1, 2, 3, 4, 5...
2. **Números enteros**: ..., -2, -1, 0, 1, 2...
3. **Números decimales**: 1.5, 2.75, 3.14...

### Actividad práctica:

Cuenta los objetos que ves a tu alrededor y escribe el número correspondiente.

¡Recuerda que los números están en todas partes!`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 15,
                order: 1,
                pointsReward: 10,
                courseId: mathCourse.id,
            },
            {
                title: 'Suma y Resta Básica',
                content: `# Suma y Resta Básica

## La Suma (+)

La suma es juntar cantidades. Cuando sumamos, obtenemos un resultado mayor.

**Ejemplo**: 3 + 2 = 5

## La Resta (-)

La resta es quitar cantidades. Cuando restamos, obtenemos un resultado menor.

**Ejemplo**: 5 - 2 = 3

### Ejercicios:

1. 4 + 3 = ?
2. 8 - 5 = ?
3. 6 + 4 = ?
4. 9 - 3 = ?

### Consejo:
Puedes usar tus dedos para contar y verificar tus respuestas.`,
                type: 'exercise',
                difficulty: 'easy',
                estimatedMinutes: 20,
                order: 2,
                pointsReward: 15,
                courseId: mathCourse.id,
            },
            {
                title: 'Multiplicación Básica',
                content: `# Multiplicación Básica

## ¿Qué es multiplicar?

Multiplicar es sumar un número varias veces de forma rápida.

**Ejemplo**: 3 × 4 = 3 + 3 + 3 + 3 = 12

### Tablas de multiplicar básicas:

**Tabla del 2:**
- 2 × 1 = 2
- 2 × 2 = 4
- 2 × 3 = 6
- 2 × 4 = 8
- 2 × 5 = 10

**Tabla del 5:**
- 5 × 1 = 5
- 5 × 2 = 10
- 5 × 3 = 15
- 5 × 4 = 20
- 5 × 5 = 25

### Ejercicios:
1. 3 × 2 = ?
2. 4 × 5 = ?
3. 2 × 6 = ?`,
                type: 'exercise',
                difficulty: 'medium',
                estimatedMinutes: 25,
                order: 3,
                pointsReward: 20,
                courseId: mathCourse.id,
            },
            {
                title: 'Ejercicio Interactivo: Tablas de Multiplicar',
                content: `# Ejercicio Interactivo: Tablas de Multiplicar

Pon a prueba tus conocimientos sobre las tablas de multiplicar con este ejercicio interactivo.`,
                type: 'interactive',
                difficulty: 'medium',
                estimatedMinutes: 15,
                order: 4,
                pointsReward: 25,
                courseId: mathCourse.id,
                interactiveContent: {
                    type: 'multiple_choice',
                    exercise: {
                        question: '¿Cuál es el resultado de 7 × 8?',
                        description: 'Selecciona la respuesta correcta para esta multiplicación.',
                        options: ['54', '56', '58', '64'],
                        correctAnswer: 1,
                        correctFeedback: '¡Excelente! 7 × 8 = 56. Has dominado esta tabla de multiplicar.',
                        incorrectFeedback: 'Recuerda que 7 × 8 significa sumar 7 ocho veces: 7+7+7+7+7+7+7+7 = 56'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'El Sistema Solar',
                content: `# El Sistema Solar

## ¿Qué es el Sistema Solar?

El Sistema Solar es nuestro hogar en el espacio. Está formado por el Sol y todos los objetos que giran a su alrededor.

### Los planetas:

1. **Mercurio** - El más cercano al Sol
2. **Venus** - El más caliente
3. **Tierra** - Nuestro hogar
4. **Marte** - El planeta rojo
5. **Júpiter** - El más grande
6. **Saturno** - Tiene anillos hermosos
7. **Urano** - Gira de lado
8. **Neptuno** - El más lejano

### Datos curiosos:
- El Sol es una estrella
- La Tierra es el único planeta conocido con vida
- Un día en Venus dura más que un año en Venus`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 20,
                order: 1,
                pointsReward: 10,
                courseId: scienceCourse.id,
            },
            {
                title: 'Estados de la Materia',
                content: `# Estados de la Materia

## Los tres estados principales:

### 1. Sólido
- Las partículas están muy juntas
- Mantiene su forma
- Ejemplos: hielo, piedra, madera

### 2. Líquido
- Las partículas están menos juntas
- Toma la forma del recipiente
- Ejemplos: agua, aceite, leche

### 3. Gaseoso
- Las partículas están muy separadas
- Se expande para llenar todo el espacio
- Ejemplos: aire, vapor de agua, oxígeno

### Cambios de estado:
- **Fusión**: sólido → líquido (derretir)
- **Solidificación**: líquido → sólido (congelar)
- **Evaporación**: líquido → gas
- **Condensación**: gas → líquido

### Experimento:
¿Qué pasa cuando pones hielo al sol?`,
                type: 'theory',
                difficulty: 'medium',
                estimatedMinutes: 18,
                order: 2,
                pointsReward: 15,
                courseId: scienceCourse.id,
            },
            {
                title: 'Ejercicio: Completa sobre Estados de la Materia',
                content: `# Ejercicio: Completa sobre Estados de la Materia

Completa las oraciones sobre los estados de la materia.`,
                type: 'interactive',
                difficulty: 'medium',
                estimatedMinutes: 12,
                order: 3,
                pointsReward: 20,
                courseId: scienceCourse.id,
                interactiveContent: {
                    type: 'fill_blanks',
                    exercise: {
                        title: 'Estados de la Materia',
                        instructions: 'Completa las siguientes oraciones con las palabras correctas.',
                        text: 'El agua en estado {{blank}} se llama hielo. Cuando el hielo se {{blank}}, se convierte en agua líquida. El vapor de agua es el estado {{blank}} del agua. Las partículas en un {{blank}} están muy juntas y no se mueven mucho.',
                        blanks: [
                            { acceptedAnswers: ['sólido', 'solido'] },
                            { acceptedAnswers: ['derrite', 'funde', 'calienta'] },
                            { acceptedAnswers: ['gaseoso', 'gas'] },
                            { acceptedAnswers: ['sólido', 'solido'] }
                        ],
                        hints: [
                            'Piensa en cómo está el agua cuando está congelada',
                            '¿Qué pasa cuando calientas el hielo?',
                            'El vapor es un tipo de...',
                            'En este estado, las cosas mantienen su forma'
                        ],
                        feedback: '¡Excelente! Has comprendido bien los estados de la materia y sus cambios.'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Técnicas de Lectura',
                content: `# Técnicas de Lectura

## ¿Cómo leer mejor?

Leer bien es una habilidad que se puede mejorar con práctica y técnicas adecuadas.

### Técnicas básicas:

1. **Lectura silenciosa**: Lee con los ojos, no con la voz
2. **Concentración**: Busca un lugar tranquilo
3. **Velocidad adecuada**: No muy rápido, no muy lento
4. **Pausas**: Descansa cuando sea necesario

### Antes de leer:
- Observa el título
- Mira las imágenes
- Piensa en lo que ya sabes del tema

### Durante la lectura:
- Subraya palabras importantes
- Haz preguntas mentalmente
- Imagina lo que lees

### Después de leer:
- Resume lo que leíste
- Reflexiona sobre el mensaje
- Conecta con tu experiencia`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 15,
                order: 1,
                pointsReward: 10,
                courseId: languageCourse.id,
            },
            {
                title: 'Comprensión de Textos',
                content: `# Comprensión de Textos

## Lee el siguiente texto:

**El Jardín de María**

María tenía un pequeño jardín detrás de su casa. Cada mañana, antes de ir a la escuela, regaba sus plantas favoritas: rosas rojas, girasoles amarillos y violetas moradas. Un día, notó que las hojas de sus rosas estaban amarillas. Su abuela le explicó que las plantas necesitan no solo agua, sino también tierra rica en nutrientes. María decidió agregar abono natural a su jardín. Después de una semana, sus rosas volvieron a estar verdes y hermosas.

## Preguntas de comprensión:

1. ¿Qué hacía María cada mañana?
2. ¿Qué tipos de flores tenía en su jardín?
3. ¿Cuál era el problema con las rosas?
4. ¿Quién le ayudó a María?
5. ¿Cómo solucionó María el problema?
6. ¿Qué aprendió María sobre el cuidado de las plantas?

## Reflexión:
¿Has cuidado alguna vez una planta? ¿Qué crees que necesitan las plantas para crecer sanas?`,
                type: 'exercise',
                difficulty: 'medium',
                estimatedMinutes: 25,
                order: 2,
                pointsReward: 20,
                courseId: languageCourse.id,
            },
            {
                title: 'Ejercicio de Programación: Contador de Palabras',
                content: `# Ejercicio de Programación: Contador de Palabras

Crea una función que cuente las palabras en un texto.`,
                type: 'interactive',
                difficulty: 'advanced',
                estimatedMinutes: 30,
                order: 3,
                pointsReward: 30,
                courseId: languageCourse.id,
                interactiveContent: {
                    type: 'code',
                    exercise: {
                        title: 'Contador de Palabras',
                        description: 'Escribe una función llamada "contarPalabras" que reciba un texto como parámetro y devuelva el número de palabras que contiene. Las palabras están separadas por espacios.',
                        language: 'JavaScript',
                        difficulty: 'intermediate',
                        starterCode: 'function contarPalabras(texto) {\n  // Escribe tu código aquí\n  \n}',
                        solution: 'function contarPalabras(texto) {\n  if (!texto || texto.trim() === "") {\n    return 0;\n  }\n  return texto.trim().split(/\\s+/).length;\n}',
                        testCases: [
                            {
                                description: 'Texto simple con 3 palabras',
                                input: ['Hola mundo programación'],
                                expected: 3
                            },
                            {
                                description: 'Texto vacío',
                                input: [''],
                                expected: 0
                            },
                            {
                                description: 'Texto con espacios múltiples',
                                input: ['  Hola    mundo   '],
                                expected: 2
                            },
                            {
                                description: 'Una sola palabra',
                                input: ['JavaScript'],
                                expected: 1
                            }
                        ],
                        examples: [
                            {
                                input: ['Hola mundo'],
                                output: 2
                            },
                            {
                                input: [''],
                                output: 0
                            }
                        ],
                        maxLength: 200
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Las Civilizaciones Antiguas',
                content: `# Las Civilizaciones Antiguas

## ¿Qué es una civilización?

Una civilización es un grupo de personas que viven juntas de manera organizada, con ciudades, leyes, escritura y cultura.

### Las primeras civilizaciones:

#### 1. Mesopotamia (3500 a.C.)
- Ubicada entre los ríos Tigris y Éufrates
- Inventaron la escritura cuneiforme
- Construyeron las primeras ciudades

#### 2. Antiguo Egipto (3100 a.C.)
- Ubicada junto al río Nilo
- Construyeron las pirámides
- Desarrollaron la momificación

#### 3. Civilización del Valle del Indo (2600 a.C.)
- Tenían sistemas de drenaje avanzados
- Ciudades muy bien planificadas
- Comerciaban con otras civilizaciones

#### 4. Antigua China (2070 a.C.)
- Inventaron el papel y la pólvora
- Construyeron la Gran Muralla
- Desarrollaron la filosofía

### Características comunes:
- Agricultura organizada
- Gobierno centralizado
- Escritura y registros
- Especialización del trabajo
- Arte y arquitectura`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 25,
                order: 1,
                pointsReward: 10,
                courseId: historyCourse.id,
            },
            {
                title: 'Los Dinosaurios',
                content: `# Los Dinosaurios

## ¿Qué eran los dinosaurios?

Los dinosaurios fueron reptiles que vivieron en la Tierra hace millones de años. Había muchos tipos diferentes:

### Tipos de dinosaurios:

#### Carnívoros (comían carne):
- **Tyrannosaurus Rex**: El "rey de los lagartos tiranos"
- **Velociraptor**: Pequeño pero muy inteligente
- **Allosaurus**: Cazador feroz del período Jurásico

#### Herbívoros (comían plantas):
- **Triceratops**: Tenía tres cuernos en la cabeza
- **Brontosaurus**: Cuello muy largo para alcanzar hojas altas
- **Stegosaurus**: Placas en la espalda para protegerse

### ¿Por qué se extinguieron?
Los científicos creen que un gran meteorito chocó con la Tierra hace 65 millones de años, cambiando el clima y haciendo que los dinosaurios no pudieran sobrevivir.

### Datos curiosos:
- Algunos dinosaurios eran del tamaño de un pollo
- Otros eran tan grandes como tres autobuses juntos
- Los pájaros de hoy son descendientes de los dinosaurios`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 20,
                order: 2,
                pointsReward: 15,
                courseId: historyCourse.id,
            },
            {
                title: 'Quiz: ¿Qué sabes sobre Dinosaurios?',
                content: `# Quiz: ¿Qué sabes sobre Dinosaurios?

Pon a prueba tus conocimientos sobre estos fascinantes reptiles prehistóricos.`,
                type: 'interactive',
                difficulty: 'easy',
                estimatedMinutes: 15,
                order: 3,
                pointsReward: 25,
                courseId: historyCourse.id,
                interactiveContent: {
                    type: 'multiple_choice',
                    exercise: {
                        title: 'Conocimientos sobre Dinosaurios',
                        description: 'Responde las siguientes preguntas sobre los dinosaurios.',
                        questions: [
                            {
                                question: '¿Cuál de estos dinosaurios era carnívoro?',
                                options: ['Triceratops', 'Tyrannosaurus Rex', 'Brontosaurus', 'Stegosaurus'],
                                correctAnswer: 1,
                                explanation: 'El Tyrannosaurus Rex era un gran depredador carnívoro, conocido como el "rey de los lagartos tiranos".'
                            },
                            {
                                question: '¿Hace cuántos años se extinguieron los dinosaurios?',
                                options: ['65 millones de años', '100 millones de años', '30 millones de años', '200 millones de años'],
                                correctAnswer: 0,
                                explanation: 'Los dinosaurios se extinguieron hace aproximadamente 65 millones de años, probablemente debido al impacto de un meteorito.'
                            },
                            {
                                question: '¿Qué característica tenía el Triceratops?',
                                options: ['Cuello muy largo', 'Tres cuernos en la cabeza', 'Placas en la espalda', 'Dientes muy afilados'],
                                correctAnswer: 1,
                                explanation: 'El Triceratops tenía tres cuernos distintivos en su cabeza, que usaba para defenderse.'
                            }
                        ],
                        passingScore: 70,
                        feedback: '¡Excelente! Has demostrado buenos conocimientos sobre los dinosaurios.'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Colores Primarios y Secundarios',
                content: `# Colores Primarios y Secundarios

## ¿Qué son los colores primarios?

Los colores primarios son los colores básicos que no se pueden crear mezclando otros colores:

### Colores Primarios:
- **Rojo** 🔴
- **Azul** 🔵  
- **Amarillo** 🟡

### Colores Secundarios:
Se crean mezclando dos colores primarios:
- **Verde** = Azul + Amarillo 🟢
- **Naranja** = Rojo + Amarillo 🟠
- **Morado** = Rojo + Azul 🟣

### El Círculo Cromático:
Es una herramienta que nos ayuda a entender cómo se relacionan los colores entre sí.

### Colores Cálidos y Fríos:
- **Cálidos**: Rojo, naranja, amarillo (nos recuerdan al sol y al fuego)
- **Fríos**: Azul, verde, morado (nos recuerdan al agua y al hielo)`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 15,
                order: 1,
                pointsReward: 10,
                courseId: artCourse.id,
            },
            {
                title: 'Quiz: Mezcla de Colores',
                content: `# Quiz: Mezcla de Colores

Pon a prueba tus conocimientos sobre la mezcla de colores.`,
                type: 'interactive',
                difficulty: 'easy',
                estimatedMinutes: 10,
                order: 2,
                pointsReward: 20,
                courseId: artCourse.id,
                interactiveContent: {
                    type: 'multiple_choice',
                    exercise: {
                        title: 'Mezcla de Colores',
                        description: 'Responde correctamente sobre la mezcla de colores.',
                        questions: [
                            {
                                question: '¿Qué color obtienes al mezclar rojo y amarillo?',
                                options: ['Verde', 'Naranja', 'Morado', 'Rosa'],
                                correctAnswer: 1,
                                explanation: 'Rojo + Amarillo = Naranja. Es uno de los colores secundarios básicos.'
                            },
                            {
                                question: '¿Cuáles son los tres colores primarios?',
                                options: ['Rojo, Verde, Azul', 'Rojo, Azul, Amarillo', 'Azul, Verde, Amarillo', 'Rojo, Naranja, Azul'],
                                correctAnswer: 1,
                                explanation: 'Los colores primarios son Rojo, Azul y Amarillo. No se pueden crear mezclando otros colores.'
                            },
                            {
                                question: '¿Qué tipo de colores son el rojo y el naranja?',
                                options: ['Colores fríos', 'Colores cálidos', 'Colores neutros', 'Colores oscuros'],
                                correctAnswer: 1,
                                explanation: 'El rojo y el naranja son colores cálidos porque nos recuerdan al sol y al fuego.'
                            }
                        ],
                        passingScore: 70,
                        feedback: '¡Excelente! Tienes buen conocimiento sobre los colores.'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Notas Musicales y Pentagrama',
                content: `# Notas Musicales y Pentagrama

## Las 7 Notas Musicales

Las notas musicales son los sonidos básicos de la música:

### Notas en orden:
1. **Do** (C) 🎵
2. **Re** (D) 🎵
3. **Mi** (E) 🎵
4. **Fa** (F) 🎵
5. **Sol** (G) 🎵
6. **La** (A) 🎵
7. **Si** (B) 🎵

### El Pentagrama:
Es el conjunto de 5 líneas horizontales donde se escriben las notas musicales.

### Clave de Sol:
Es el símbolo que se coloca al inicio del pentagrama para indicar la altura de las notas.

### Figuras Musicales:
- **Redonda** ○ = 4 tiempos
- **Blanca** ♩ = 2 tiempos
- **Negra** ♪ = 1 tiempo
- **Corchea** ♫ = 1/2 tiempo

### Instrumentos Musicales:
- **Cuerda**: Guitarra, violín, piano
- **Viento**: Flauta, trompeta, saxofón
- **Percusión**: Tambor, maracas, xilófono`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 20,
                order: 1,
                pointsReward: 10,
                courseId: musicCourse.id,
            },
            {
                title: 'Quiz: Fundamentos Musicales',
                content: `# Quiz: Fundamentos Musicales

Demuestra tu conocimiento sobre música básica.`,
                type: 'interactive',
                difficulty: 'easy',
                estimatedMinutes: 10,
                order: 2,
                pointsReward: 20,
                courseId: musicCourse.id,
                interactiveContent: {
                    type: 'multiple_choice',
                    exercise: {
                        title: 'Fundamentos Musicales',
                        description: 'Responde sobre conceptos básicos de música.',
                        questions: [
                            {
                                question: '¿Cuántas líneas tiene un pentagrama?',
                                options: ['4 líneas', '5 líneas', '6 líneas', '7 líneas'],
                                correctAnswer: 1,
                                explanation: 'El pentagrama tiene exactamente 5 líneas horizontales donde se escriben las notas musicales.'
                            },
                            {
                                question: '¿Cuántos tiempos dura una figura redonda?',
                                options: ['1 tiempo', '2 tiempos', '3 tiempos', '4 tiempos'],
                                correctAnswer: 3,
                                explanation: 'La redonda es la figura musical de mayor duración y vale 4 tiempos.'
                            },
                            {
                                question: '¿Cuál de estos es un instrumento de percusión?',
                                options: ['Guitarra', 'Flauta', 'Tambor', 'Violín'],
                                correctAnswer: 2,
                                explanation: 'El tambor es un instrumento de percusión porque se toca golpeándolo.'
                            }
                        ],
                        passingScore: 70,
                        feedback: '¡Muy bien! Tienes buenos conocimientos musicales.'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Continentes y Océanos',
                content: `# Continentes y Océanos

## Los 7 Continentes

Nuestro planeta está dividido en grandes extensiones de tierra llamadas continentes:

### Continentes:
1. **Asia** 🌏 - El más grande
2. **África** 🌍 - Cuna de la humanidad
3. **América del Norte** 🌎 - Incluye Canadá, EE.UU. y México
4. **América del Sur** 🌎 - Incluye Brasil, Argentina, etc.
5. **Europa** 🌍 - Muchos países pequeños
6. **Oceanía** 🌏 - Australia y las islas del Pacífico
7. **Antártida** 🐧 - El continente helado

## Los 5 Océanos

Los océanos cubren la mayor parte de nuestro planeta:

### Océanos:
1. **Océano Pacífico** 🌊 - El más grande
2. **Océano Atlántico** 🌊 - Separa América de Europa/África
3. **Océano Índico** 🌊 - Entre África, Asia y Oceanía
4. **Océano Ártico** 🧊 - El más pequeño, en el Polo Norte
5. **Océano Antártico** 🐧 - Rodea la Antártida

### Datos Curiosos:
- El 71% de la Tierra está cubierta por agua
- Asia tiene más de 4 mil millones de habitantes
- La Antártida no tiene población permanente`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 15,
                order: 1,
                pointsReward: 10,
                courseId: geographyCourse.id,
            },
            {
                title: 'Ejercicio: Completa sobre Geografía',
                content: `# Ejercicio: Completa sobre Geografía

Completa las frases sobre continentes y océanos.`,
                type: 'interactive',
                difficulty: 'easy',
                estimatedMinutes: 10,
                order: 2,
                pointsReward: 20,
                courseId: geographyCourse.id,
                interactiveContent: {
                    type: 'fill_in_the_blanks',
                    exercise: {
                        title: 'Geografía Mundial',
                        description: 'Completa las frases sobre continentes y océanos.',
                        text: 'El continente más grande del mundo es ___. El océano que separa América de Europa se llama océano ___. El continente helado se llama ___. El océano más grande del mundo es el océano ___.',
                        blanks: [
                            { answer: 'Asia', position: 0 },
                            { answer: 'Atlántico', position: 1 },
                            { answer: 'Antártida', position: 2 },
                            { answer: 'Pacífico', position: 3 }
                        ],
                        passingScore: 75,
                        feedback: '¡Excelente conocimiento geográfico!'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Introducción a la Programación',
                content: `# Introducción a la Programación

## ¿Qué es la Programación?

La programación es el proceso de crear instrucciones para que una computadora realice tareas específicas.

### Conceptos Básicos:

#### Variables:
Son contenedores que almacenan datos:
\`\`\`javascript
let nombre = "Juan";
let edad = 10;
let esEstudiante = true;
\`\`\`

#### Tipos de Datos:
- **Números**: 5, 10, 3.14
- **Texto (String)**: "Hola mundo"
- **Booleanos**: true o false
- **Listas (Arrays)**: [1, 2, 3, 4]

#### Funciones:
Bloques de código que realizan una tarea específica:
\`\`\`javascript
function saludar(nombre) {
  return "¡Hola " + nombre + "!";
}
\`\`\`

#### Condicionales:
Permiten tomar decisiones en el código:
\`\`\`javascript
if (edad >= 18) {
  console.log("Eres mayor de edad");
} else {
  console.log("Eres menor de edad");
}
\`\`\`

#### Bucles:
Repiten código varias veces:
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log("Número: " + i);
}
\`\`\`

### Lenguajes de Programación Populares:
- **JavaScript**: Para páginas web
- **Python**: Fácil de aprender
- **Java**: Para aplicaciones grandes
- **C++**: Para videojuegos y sistemas`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 25,
                order: 1,
                pointsReward: 15,
                courseId: programmingCourse.id,
            },
            {
                title: 'Ejercicio: Mi Primera Función',
                content: `# Ejercicio: Mi Primera Función

Crea una función que calcule el área de un rectángulo.`,
                type: 'interactive',
                difficulty: 'easy',
                estimatedMinutes: 15,
                order: 2,
                pointsReward: 25,
                courseId: programmingCourse.id,
                interactiveContent: {
                    type: 'code_exercise',
                    exercise: {
                        title: 'Función para Calcular Área',
                        description: 'Crea una función llamada "calcularArea" que reciba dos parámetros (ancho y alto) y retorne el área del rectángulo.',
                        initialCode: 'function calcularArea(ancho, alto) {\n  // Escribe tu código aquí\n  \n}',
                        solution: 'function calcularArea(ancho, alto) {\n  return ancho * alto;\n}',
                        testCases: [
                            {
                                input: 'calcularArea(5, 3)',
                                expectedOutput: '15',
                                description: 'Área de rectángulo 5x3'
                            },
                            {
                                input: 'calcularArea(10, 2)',
                                expectedOutput: '20',
                                description: 'Área de rectángulo 10x2'
                            },
                            {
                                input: 'calcularArea(7, 4)',
                                expectedOutput: '28',
                                description: 'Área de rectángulo 7x4'
                            }
                        ],
                        hints: [
                            'El área de un rectángulo se calcula multiplicando ancho por alto',
                            'Usa la palabra clave "return" para devolver el resultado',
                            'La operación de multiplicación se hace con el símbolo *'
                        ],
                        passingScore: 80,
                        feedback: '¡Excelente! Has creado tu primera función correctamente.'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Basic Greetings and Introductions',
                content: `# Basic Greetings and Introductions

## Common Greetings

Learning how to greet people is essential in English:

### Formal Greetings:
- **Good morning** ☀️ (Before 12 PM)
- **Good afternoon** 🌤️ (12 PM - 6 PM)
- **Good evening** 🌆 (After 6 PM)
- **How do you do?** (Very formal)

### Informal Greetings:
- **Hi!** 👋
- **Hello!** 👋
- **Hey!** (Very casual)
- **What's up?** (Casual)

## Introducing Yourself

### Basic Introduction:
- **My name is...** / **I'm...**
- **Nice to meet you**
- **I'm from...**
- **I'm ... years old**

### Example Conversation:
**Person A**: "Hi! My name is Sarah. What's your name?"
**Person B**: "Hello Sarah! I'm Mike. Nice to meet you."
**Person A**: "Nice to meet you too, Mike!"

## Asking About Someone:
- **What's your name?**
- **Where are you from?**
- **How old are you?**
- **What do you do?** (asking about job/studies)

## Polite Expressions:
- **Please** 🙏
- **Thank you** / **Thanks** 🙏
- **You're welcome** 😊
- **Excuse me** (to get attention)
- **Sorry** / **I'm sorry** (to apologize)`,
                type: 'theory',
                difficulty: 'easy',
                estimatedMinutes: 20,
                order: 1,
                pointsReward: 10,
                courseId: englishCourse.id,
            },
            {
                title: 'Quiz: English Greetings',
                content: `# Quiz: English Greetings

Test your knowledge of basic English greetings and introductions.`,
                type: 'interactive',
                difficulty: 'easy',
                estimatedMinutes: 10,
                order: 2,
                pointsReward: 20,
                courseId: englishCourse.id,
                interactiveContent: {
                    type: 'multiple_choice',
                    exercise: {
                        title: 'English Greetings and Introductions',
                        description: 'Choose the correct answers about English greetings.',
                        questions: [
                            {
                                question: 'What is the appropriate greeting for 2 PM?',
                                options: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
                                correctAnswer: 1,
                                explanation: 'Good afternoon is used from 12 PM to 6 PM.'
                            },
                            {
                                question: 'Which is the most formal way to introduce yourself?',
                                options: ['Hey, I\'m John', 'Hi, my name is John', 'How do you do? I\'m John', 'What\'s up? I\'m John'],
                                correctAnswer: 2,
                                explanation: '"How do you do?" is the most formal greeting, often used in business settings.'
                            },
                            {
                                question: 'What is the polite response to "Thank you"?',
                                options: ['No problem', 'You\'re welcome', 'Sure', 'All of the above'],
                                correctAnswer: 3,
                                explanation: 'All of these are polite responses to "Thank you", with "You\'re welcome" being the most traditional.'
                            }
                        ],
                        passingScore: 70,
                        feedback: 'Great job! You understand English greetings well.'
                    }
                }
            },
        ],
    });
    await prisma.lesson.createMany({
        data: [
            {
                title: 'Introducción al Cálculo Diferencial',
                content: `# Introducción al Cálculo Diferencial

## ¿Qué es el Cálculo?

El cálculo es una rama de las matemáticas que estudia el cambio y el movimiento.

### Conceptos Fundamentales:

#### Límites:
El concepto de límite es fundamental en cálculo.

**Definición**: El límite de una función f(x) cuando x se acerca a un valor a.

#### Derivadas:
La derivada mide la tasa de cambio instantánea de una función.

**Notación**: f'(x) o df/dx

#### Aplicaciones:
- Velocidad e aceleración
- Optimización de funciones
- Análisis de gráficas

### Ejemplo básico:
Si f(x) = x², entonces f'(x) = 2x`,
                type: 'theory',
                difficulty: 'hard',
                estimatedMinutes: 30,
                order: 1,
                pointsReward: 25,
                courseId: advancedMathCourse.id,
            },
            {
                title: 'Principios de la Mecánica Cuántica',
                content: `# Principios de la Mecánica Cuántica

## ¿Qué es la Física Cuántica?

La física cuántica describe el comportamiento de la materia y la energía a escala atómica y subatómica.

### Principios Fundamentales:

#### Dualidad Onda-Partícula:
Las partículas pueden comportarse como ondas y viceversa.

#### Principio de Incertidumbre de Heisenberg:
No se puede conocer simultáneamente la posición y el momento de una partícula con precisión absoluta.

#### Superposición Cuántica:
Una partícula puede existir en múltiples estados simultáneamente hasta que se mide.

#### Entrelazamiento Cuántico:
Dos partículas pueden estar conectadas de tal manera que el estado de una afecta instantáneamente a la otra.

### Aplicaciones:
- Computación cuántica
- Criptografía cuántica
- Medicina nuclear
- Tecnología láser`,
                type: 'theory',
                difficulty: 'hard',
                estimatedMinutes: 35,
                order: 1,
                pointsReward: 30,
                courseId: quantumPhysicsCourse.id,
            },
            {
                title: 'Fundamentos de Python',
                content: `# Fundamentos de Python

## ¿Por qué Python?

Python es un lenguaje de programación versátil, fácil de aprender y muy poderoso.

### Características de Python:
- Sintaxis clara y legible
- Multiplataforma
- Gran comunidad y bibliotecas
- Ideal para principiantes

### Sintaxis Básica:

#### Variables:
\`\`\`python
nombre = "Juan"
edad = 25
estudiante = True
\`\`\`

#### Tipos de Datos:
- **int**: números enteros
- **float**: números decimales
- **str**: cadenas de texto
- **bool**: verdadero/falso
- **list**: listas
- **dict**: diccionarios

#### Estructuras de Control:
\`\`\`python
# Condicionales
if edad >= 18:
    print("Eres mayor de edad")
else:
    print("Eres menor de edad")

# Bucles
for i in range(5):
    print(f"Número: {i}")
\`\`\`

#### Funciones:
\`\`\`python
def saludar(nombre):
    return f"¡Hola {nombre}!"

resultado = saludar("María")
print(resultado)
\`\`\``,
                type: 'theory',
                difficulty: 'medium',
                estimatedMinutes: 25,
                order: 1,
                pointsReward: 20,
                courseId: pythonProgrammingCourse.id,
            },
            {
                title: 'Arte Clásico: Grecia y Roma',
                content: `# Arte Clásico: Grecia y Roma

## El Arte en la Antigüedad

El arte clásico de Grecia y Roma sentó las bases del arte occidental.

### Arte Griego:

#### Características:
- Búsqueda de la belleza ideal
- Proporción y armonía
- Representación realista del cuerpo humano

#### Períodos:
- **Arcaico** (700-480 a.C.)
- **Clásico** (480-323 a.C.)
- **Helenístico** (323-146 a.C.)

#### Obras Famosas:
- Partenón de Atenas
- Venus de Milo
- Discóbolo de Mirón

### Arte Romano:

#### Características:
- Influencia griega
- Realismo en retratos
- Monumentalidad
- Función práctica y decorativa

#### Obras Destacadas:
- Coliseo Romano
- Panteón de Roma
- Columna de Trajano
- Frescos de Pompeya

### Legado:
El arte clásico influyó en el Renacimiento y sigue siendo referencia en el arte contemporáneo.`,
                type: 'theory',
                difficulty: 'medium',
                estimatedMinutes: 28,
                order: 1,
                pointsReward: 22,
                courseId: artHistoryCourse.id,
            },
            {
                title: 'Estructura y Función del ADN',
                content: `# Estructura y Función del ADN

## ¿Qué es el ADN?

El ADN (Ácido Desoxirribonucleico) es la molécula que contiene la información genética de todos los seres vivos.

### Estructura del ADN:

#### Componentes:
- **Bases nitrogenadas**: Adenina (A), Timina (T), Guanina (G), Citosina (C)
- **Azúcar**: Desoxirribosa
- **Fosfato**: Grupo fosfato

#### Doble Hélice:
- Descubierta por Watson y Crick en 1953
- Dos cadenas antiparalelas
- Bases complementarias: A-T y G-C
- Unidas por puentes de hidrógeno

### Funciones del ADN:

#### Almacenamiento de Información:
- Contiene las instrucciones para fabricar proteínas
- Secuencia de bases determina la información genética

#### Replicación:
- El ADN se duplica antes de la división celular
- Proceso semiconservativo
- Enzimas como la ADN polimerasa

#### Transcripción:
- Síntesis de ARN a partir del ADN
- El ARN mensajero lleva la información al ribosoma

### Importancia:
- Base de la herencia
- Evolución de las especies
- Medicina personalizada
- Biotecnología`,
                type: 'theory',
                difficulty: 'hard',
                estimatedMinutes: 32,
                order: 1,
                pointsReward: 28,
                courseId: molecularBiologyCourse.id,
            },
        ],
    });
    console.log('✅ Seed completado exitosamente!');
    console.log(`📚 Cursos creados: ${[mathCourse, scienceCourse, languageCourse, historyCourse, artCourse, musicCourse, geographyCourse, programmingCourse, englishCourse, advancedMathCourse, quantumPhysicsCourse, pythonProgrammingCourse, artHistoryCourse, molecularBiologyCourse].length}`);
    console.log('📖 Lecciones creadas para cada curso');
}
main()
    .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map