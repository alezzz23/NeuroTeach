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
exports.LearnService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LearnService = class LearnService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listTracks() {
        return this.prisma.track.findMany({
            where: { isPublished: true },
            orderBy: [{ order: 'asc' }, { id: 'asc' }],
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                order: true,
            },
        });
    }
    async listTracksWithProgress(userId) {
        const tracks = await this.prisma.track.findMany({
            where: { isPublished: true },
            orderBy: [{ order: 'asc' }, { id: 'asc' }],
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                order: true,
                modules: {
                    select: {
                        exercises: {
                            where: { isPublished: true },
                            select: { id: true },
                        },
                    },
                },
            },
        });
        const allExerciseIds = tracks.flatMap((t) => t.modules.flatMap((m) => m.exercises.map((e) => e.id)));
        const progressRows = allExerciseIds.length
            ? await this.prisma.exerciseProgress.findMany({
                where: { userId, exerciseId: { in: allExerciseIds } },
                select: { exerciseId: true, isCompleted: true },
            })
            : [];
        const completionByExerciseId = {};
        for (const p of progressRows) {
            completionByExerciseId[p.exerciseId] = !!p.isCompleted;
        }
        return tracks.map((t) => {
            const exerciseIds = t.modules.flatMap((m) => m.exercises.map((e) => e.id));
            const totalExercises = exerciseIds.length;
            const completedExercises = exerciseIds.reduce((acc, exId) => acc + (completionByExerciseId[exId] ? 1 : 0), 0);
            const percent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
            return {
                id: t.id,
                slug: t.slug,
                title: t.title,
                description: t.description,
                order: t.order,
                progress: {
                    totalExercises,
                    completedExercises,
                    percent,
                },
            };
        });
    }
    async getTrackBySlug(slug) {
        return this.prisma.track.findUnique({
            where: { slug },
            include: {
                modules: {
                    orderBy: [{ order: 'asc' }, { id: 'asc' }],
                    include: {
                        exercises: {
                            where: { isPublished: true },
                            orderBy: [{ order: 'asc' }, { id: 'asc' }],
                            select: {
                                id: true,
                                slug: true,
                                title: true,
                                description: true,
                                type: true,
                                language: true,
                                points: true,
                                order: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getExerciseById(exerciseId) {
        return this.prisma.exercise.findUnique({
            where: { id: exerciseId },
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                instructions: true,
                starterCode: true,
                type: true,
                language: true,
                validation: true,
                points: true,
                module: {
                    select: {
                        id: true,
                        title: true,
                        track: { select: { slug: true, title: true } },
                    },
                },
            },
        });
    }
    async getExerciseProgress(userId, exerciseId) {
        return this.prisma.exerciseProgress.findUnique({
            where: { userId_exerciseId: { userId, exerciseId } },
            select: {
                code: true,
                isCompleted: true,
                attempts: true,
                score: true,
                updatedAt: true,
                completedAt: true,
            },
        });
    }
    async saveExerciseProgress(userId, exerciseId, data) {
        const existing = await this.prisma.exerciseProgress.findUnique({
            where: { userId_exerciseId: { userId, exerciseId } },
            select: { id: true, attempts: true },
        });
        if (existing) {
            return this.prisma.exerciseProgress.update({
                where: { id: existing.id },
                data: {
                    code: data.code ?? undefined,
                    isCompleted: data.isCompleted ?? undefined,
                    score: data.score ?? undefined,
                    attempts: existing.attempts + 1,
                    completedAt: data.isCompleted ? new Date() : undefined,
                },
            });
        }
        return this.prisma.exerciseProgress.create({
            data: {
                userId,
                exerciseId,
                code: data.code ?? '',
                isCompleted: data.isCompleted ?? false,
                score: data.score ?? 0,
                attempts: 1,
                completedAt: data.isCompleted ? new Date() : null,
            },
        });
    }
    async getTrackProgress(userId, trackSlug) {
        const track = await this.prisma.track.findUnique({
            where: { slug: trackSlug },
            select: {
                id: true,
                slug: true,
                modules: {
                    orderBy: [{ order: 'asc' }, { id: 'asc' }],
                    select: {
                        id: true,
                        exercises: {
                            where: { isPublished: true },
                            orderBy: [{ order: 'asc' }, { id: 'asc' }],
                            select: { id: true },
                        },
                    },
                },
            },
        });
        if (!track)
            return null;
        const exerciseIds = track.modules.flatMap((m) => m.exercises.map((e) => e.id));
        if (exerciseIds.length === 0) {
            return {
                trackSlug: track.slug,
                totalExercises: 0,
                completedExercises: 0,
                completionByExerciseId: {},
            };
        }
        const progress = await this.prisma.exerciseProgress.findMany({
            where: { userId, exerciseId: { in: exerciseIds } },
            select: { exerciseId: true, isCompleted: true },
        });
        const completionByExerciseId = {};
        for (const p of progress) {
            completionByExerciseId[p.exerciseId] = !!p.isCompleted;
        }
        const completedExercises = exerciseIds.reduce((acc, exId) => acc + (completionByExerciseId[exId] ? 1 : 0), 0);
        return {
            trackSlug: track.slug,
            totalExercises: exerciseIds.length,
            completedExercises,
            completionByExerciseId,
        };
    }
    async getDashboardLearningSummary(userId) {
        const tracks = await this.prisma.track.findMany({
            where: { isPublished: true },
            orderBy: [{ order: 'asc' }, { id: 'asc' }],
            select: {
                slug: true,
                title: true,
                order: true,
                modules: {
                    orderBy: [{ order: 'asc' }, { id: 'asc' }],
                    select: {
                        order: true,
                        exercises: {
                            where: { isPublished: true },
                            orderBy: [{ order: 'asc' }, { id: 'asc' }],
                            select: { id: true, title: true, order: true },
                        },
                    },
                },
            },
        });
        const exerciseToTrack = {};
        const orderedExercises = [];
        for (const t of tracks) {
            for (const m of t.modules) {
                for (const ex of m.exercises) {
                    exerciseToTrack[ex.id] = { trackSlug: t.slug, trackTitle: t.title };
                    orderedExercises.push({ id: ex.id, title: ex.title, trackSlug: t.slug, trackTitle: t.title });
                }
            }
        }
        const exerciseIds = orderedExercises.map((e) => e.id);
        const progressRows = exerciseIds.length
            ? await this.prisma.exerciseProgress.findMany({
                where: { userId, exerciseId: { in: exerciseIds } },
                select: { exerciseId: true, isCompleted: true, attempts: true, completedAt: true },
            })
            : [];
        const progressByExerciseId = {};
        for (const p of progressRows) {
            progressByExerciseId[p.exerciseId] = {
                isCompleted: !!p.isCompleted,
                attempts: p.attempts,
                completedAt: p.completedAt ?? null,
            };
        }
        const next = orderedExercises.find((e) => !progressByExerciseId[e.id]?.isCompleted) || orderedExercises[0];
        const nextExercise = next
            ? {
                id: next.id,
                title: next.title,
                trackSlug: next.trackSlug,
                trackTitle: next.trackTitle,
            }
            : null;
        const tracksWithProgress = await this.listTracksWithProgress(userId);
        const tracksInProgress = tracksWithProgress
            .filter((t) => (t.progress.totalExercises ?? 0) > 0 && (t.progress.completedExercises ?? 0) < (t.progress.totalExercises ?? 0))
            .slice(0, 3);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const completedThisWeek = progressRows.filter((p) => p.isCompleted && p.completedAt && p.completedAt >= weekAgo).length;
        const completedAttempts = progressRows.filter((p) => p.isCompleted).map((p) => p.attempts);
        const avgAttemptsCompleted = completedAttempts.length
            ? Math.round((completedAttempts.reduce((a, b) => a + b, 0) / completedAttempts.length) * 10) / 10
            : 0;
        const completedDates = progressRows
            .filter((p) => p.isCompleted && p.completedAt)
            .map((p) => new Date(p.completedAt));
        const completedDayKeys = new Set(completedDates.map((d) => d.toISOString().slice(0, 10)));
        let exerciseStreakDays = 0;
        for (let i = 0; i < 365; i++) {
            const day = new Date();
            day.setHours(0, 0, 0, 0);
            day.setDate(day.getDate() - i);
            const key = day.toISOString().slice(0, 10);
            if (!completedDayKeys.has(key))
                break;
            exerciseStreakDays++;
        }
        return {
            nextExercise,
            tracksInProgress,
            metrics: {
                completedThisWeek,
                avgAttemptsCompleted,
                exerciseStreakDays,
            },
        };
    }
};
exports.LearnService = LearnService;
exports.LearnService = LearnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LearnService);
//# sourceMappingURL=learn.service.js.map