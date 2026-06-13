import Database from 'better-sqlite3';
import path from 'path';

export interface EvaluationRecord {
  id: number;
  student_name: string;
  question: string;
  code: string;
  understanding_score: number;
  logic_score: number;
  readability_score: number;
  syntax_score: number;
  total_score: number;
  level: string;
  hint?: string;
  practice?: string;
  knowledge_points: string;
  created_at: string;
  knowledgePoints?: string[];
}

const dbPath = path.resolve(process.cwd(), './data/evaluations.db');
const db = new Database(dbPath);

export async function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS evaluation_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      question TEXT NOT NULL,
      code TEXT NOT NULL,
      understanding_score INTEGER NOT NULL,
      logic_score INTEGER NOT NULL,
      readability_score INTEGER NOT NULL,
      syntax_score INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      level TEXT NOT NULL,
      hint TEXT,
      practice TEXT,
      knowledge_points TEXT,
      created_at TEXT NOT NULL
    )
  `);
}

export async function insertRecord(record: {
  studentName: string;
  question: string;
  code: string;
  understandingScore: number;
  logicScore: number;
  readabilityScore: number;
  syntaxScore: number;
  totalScore: number;
  level: string;
  hint?: string;
  practice?: string;
  knowledgePoints: string[];
  createdAt: string;
}) {
  const stmt = db.prepare(`INSERT INTO evaluation_records (
    student_name, question, code, understanding_score, logic_score,
    readability_score, syntax_score, total_score, level, hint,
    practice, knowledge_points, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  stmt.run(
    record.studentName,
    record.question,
    record.code,
    record.understandingScore,
    record.logicScore,
    record.readabilityScore,
    record.syntaxScore,
    record.totalScore,
    record.level,
    record.hint || null,
    record.practice || null,
    JSON.stringify(record.knowledgePoints || []),
    record.createdAt,
  );
}

export async function getAllRecords() {
  const rows = db.prepare('SELECT * FROM evaluation_records ORDER BY created_at DESC').all();
  return rows.map((row: any) => ({
    ...row,
    knowledgePoints: row.knowledge_points ? JSON.parse(row.knowledge_points) : [],
  }));
}

export async function getStatistics() {
  const rows = db.prepare(`
    SELECT 
      COUNT(*) as totalCount,
      AVG(total_score) as avgScore,
      SUM(CASE WHEN total_score >= 85 THEN 1 ELSE 0 END) as excellentCount,
      SUM(CASE WHEN total_score >= 70 AND total_score < 85 THEN 1 ELSE 0 END) as goodCount,
      SUM(CASE WHEN total_score >= 60 AND total_score < 70 THEN 1 ELSE 0 END) as passCount,
      SUM(CASE WHEN total_score < 60 THEN 1 ELSE 0 END) as failCount
    FROM evaluation_records
  `).all();
  
  const stats = rows[0] as any;
  return {
    totalCount: Number(stats.totalCount) || 0,
    avgScore: Number(stats.avgScore) || 0,
    excellentCount: Number(stats.excellentCount) || 0,
    goodCount: Number(stats.goodCount) || 0,
    passCount: Number(stats.passCount) || 0,
    failCount: Number(stats.failCount) || 0,
    excellentRate: stats.totalCount ? ((stats.excellentCount / stats.totalCount) * 100) : 0,
  };
}

export async function getKnowledgePointsStats() {
  const rows = db.prepare('SELECT knowledge_points FROM evaluation_records').all();
  const kpCounts: Record<string, number> = {};
  
  rows.forEach((row: any) => {
    if (row.knowledge_points) {
      try {
        const kps = JSON.parse(row.knowledge_points);
        kps.forEach((kp: string) => {
          kpCounts[kp] = (kpCounts[kp] || 0) + 1;
        });
      } catch {
        // ignore
      }
    }
  });
  
  return Object.entries(kpCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function searchRecords(params: {
  studentName?: string;
  knowledgePoint?: string;
  minScore?: number;
  maxScore?: number;
}) {
  let sql = 'SELECT * FROM evaluation_records WHERE 1=1';
  const values: any[] = [];

  if (params.studentName && params.studentName.trim()) {
    sql += ' AND student_name LIKE ?';
    values.push(`%${params.studentName.trim()}%`);
  }

  if (params.knowledgePoint && params.knowledgePoint.trim()) {
    sql += ' AND knowledge_points LIKE ?';
    values.push(`%${params.knowledgePoint.trim()}%`);
  }

  if (params.minScore !== undefined && params.minScore !== null) {
    sql += ' AND total_score >= ?';
    values.push(params.minScore);
  }

  if (params.maxScore !== undefined && params.maxScore !== null) {
    sql += ' AND total_score <= ?';
    values.push(params.maxScore);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...values);
  return rows.map((row: any) => ({
    ...row,
    knowledgePoints: row.knowledge_points ? JSON.parse(row.knowledge_points) : [],
  }));
}

export async function getAllStudentNames() {
  const rows = db.prepare('SELECT DISTINCT student_name FROM evaluation_records ORDER BY student_name').all();
  return rows.map((row: any) => row.student_name);
}
