export type RunResult = {
  output: string;
  error?: string;
};

export type ValidateResult = {
  ok?: boolean;
  success: boolean;
  errors: string[];
  output?: string;
  details?: any;
  score?: number;
};

type ValidationSpec = {
  checks?: Array<
    | { type: 'includes'; value: string; message?: string }
    | { type: 'regex'; pattern: string; flags?: string; message?: string }
  >;
  kind?: string;
  cases?: Array<any>;
  normalization?: {
    trim?: boolean;
    ignoreWhitespace?: boolean;
    caseInsensitive?: boolean;
  };
};

type ExerciseLike = {
  type?: string;
  language?: string;
};

function normalizeText(s: string, opts?: ValidationSpec['normalization']) {
  let out = String(s ?? '');
  if (opts?.trim !== false) out = out.trim();
  if (opts?.ignoreWhitespace) out = out.replace(/\s+/g, '');
  if (opts?.caseInsensitive) out = out.toLowerCase();
  return out;
}

function simulateOutputFromCode(code: string, language: string): string {
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

function validateLegacyChecks(code: string, spec: ValidationSpec): { errors: string[] } {
  const checks = Array.isArray(spec.checks) ? spec.checks : [];
  const errors: string[] = [];

  for (const check of checks) {
    if (!check || typeof check !== 'object' || !('type' in check)) continue;

    if (check.type === 'includes') {
      const value = String((check as any).value ?? '');
      if (value && !code.includes(value)) {
        errors.push(String((check as any).message ?? `Debe incluir: ${value}`));
      }
    }

    if (check.type === 'regex') {
      const pattern = String((check as any).pattern ?? '');
      const flags = String((check as any).flags ?? '');
      if (pattern) {
        const re = new RegExp(pattern, flags);
        if (!re.test(code)) {
          errors.push(String((check as any).message ?? `No cumple patrón: /${pattern}/`));
        }
      }
    }
  }

  return { errors };
}

function validateIoCases(output: string, spec: ValidationSpec) {
  const cases = Array.isArray(spec.cases) ? spec.cases : [];
  const errors: string[] = [];
  const details: Array<any> = [];
  let passed = 0;

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i] ?? {};
    const expected = normalizeText(String(c.expectedOutput ?? ''), spec.normalization);
    const got = normalizeText(String(output ?? ''), spec.normalization);
    const ok = expected === got;
    if (!ok) {
      errors.push(String(c.message ?? `Caso ${i + 1} no coincide con la salida esperada.`));
    } else {
      passed++;
    }
    details.push({ index: i, ok, expectedOutput: String(c.expectedOutput ?? ''), output: String(output ?? '') });
  }

  const score = cases.length ? Math.round((passed / cases.length) * 100) : errors.length ? 0 : 100;
  return { errors, details, score };
}

function validateTerminalSteps(submission: unknown, spec: ValidationSpec) {
  const cases = Array.isArray(spec.cases) ? spec.cases : [];
  const submitted = (submission && typeof submission === 'object' ? (submission as any) : {}) as any;
  const commands: string[] = Array.isArray(submitted.commands) ? submitted.commands.map(String) : [];
  const errors: string[] = [];
  const details: Array<any> = [];

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i] ?? {};
    const expectedCmd = String(c.command ?? '');
    const gotCmd = String(commands[i] ?? '');
    const ok = normalizeText(gotCmd, spec.normalization) === normalizeText(expectedCmd, spec.normalization);
    if (!ok) errors.push(String(c.message ?? `Comando ${i + 1} incorrecto.`));
    details.push({ index: i, ok, expectedCommand: expectedCmd, command: gotCmd });
  }

  const score = cases.length ? Math.round((details.filter((d) => d.ok).length / cases.length) * 100) : errors.length ? 0 : 100;
  return { errors, details, score };
}

export function runCodeMvp(code: string, language: string, submission?: unknown, exercise?: ExerciseLike): RunResult {
  // MVP seguro: NO ejecuta código real.
  // Solo simula una salida mínima para permitir construir el flujo UI.
  if (!code || typeof code !== 'string') {
    return { output: '', error: 'Código inválido' };
  }

  const normalizedLang = String(language || '').toLowerCase();

  const extracted = simulateOutputFromCode(code, normalizedLang);
  if (extracted) {
    return { output: extracted };
  }

  if ((exercise as any)?.type === 'terminal') {
    const submitted = (submission && typeof submission === 'object' ? (submission as any) : {}) as any;
    const transcript = Array.isArray(submitted.commands) ? submitted.commands.map(String).join('\n') : '';
    return { output: transcript || '' };
  }

  return { output: '' };
}

export function validateCodeMvp(code: string, validation: unknown, submission?: unknown, exercise?: ExerciseLike): ValidateResult {
  const spec = (validation && typeof validation === 'object' ? validation : {}) as ValidationSpec;

  const kind = String(spec.kind ?? '').toLowerCase();
  const exType = String(exercise?.type ?? 'code').toLowerCase();

  let errors: string[] = [];
  let details: any = undefined;
  let score: number | undefined = undefined;
  let output: string | undefined = undefined;

  if (spec.checks && Array.isArray(spec.checks) && spec.checks.length > 0) {
    const legacy = validateLegacyChecks(code, spec);
    errors = legacy.errors;
  } else if ((kind === 'io' || kind === 'testcases') && (exType === 'code' || exType === 'algorithm')) {
    const lang = String(exercise?.language ?? 'python');
    output = simulateOutputFromCode(code, lang);
    const io = validateIoCases(output, spec);
    errors = io.errors;
    details = io.details;
    score = io.score;
  } else if ((kind === 'steps' || kind === 'terminal') && exType === 'terminal') {
    const term = validateTerminalSteps(submission, spec);
    errors = term.errors;
    details = term.details;
    score = term.score;
  } else if (exType === 'diagram') {
    const sub = (submission && typeof submission === 'object' ? (submission as any) : {}) as any;
    const nodes = Array.isArray(sub.nodes) ? sub.nodes : [];
    const edges = Array.isArray(sub.edges) ? sub.edges : [];
    if (nodes.length === 0) errors.push('El diagrama debe contener al menos un nodo.');
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
