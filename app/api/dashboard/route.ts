import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Buscar dados do usuário
    const userData = await sql`
      SELECT id, nome, email, endereco_carteira, saldo, tokens_ganhos, nivel, ranking_posicao, is_beta_tester
      FROM usuarios 
      WHERE id = ${user.userId}
    `

    if (userData.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar transações
    const transacoes = await sql`
      SELECT id, tipo, valor, endereco_origem, endereco_destino, metodo_pagamento, created_at
      FROM transacoes 
      WHERE usuario_id = ${user.userId}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Buscar recompensas
    const recompensas = await sql`
      SELECT id, tipo, titulo, descricao, tokens, status, created_at
      FROM recompensas 
      WHERE usuario_id = ${user.userId}
      ORDER BY created_at DESC
    `

    // Buscar metas
    const metas = await sql`
      SELECT id, titulo, descricao, progresso, meta_valor, recompensa_tokens, status, created_at
      FROM metas 
      WHERE usuario_id = ${user.userId}
      ORDER BY created_at DESC
    `

    // Calcular estatísticas
    const estatisticas = await sql`
      SELECT 
        COUNT(CASE WHEN tipo = 'bug_report' THEN 1 END) as bugs_reportados,
        COUNT(CASE WHEN tipo = 'feedback' THEN 1 END) as feedback_enviados,
        COUNT(CASE WHEN tipo = 'teste_recurso' THEN 1 END) as testes_realizados,
        SUM(CASE WHEN status = 'aprovado' THEN tokens ELSE 0 END) as total_tokens_ganhos
      FROM recompensas 
      WHERE usuario_id = ${user.userId}
    `

    // Contar total de testadores para ranking
    const totalTestadores = await sql`
      SELECT COUNT(*) as total FROM usuarios WHERE is_beta_tester = true
    `

    return NextResponse.json({
      success: true,
      data: {
        usuario: userData[0],
        transacoes,
        recompensas,
        metas,
        estatisticas: {
          ...estatisticas[0],
          total_testadores: totalTestadores[0].total,
        },
      },
    })
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
