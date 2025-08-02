import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface VirtualLab {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  technologies: string[];
  objectives: string[];
  status: 'available' | 'coming-soon' | 'maintenance';
  completedBy: number;
  rating: number;
  steps: LabStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LabStep {
  id: number;
  title: string;
  description: string;
  instructions: string[];
  initialCode: string;
  expectedOutput: string;
  hints: string[];
  validation: {
    type: string;
    checks: ValidationCheck[];
  };
  order: number;
}

export interface ValidationCheck {
  type: 'variable_exists' | 'function_called' | 'function_defined' | 'keyword_used' | 'method_called';
  name: string;
}

export interface LabProgress {
  userId: number;
  labId: number;
  currentStep: number;
  completedSteps: number[];
  code: string;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // en minutos
}

@Injectable()
export class VirtualLabsService {
  constructor(private prisma: PrismaService) {}

  // Mock data para desarrollo inicial
  private mockLabs: VirtualLab[] = [
    {
      id: 1,
      title: 'Introducción a Python',
      description: 'Aprende los fundamentos de Python con ejercicios prácticos',
      category: 'programming',
      difficulty: 'beginner',
      duration: '30 min',
      technologies: ['Python'],
      objectives: [
        'Entender variables y tipos de datos',
        'Crear funciones básicas',
        'Trabajar con listas y diccionarios'
      ],
      status: 'available',
      completedBy: 0,
      rating: 4.8,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Variables y Tipos de Datos',
          description: 'Aprende a declarar variables y trabajar con diferentes tipos de datos en Python.',
          instructions: [
            'Crea una variable llamada `nombre` con tu nombre',
            'Crea una variable `edad` con tu edad',
            'Crea una variable `altura` con tu altura en metros (decimal)',
            'Imprime todas las variables usando print()'
          ],
          initialCode: '# Paso 1: Variables y Tipos de Datos\n# Escribe tu código aquí\n\n',
          expectedOutput: 'Variables creadas correctamente',
          hints: [
            'Usa comillas para strings: nombre = "Tu Nombre"',
            'Los números enteros no necesitan comillas: edad = 25',
            'Los decimales usan punto: altura = 1.75',
            'Usa print(variable) para mostrar el valor'
          ],
          validation: {
            type: 'code_check',
            checks: [
              { type: 'variable_exists', name: 'nombre' },
              { type: 'variable_exists', name: 'edad' },
              { type: 'variable_exists', name: 'altura' },
              { type: 'function_called', name: 'print' }
            ]
          },
          order: 1
        },
        {
          id: 2,
          title: 'Listas y Operaciones',
          description: 'Trabaja con listas y aprende las operaciones básicas.',
          instructions: [
            'Crea una lista llamada `frutas` con al menos 3 frutas',
            'Agrega una fruta más usando append()',
            'Imprime la longitud de la lista',
            'Imprime el primer y último elemento'
          ],
          initialCode: '# Paso 2: Listas y Operaciones\n# Escribe tu código aquí\n\n',
          expectedOutput: 'Lista manipulada correctamente',
          hints: [
            'Las listas se crean con corchetes: ["item1", "item2"]',
            'Usa lista.append("nuevo_item") para agregar',
            'len(lista) devuelve la longitud',
            'lista[0] es el primer elemento, lista[-1] es el último'
          ],
          validation: {
            type: 'code_check',
            checks: [
              { type: 'variable_exists', name: 'frutas' },
              { type: 'method_called', name: 'append' },
              { type: 'function_called', name: 'len' },
              { type: 'function_called', name: 'print' }
            ]
          },
          order: 2
        },
        {
          id: 3,
          title: 'Funciones Básicas',
          description: 'Crea tu primera función en Python.',
          instructions: [
            'Define una función llamada `saludar` que reciba un nombre',
            'La función debe retornar "Hola, [nombre]!"',
            'Llama a la función con tu nombre',
            'Imprime el resultado'
          ],
          initialCode: '# Paso 3: Funciones Básicas\n# Escribe tu código aquí\n\n',
          expectedOutput: 'Función creada y ejecutada correctamente',
          hints: [
            'Usa def nombre_funcion(parametro): para definir',
            'Usa return para devolver un valor',
            'No olvides los dos puntos (:) después de la definición',
            'La indentación es importante en Python'
          ],
          validation: {
            type: 'code_check',
            checks: [
              { type: 'function_defined', name: 'saludar' },
              { type: 'keyword_used', name: 'return' },
              { type: 'function_called', name: 'saludar' },
              { type: 'function_called', name: 'print' }
            ]
          },
          order: 3
        }
      ]
    },
    {
      id: 2,
      title: 'HTML y CSS Básico',
      description: 'Construye tu primera página web desde cero',
      category: 'web-development',
      difficulty: 'beginner',
      duration: '45 min',
      technologies: ['HTML', 'CSS'],
      objectives: [
        'Crear estructura HTML semántica',
        'Aplicar estilos CSS',
        'Hacer diseño responsive'
      ],
      status: 'available',
      completedBy: 0,
      rating: 4.6,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Estructura HTML Básica',
          description: 'Crea la estructura básica de una página web.',
          instructions: [
            'Crea un documento HTML5 válido',
            'Agrega un título en el head',
            'Crea un header con un h1',
            'Agrega un párrafo en el body'
          ],
          initialCode: '<!-- Paso 1: Estructura HTML Básica -->\n<!-- Escribe tu código aquí -->\n\n',
          expectedOutput: 'Estructura HTML creada correctamente',
          hints: [
            'Usa <!DOCTYPE html> para HTML5',
            'No olvides las etiquetas <html>, <head> y <body>',
            'El título va en <title> dentro del <head>',
            'Usa <h1> para el encabezado principal'
          ],
          validation: {
            type: 'html_check',
            checks: [
              { type: 'keyword_used', name: '<!DOCTYPE html>' },
              { type: 'keyword_used', name: '<title>' },
              { type: 'keyword_used', name: '<h1>' },
              { type: 'keyword_used', name: '<p>' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 3,
      title: 'Consultas SQL Avanzadas',
      description: 'Domina las consultas complejas en bases de datos',
      category: 'database',
      difficulty: 'intermediate',
      duration: '60 min',
      technologies: ['SQL', 'PostgreSQL'],
      objectives: [
        'Realizar JOINs complejos',
        'Usar subconsultas',
        'Optimizar rendimiento'
      ],
      status: 'available',
      completedBy: 15,
      rating: 4.9,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'SELECT y WHERE básico',
          description: 'Aprende las consultas básicas de selección y filtrado.',
          instructions: [
            'Escribe una consulta SELECT para obtener todos los campos de la tabla usuarios',
            'Agrega una cláusula WHERE para filtrar usuarios mayores de 18 años',
            'Ordena los resultados por nombre'
          ],
          initialCode: '-- Paso 1: SELECT y WHERE básico\n-- Escribe tu consulta SQL aquí\n\n',
          expectedOutput: 'Consulta ejecutada correctamente',
          hints: [
            'Usa SELECT * FROM tabla para todos los campos',
            'WHERE edad > 18 para filtrar por edad',
            'ORDER BY nombre para ordenar'
          ],
          validation: {
            type: 'sql_check',
            checks: [
              { type: 'keyword_used', name: 'SELECT' },
              { type: 'keyword_used', name: 'WHERE' },
              { type: 'keyword_used', name: 'ORDER BY' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 4,
      title: 'Docker Fundamentals',
      description: 'Aprende containerización con Docker',
      category: 'devops',
      difficulty: 'intermediate',
      duration: '90 min',
      technologies: ['Docker', 'Linux'],
      objectives: [
        'Crear contenedores Docker',
        'Escribir Dockerfiles',
        'Usar Docker Compose'
      ],
      status: 'available',
      completedBy: 8,
      rating: 4.7,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Primer Dockerfile',
          description: 'Crea tu primer Dockerfile para una aplicación simple.',
          instructions: [
            'Crea un Dockerfile que use la imagen base de Node.js',
            'Establece el directorio de trabajo',
            'Copia los archivos de la aplicación',
            'Instala las dependencias y define el comando de inicio'
          ],
          initialCode: '# Paso 1: Primer Dockerfile\n# Escribe tu Dockerfile aquí\n\n',
          expectedOutput: 'Dockerfile creado correctamente',
          hints: [
            'Usa FROM node:16 para la imagen base',
            'WORKDIR /app establece el directorio',
            'COPY . . copia los archivos',
            'RUN npm install para dependencias'
          ],
          validation: {
            type: 'dockerfile_check',
            checks: [
              { type: 'keyword_used', name: 'FROM' },
              { type: 'keyword_used', name: 'WORKDIR' },
              { type: 'keyword_used', name: 'COPY' },
              { type: 'keyword_used', name: 'RUN' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 5,
      title: 'JavaScript Avanzado',
      description: 'Domina conceptos avanzados de JavaScript',
      category: 'programming',
      difficulty: 'intermediate',
      duration: '75 min',
      technologies: ['JavaScript', 'ES6+'],
      objectives: [
        'Entender closures y scope',
        'Trabajar con async/await',
        'Manipular el DOM'
      ],
      status: 'available',
      completedBy: 22,
      rating: 4.5,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Funciones Arrow y Destructuring',
          description: 'Aprende la sintaxis moderna de JavaScript.',
          instructions: [
            'Crea una función arrow que sume dos números',
            'Usa destructuring para extraer propiedades de un objeto',
            'Implementa template literals para concatenar strings'
          ],
          initialCode: '// Paso 1: Funciones Arrow y Destructuring\n// Escribe tu código aquí\n\n',
          expectedOutput: 'Sintaxis moderna aplicada correctamente',
          hints: [
            'const suma = (a, b) => a + b',
            'const {nombre, edad} = persona',
            'Usa backticks `` para template literals'
          ],
          validation: {
            type: 'js_check',
            checks: [
              { type: 'keyword_used', name: '=>' },
              { type: 'keyword_used', name: 'const' },
              { type: 'keyword_used', name: '`' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 6,
      title: 'React Hooks Fundamentals',
      description: 'Aprende los hooks básicos de React',
      category: 'web-development',
      difficulty: 'intermediate',
      duration: '60 min',
      technologies: ['React', 'JavaScript', 'Hooks'],
      objectives: [
        'Usar useState para estado local',
        'Implementar useEffect para efectos',
        'Crear componentes funcionales'
      ],
      status: 'available',
      completedBy: 18,
      rating: 4.8,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'useState Hook',
          description: 'Maneja estado en componentes funcionales.',
          instructions: [
            'Importa useState de React',
            'Crea un estado para un contador',
            'Implementa funciones para incrementar y decrementar',
            'Renderiza el contador con botones'
          ],
          initialCode: '// Paso 1: useState Hook\nimport React from \'react\';\n\n// Escribe tu componente aquí\n\n',
          expectedOutput: 'Componente con estado creado',
          hints: [
            'import { useState } from \'react\'',
            'const [count, setCount] = useState(0)',
            'setCount(count + 1) para incrementar',
            'Usa onClick en los botones'
          ],
          validation: {
            type: 'react_check',
            checks: [
              { type: 'keyword_used', name: 'useState' },
              { type: 'keyword_used', name: 'setCount' },
              { type: 'keyword_used', name: 'onClick' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 7,
      title: 'Algoritmos de Ordenamiento',
      description: 'Implementa y analiza algoritmos de ordenamiento clásicos',
      category: 'computer-science',
      difficulty: 'intermediate',
      duration: '90 min',
      technologies: ['Python', 'Algoritmos'],
      objectives: [
        'Implementar Bubble Sort',
        'Entender complejidad temporal',
        'Comparar diferentes algoritmos'
      ],
      status: 'available',
      completedBy: 12,
      rating: 4.6,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Bubble Sort',
          description: 'Implementa el algoritmo de ordenamiento burbuja.',
          instructions: [
            'Crea una función bubble_sort que reciba una lista',
            'Implementa el algoritmo usando bucles anidados',
            'Prueba con una lista de números desordenados',
            'Imprime la lista antes y después del ordenamiento'
          ],
          initialCode: '# Paso 1: Bubble Sort\n# Implementa el algoritmo aquí\n\ndef bubble_sort(arr):\n    # Tu código aquí\n    pass\n\n',
          expectedOutput: 'Lista ordenada correctamente',
          hints: [
            'Usa dos bucles for anidados',
            'Compara elementos adyacentes',
            'Intercambia si están en orden incorrecto',
            'range(len(arr)) para iterar'
          ],
          validation: {
            type: 'algorithm_check',
            checks: [
              { type: 'function_defined', name: 'bubble_sort' },
              { type: 'keyword_used', name: 'for' },
              { type: 'keyword_used', name: 'if' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 8,
      title: 'Estructuras de Datos: Pilas y Colas',
      description: 'Implementa estructuras de datos fundamentales',
      category: 'computer-science',
      difficulty: 'beginner',
      duration: '45 min',
      technologies: ['Python', 'Estructuras de Datos'],
      objectives: [
        'Implementar una pila (Stack)',
        'Implementar una cola (Queue)',
        'Entender LIFO y FIFO'
      ],
      status: 'available',
      completedBy: 25,
      rating: 4.7,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Implementar una Pila',
          description: 'Crea una clase Stack con operaciones básicas.',
          instructions: [
            'Crea una clase Stack',
            'Implementa métodos push, pop, peek e is_empty',
            'Usa una lista interna para almacenar elementos',
            'Prueba la pila con algunos elementos'
          ],
          initialCode: '# Paso 1: Implementar una Pila\n# Crea tu clase Stack aquí\n\nclass Stack:\n    def __init__(self):\n        # Tu código aquí\n        pass\n\n',
          expectedOutput: 'Pila implementada correctamente',
          hints: [
            'self.items = [] para inicializar',
            'append() para push, pop() para pop',
            'self.items[-1] para peek',
            'len(self.items) == 0 para is_empty'
          ],
          validation: {
            type: 'class_check',
            checks: [
              { type: 'keyword_used', name: 'class Stack' },
              { type: 'function_defined', name: 'push' },
              { type: 'function_defined', name: 'pop' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 9,
      title: 'MongoDB Básico',
      description: 'Aprende las operaciones básicas en MongoDB',
      category: 'database',
      difficulty: 'beginner',
      duration: '50 min',
      technologies: ['MongoDB', 'NoSQL'],
      objectives: [
        'Crear y consultar documentos',
        'Entender colecciones',
        'Realizar operaciones CRUD'
      ],
      status: 'available',
      completedBy: 20,
      rating: 4.4,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Insertar Documentos',
          description: 'Aprende a insertar documentos en MongoDB.',
          instructions: [
            'Usa insertOne para insertar un documento',
            'Crea un documento con campos nombre, edad y email',
            'Usa insertMany para insertar múltiples documentos',
            'Verifica las inserciones con find()'
          ],
          initialCode: '// Paso 1: Insertar Documentos\n// Escribe tus comandos MongoDB aquí\n\n',
          expectedOutput: 'Documentos insertados correctamente',
          hints: [
            'db.usuarios.insertOne({nombre: "Juan", edad: 25})',
            'Usa comillas dobles para strings',
            'insertMany([{}, {}]) para múltiples',
            'db.usuarios.find() para ver todos'
          ],
          validation: {
            type: 'mongodb_check',
            checks: [
              { type: 'keyword_used', name: 'insertOne' },
              { type: 'keyword_used', name: 'find' }
            ]
          },
          order: 1
        }
      ]
    },
    {
      id: 10,
      title: 'CSS Grid y Flexbox',
      description: 'Domina los sistemas de layout modernos de CSS',
      category: 'web-development',
      difficulty: 'intermediate',
      duration: '70 min',
      technologies: ['CSS', 'HTML', 'Layout'],
      objectives: [
        'Crear layouts con CSS Grid',
        'Usar Flexbox para alineación',
        'Hacer diseños responsive'
      ],
      status: 'available',
      completedBy: 16,
      rating: 4.9,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [
        {
          id: 1,
          title: 'Flexbox Básico',
          description: 'Aprende los conceptos fundamentales de Flexbox.',
          instructions: [
            'Crea un contenedor con display: flex',
            'Agrega 3 elementos hijos',
            'Usa justify-content para centrar horizontalmente',
            'Aplica align-items para centrar verticalmente'
          ],
          initialCode: '/* Paso 1: Flexbox Básico */\n/* Escribe tu CSS aquí */\n\n.container {\n  /* Tu código aquí */\n}\n\n',
          expectedOutput: 'Layout con Flexbox creado',
          hints: [
            'display: flex; para activar flexbox',
            'justify-content: center; para centrar horizontal',
            'align-items: center; para centrar vertical',
            'height: 100vh; para altura completa'
          ],
          validation: {
            type: 'css_check',
            checks: [
              { type: 'keyword_used', name: 'display: flex' },
              { type: 'keyword_used', name: 'justify-content' },
              { type: 'keyword_used', name: 'align-items' }
            ]
          },
          order: 1
        }
      ]
    }
  ];

  async getAllLabs(): Promise<VirtualLab[]> {
    // Por ahora retornamos mock data
    // En el futuro esto consultará la base de datos
    return this.mockLabs;
  }

  async getLabById(id: number): Promise<VirtualLab | null> {
    // Por ahora buscamos en mock data
    const lab = this.mockLabs.find(lab => lab.id === id);
    return lab || null;
  }

  async getLabsByCategory(category: string): Promise<VirtualLab[]> {
    if (category === 'all') {
      return this.getAllLabs();
    }
    return this.mockLabs.filter(lab => lab.category === category);
  }

  async getLabsByDifficulty(difficulty: string): Promise<VirtualLab[]> {
    return this.mockLabs.filter(lab => lab.difficulty === difficulty);
  }

  async getUserLabProgress(userId: number, labId: number): Promise<LabProgress | null> {
    // Mock implementation
    // En el futuro esto consultará la base de datos
    return {
      userId,
      labId,
      currentStep: 0,
      completedSteps: [],
      code: '',
      startedAt: new Date(),
      timeSpent: 0
    };
  }

  async saveLabProgress(progress: Partial<LabProgress>): Promise<LabProgress> {
    // Mock implementation
    // En el futuro esto guardará en la base de datos
    return {
      userId: progress.userId!,
      labId: progress.labId!,
      currentStep: progress.currentStep || 0,
      completedSteps: progress.completedSteps || [],
      code: progress.code || '',
      startedAt: progress.startedAt || new Date(),
      completedAt: progress.completedAt,
      timeSpent: progress.timeSpent || 0
    };
  }

  async validateCode(code: string, validation: any): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    let success = true;

    // Validación básica simulada
    if (validation.checks) {
      validation.checks.forEach((check: ValidationCheck) => {
        switch (check.type) {
          case 'variable_exists':
            if (!code.includes(check.name + ' =')) {
              errors.push(`Variable '${check.name}' no encontrada`);
              success = false;
            }
            break;
          case 'function_called':
            if (!code.includes(check.name + '(')) {
              errors.push(`Función '${check.name}()' no fue llamada`);
              success = false;
            }
            break;
          case 'function_defined':
            if (!code.includes(`def ${check.name}(`)) {
              errors.push(`Función '${check.name}' no fue definida`);
              success = false;
            }
            break;
          case 'keyword_used':
            if (!code.includes(check.name)) {
              errors.push(`Palabra clave '${check.name}' no encontrada`);
              success = false;
            }
            break;
          case 'method_called':
            if (!code.includes(`.${check.name}(`)) {
              errors.push(`Método '${check.name}()' no fue llamado`);
              success = false;
            }
            break;
          default:
            break;
        }
      });
    }

    return { success, errors };
  }

  async executeCode(code: string, language: string): Promise<{ output: string; error?: string }> {
    // Mock implementation para ejecución de código
    // En el futuro esto se conectará con contenedores Docker
    
    try {
      // Simular ejecución
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (language === 'python') {
        // Simulación básica de ejecución Python
        if (code.includes('print(')) {
          return {
            output: 'Código ejecutado correctamente\nSalida simulada del programa'
          };
        } else {
          return {
            output: 'Código ejecutado sin salida visible'
          };
        }
      }
      
      return {
        output: 'Código ejecutado correctamente'
      };
    } catch (error) {
      return {
        output: '',
        error: 'Error al ejecutar el código: ' + error.message
      };
    }
  }

  async getLabStatistics(): Promise<any> {
    return {
      totalLabs: this.mockLabs.length,
      availableLabs: this.mockLabs.filter(lab => lab.status === 'available').length,
      categoriesCount: {
        programming: this.mockLabs.filter(lab => lab.category === 'programming').length,
        'web-development': this.mockLabs.filter(lab => lab.category === 'web-development').length,
        database: this.mockLabs.filter(lab => lab.category === 'database').length,
        devops: this.mockLabs.filter(lab => lab.category === 'devops').length,
        'computer-science': this.mockLabs.filter(lab => lab.category === 'computer-science').length
      },
      difficultyCount: {
        beginner: this.mockLabs.filter(lab => lab.difficulty === 'beginner').length,
        intermediate: this.mockLabs.filter(lab => lab.difficulty === 'intermediate').length,
        advanced: this.mockLabs.filter(lab => lab.difficulty === 'advanced').length
      }
    };
  }
}