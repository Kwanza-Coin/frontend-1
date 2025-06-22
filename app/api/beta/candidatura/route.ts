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
    const { experiencia, disponibilidade, dispositivos, motivacao } = body

    if (!experiencia || !disponibilidade || !motivacao) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Verificar se já existe candidatura
    const existingApplication = await sql`
      SELECT id FROM candidaturas_beta WHERE usuario_id = ${user.userId}
    `

    if (existingApplication.length > 0) {
      return NextResponse.json({ error: "Você já possui uma candidatura ativa" }, { status: 409 })
    }

    // Inserir candidatura
    const candidatura = await sql`
      INSERT INTO candidaturas_beta (usuario_id, experiencia, disponibilidade, dispositivos, motivacao, status)
      VALUES (${user.userId}, ${experiencia}, ${disponibilidade}, ${dispositivos}, ${motivacao}, 'pendente')
      RETURNING id, status, created_at
    `

    // Simular aprovação automática para demonstração
    setTimeout(async () => {
      try {
        // Aprovar candidatura
        await sql`
          UPDATE candidaturas_beta 
          SET status = 'aprovado', reviewed_at = CURRENT_TIMESTAMP
          WHERE id = ${candidatura[0].id}
        `

        // Tornar usuário beta tester
        await sql`
          UPDATE usuarios 
          SET is_beta_tester = true, nivel = 'Beta Tester', tokens_ganhos = tokens_ganhos + 50
          WHERE id = ${user.userId}
        `

        // Adicionar recompensa de boas-vindas
        await sql`
          INSERT INTO recompensas (usuario_id, tipo, titulo, descricao, tokens, status)
          VALUES (${user.userId}, 'participacao', 'Bem-vindo ao programa beta', 'Recompensa por se juntar ao programa de testadores', 50.00, 'aprovado')
        `

        console.log(`Candidatura ${candidatura[0].id} aprovada automaticamente`)
      } catch (error) {
        console.error("Erro ao processar candidatura:", error)
      }
    }, 2000)

    return NextResponse.json({
      success: true,
      candidatura: candidatura[0],
      message: "Candidatura enviada com sucesso! Você receberá uma resposta em breve.",
    })
  } catch (error) {
    console.error("Erro na candidatura:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
