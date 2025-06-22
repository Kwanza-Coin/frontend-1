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

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, titulo, descricao } = body

    if (!tipo || !titulo || !descricao) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Definir tokens baseado no tipo
    let tokens = 0
    switch (tipo) {
      case "bug_report":
        tokens = Math.floor(Math.random() * 20) + 15 // 15-35 tokens
        break
      case "feedback":
        tokens = Math.floor(Math.random() * 15) + 10 // 10-25 tokens
        break
      case "teste_recurso":
        tokens = Math.floor(Math.random() * 25) + 20 // 20-45 tokens
        break
      default:
        tokens = 10
    }

    // Inserir recompensa
    const recompensa = await sql`
      INSERT INTO recompensas (usuario_id, tipo, titulo, descricao, tokens, status)
      VALUES (${user.userId}, ${tipo}, ${titulo}, ${descricao}, ${tokens}, 'pendente')
      RETURNING id, tokens, created_at
    `

    // Simular aprovação automática
    setTimeout(async () => {
      try {
        // Aprovar recompensa
        await sql`
          UPDATE recompensas 
          SET status = 'aprovado', approved_at = CURRENT_TIMESTAMP
          WHERE id = ${recompensa[0].id}
        `

        // Adicionar tokens ao usuário
        await sql`
          UPDATE usuarios 
          SET tokens_ganhos = tokens_ganhos + ${tokens}
          WHERE id = ${user.userId}
        `

        // Atualizar progresso das metas
        if (tipo === "bug_report") {
          await sql`
            UPDATE metas 
            SET progresso = progresso + 1
            WHERE usuario_id = ${user.userId} AND titulo LIKE '%bug%' AND status = 'ativa'
          `
        } else if (tipo === "feedback") {
          await sql`
            UPDATE metas 
            SET progresso = progresso + 1
            WHERE usuario_id = ${user.userId} AND titulo LIKE '%feedback%' AND status = 'ativa'
          `
        } else if (tipo === "teste_recurso") {
          await sql`
            UPDATE metas 
            SET progresso = progresso + 1
            WHERE usuario_id = ${user.userId} AND titulo LIKE '%recurso%' AND status = 'ativa'
          `
        }

        // Verificar metas concluídas
        const metasConcluidas = await sql`
          UPDATE metas 
          SET status = 'concluida', completed_at = CURRENT_TIMESTAMP
          WHERE usuario_id = ${user.userId} AND progresso >= meta_valor AND status = 'ativa'
          RETURNING id, recompensa_tokens
        `

        // Adicionar recompensas das metas concluídas
        for (const meta of metasConcluidas) {
          await sql`
            UPDATE usuarios 
            SET tokens_ganhos = tokens_ganhos + ${meta.recompensa_tokens}
            WHERE id = ${user.userId}
          `
        }

        console.log(`Recompensa ${recompensa[0].id} aprovada automaticamente`)
      } catch (error) {
        console.error("Erro ao processar recompensa:", error)
      }
    }, 1500)

    return NextResponse.json({
      success: true,
      recompensa: recompensa[0],
      message: "Contribuição enviada com sucesso! Você receberá os tokens em breve.",
    })
  } catch (error) {
    console.error("Erro ao criar recompensa:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
