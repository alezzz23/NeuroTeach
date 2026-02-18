"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCodeMvp = runCodeMvp;
exports.validateCodeMvp = validateCodeMvp;
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const MAX_OUTPUT_CHARS = 4000;
const PY_TIMEOUT_MS = 1500;
function truncateOutput(s) {
    const out = String(s ?? '');
    if (out.length <= MAX_OUTPUT_CHARS)
        return out;
    return `${out.slice(0, MAX_OUTPUT_CHARS)}\n... [salida truncada]`;
}
function containsDangerousPython(code) {
    const banned = [
        /\bimport\s+os\b/i,
        /\bimport\s+sys\b/i,
        /\bimport\s+subprocess\b/i,
        /\bfrom\s+os\b/i,
        /\bfrom\s+sys\b/i,
        /\bfrom\s+subprocess\b/i,
        /\bopen\s*\(/i,
        /\beval\s*\(/i,
        /\bexec\s*\(/i,
        /__import__\s*\(/i,
    ];
    return banned.some((re) => re.test(code));
}
async function runPython(code, stdin) {
    const fileName = `neuroteach_${(0, node_crypto_1.randomBytes)(8).toString('hex')}.py`;
    const filePath = (0, node_path_1.join)((0, node_os_1.tmpdir)(), fileName);
    await (0, promises_1.writeFile)(filePath, code, { encoding: 'utf8' });
    try {
        const res = await new Promise((resolve) => {
            const child = (0, node_child_process_1.execFile)('python3', ['-I', filePath], {
                timeout: PY_TIMEOUT_MS,
                maxBuffer: 1024 * 1024,
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: '1',
                },
            }, (error, stdout, stderr) => {
                const anyErr = error;
                const timedOut = Boolean(anyErr?.killed && anyErr?.signal === 'SIGTERM') || anyErr?.code === 'ETIMEDOUT';
                const exitCode = typeof anyErr?.code === 'number' ? anyErr.code : timedOut ? 124 : 0;
                resolve({
                    stdout: truncateOutput(String(stdout ?? '')),
                    stderr: truncateOutput(String(stderr ?? '')),
                    exitCode,
                    timedOut,
                });
            });
            if (stdin) {
                child.stdin?.write(String(stdin));
            }
            child.stdin?.end();
        });
        return res;
    }
    finally {
        await (0, promises_1.unlink)(filePath).catch(() => null);
    }
}
function normalizeText(s, opts) {
    let out = String(s ?? '');
    if (opts?.trim !== false)
        out = out.trim();
    if (opts?.ignoreWhitespace)
        out = out.replace(/\s+/g, '');
    if (opts?.caseInsensitive)
        out = out.toLowerCase();
    return out;
}
function simulateOutputFromCode(code, language) {
    const normalizedLang = String(language || '').toLowerCase();
    if (normalizedLang === 'python') {
        const matches = Array.from(code.matchAll(/print\(([^)]*)\)/g));
        const outputs = matches.map((m) => {
            const raw = String(m[1] ?? '').trim();
            const str = raw.match(/^(["'`])(.*)\1$/s);
            return str ? str[2] : raw;
        });
        return outputs.join('\n');
    }
    if (normalizedLang === 'javascript' || normalizedLang === 'js') {
        const matches = Array.from(code.matchAll(/console\.log\(([^)]*)\)/g));
        const outputs = matches.map((m) => {
            const raw = String(m[1] ?? '').trim();
            const str = raw.match(/^(["'`])(.*)\1$/s);
            return str ? str[2] : raw;
        });
        return outputs.join('\n');
    }
    return '';
}
function validateLegacyChecks(code, spec) {
    const checks = Array.isArray(spec.checks) ? spec.checks : [];
    const errors = [];
    for (const check of checks) {
        if (!check || typeof check !== 'object' || !('type' in check))
            continue;
        if (check.type === 'includes') {
            const value = String(check.value ?? '');
            if (value && !code.includes(value)) {
                errors.push(String(check.message ?? `Debe incluir: ${value}`));
            }
        }
        if (check.type === 'regex') {
            const pattern = String(check.pattern ?? '');
            const flags = String(check.flags ?? '');
            if (pattern) {
                const re = new RegExp(pattern, flags);
                if (!re.test(code)) {
                    errors.push(String(check.message ?? `No cumple patrón: /${pattern}/`));
                }
            }
        }
    }
    return { errors };
}
function validateIoCases(output, spec) {
    const cases = Array.isArray(spec.cases) ? spec.cases : [];
    const errors = [];
    const details = [];
    let passed = 0;
    for (let i = 0; i < cases.length; i++) {
        const c = cases[i] ?? {};
        const expected = normalizeText(String(c.expectedOutput ?? ''), spec.normalization);
        const got = normalizeText(String(output ?? ''), spec.normalization);
        const ok = expected === got;
        if (!ok) {
            errors.push(String(c.message ?? `Caso ${i + 1} no coincide con la salida esperada.`));
        }
        else {
            passed++;
        }
        details.push({ index: i, ok, expectedOutput: String(c.expectedOutput ?? ''), output: String(output ?? '') });
    }
    const score = cases.length ? Math.round((passed / cases.length) * 100) : errors.length ? 0 : 100;
    return { errors, details, score };
}
function validateTerminalSteps(submission, spec) {
    const cases = Array.isArray(spec.cases) ? spec.cases : [];
    const submitted = (submission && typeof submission === 'object' ? submission : {});
    const commands = Array.isArray(submitted.commands) ? submitted.commands.map(String) : [];
    const errors = [];
    const details = [];
    for (let i = 0; i < cases.length; i++) {
        const c = cases[i] ?? {};
        const expectedCmd = String(c.command ?? '');
        const gotCmd = String(commands[i] ?? '');
        const ok = normalizeText(gotCmd, spec.normalization) === normalizeText(expectedCmd, spec.normalization);
        if (!ok)
            errors.push(String(c.message ?? `Comando ${i + 1} incorrecto.`));
        details.push({ index: i, ok, expectedCommand: expectedCmd, command: gotCmd });
    }
    const score = cases.length ? Math.round((details.filter((d) => d.ok).length / cases.length) * 100) : errors.length ? 0 : 100;
    return { errors, details, score };
}
async function runCodeMvp(code, language, submission, exercise) {
    if (!code || typeof code !== 'string') {
        return { output: '', error: 'Código inválido' };
    }
    const normalizedLang = String(language || '').toLowerCase();
    if (normalizedLang === 'python') {
        if (containsDangerousPython(code)) {
            return { output: '', error: 'Código contiene operaciones no permitidas en este entorno.' };
        }
        const submitted = (submission && typeof submission === 'object' ? submission : {});
        const stdin = String(submitted.stdin ?? '');
        const r = await runPython(code, stdin);
        if (r.timedOut)
            return { output: r.stdout, error: 'Tiempo de ejecución excedido' };
        if (r.exitCode !== 0 && r.stderr)
            return { output: r.stdout, error: r.stderr };
        return { output: r.stdout };
    }
    const extracted = simulateOutputFromCode(code, normalizedLang);
    if (extracted)
        return { output: extracted };
    if (exercise?.type === 'terminal') {
        const submitted = (submission && typeof submission === 'object' ? submission : {});
        const transcript = Array.isArray(submitted.commands) ? submitted.commands.map(String).join('\n') : '';
        return { output: transcript || '' };
    }
    return { output: '' };
}
async function validateCodeMvp(code, validation, submission, exercise) {
    const spec = (validation && typeof validation === 'object' ? validation : {});
    const kind = String(spec.kind ?? '').toLowerCase();
    const exType = String(exercise?.type ?? 'code').toLowerCase();
    let errors = [];
    let details = undefined;
    let score = undefined;
    let output = undefined;
    if (spec.checks && Array.isArray(spec.checks) && spec.checks.length > 0) {
        const legacy = validateLegacyChecks(code, spec);
        errors = legacy.errors;
    }
    else if ((kind === 'io' || kind === 'testcases') && (exType === 'code' || exType === 'algorithm')) {
        const lang = String(exercise?.language ?? 'python').toLowerCase();
        const cases = Array.isArray(spec.cases) ? spec.cases : [];
        if (lang === 'python') {
            if (containsDangerousPython(code)) {
                errors = ['Código contiene operaciones no permitidas en este entorno.'];
                details = [];
                score = 0;
            }
            else {
                const perCase = [];
                let passed = 0;
                for (let i = 0; i < cases.length; i++) {
                    const c = cases[i] ?? {};
                    const stdin = String(c.input ?? '');
                    const expectedRaw = String(c.expectedOutput ?? '');
                    const expected = normalizeText(expectedRaw, spec.normalization);
                    const r = await runPython(code, stdin);
                    const gotRaw = r.stdout;
                    const got = normalizeText(gotRaw, spec.normalization);
                    const ok = !r.timedOut && r.exitCode === 0 && expected === got;
                    if (ok)
                        passed++;
                    perCase.push({
                        index: i,
                        ok,
                        input: stdin,
                        expectedOutput: expectedRaw,
                        stdout: r.stdout,
                        stderr: r.stderr,
                        exitCode: r.exitCode,
                        timedOut: r.timedOut,
                    });
                }
                details = perCase;
                score = cases.length ? Math.round((passed / cases.length) * 100) : 100;
                errors = perCase.filter((d) => !d.ok).map((d) => `Caso ${Number(d.index) + 1} falló.`);
                output = perCase.length ? String(perCase[perCase.length - 1]?.stdout ?? '') : '';
            }
        }
        else {
            output = simulateOutputFromCode(code, lang);
            const io = validateIoCases(output, spec);
            errors = io.errors;
            details = io.details;
            score = io.score;
        }
    }
    else if ((kind === 'steps' || kind === 'terminal') && exType === 'terminal') {
        const term = validateTerminalSteps(submission, spec);
        errors = term.errors;
        details = term.details;
        score = term.score;
    }
    else if (exType === 'diagram') {
        const sub = (submission && typeof submission === 'object' ? submission : {});
        const nodes = Array.isArray(sub.nodes) ? sub.nodes : [];
        const edges = Array.isArray(sub.edges) ? sub.edges : [];
        if (nodes.length === 0)
            errors.push('El diagrama debe contener al menos un nodo.');
        details = { nodes: nodes.length, edges: edges.length };
        score = errors.length ? 0 : 100;
    }
    const success = errors.length === 0;
    return {
        ok: success,
        success,
        errors,
        output,
        details,
        score,
    };
}
//# sourceMappingURL=learn.runtime.js.map