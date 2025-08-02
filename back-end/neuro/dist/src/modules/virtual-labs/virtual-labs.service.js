"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualLabsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let VirtualLabsService = class VirtualLabsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mockLabs = [
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
            completedBy: 0,
            rating: 4.9,
            createdAt: new Date(),
            updatedAt: new Date(),
            steps: []
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
            status: 'coming-soon',
            completedBy: 0,
            rating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            steps: []
        }
    ];
    async getAllLabs() {
        return this.mockLabs;
    }
    async getLabById(id) {
        const lab = this.mockLabs.find(lab => lab.id === id);
        return lab || null;
    }
    async getLabsByCategory(category) {
        if (category === 'all') {
            return this.getAllLabs();
        }
        return this.mockLabs.filter(lab => lab.category === category);
    }
    async getLabsByDifficulty(difficulty) {
        return this.mockLabs.filter(lab => lab.difficulty === difficulty);
    }
    async getUserLabProgress(userId, labId) {
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
    async saveLabProgress(progress) {
        return {
            userId: progress.userId,
            labId: progress.labId,
            currentStep: progress.currentStep || 0,
            completedSteps: progress.completedSteps || [],
            code: progress.code || '',
            startedAt: progress.startedAt || new Date(),
            completedAt: progress.completedAt,
            timeSpent: progress.timeSpent || 0
        };
    }
    async validateCode(code, validation) {
        const errors = [];
        let success = true;
        if (validation.checks) {
            validation.checks.forEach((check) => {
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
    async executeCode(code, language) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (language === 'python') {
                if (code.includes('print(')) {
                    return {
                        output: 'Código ejecutado correctamente\nSalida simulada del programa'
                    };
                }
                else {
                    return {
                        output: 'Código ejecutado sin salida visible'
                    };
                }
            }
            return {
                output: 'Código ejecutado correctamente'
            };
        }
        catch (error) {
            return {
                output: '',
                error: 'Error al ejecutar el código: ' + error.message
            };
        }
    }
    async getLabStatistics() {
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
};
exports.VirtualLabsService = VirtualLabsService;
exports.VirtualLabsService = VirtualLabsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VirtualLabsService);
//# sourceMappingURL=virtual-labs.service.js.map