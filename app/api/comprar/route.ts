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
    const { quantidade, metodoPagamento } = body

    if (!quantidade || !metodoPagamento || quantidade <= 0) {
      return NextResponse.json({ error: "Dados inválidos para compra" }, { status: 400 })
    }

    const taxaConversao = 850 // 1 KC = 850 Kz
    const valorKwanza = Number.parseFloat(quantidade) * taxaConversao

    // Simular processamento de pagamento
    const referenciaPagemento = `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    // Inserir compra
    const compra = await sql`
      INSERT INTO compras (usuario_id, quantidade, valor_kwanza, metodo_pagamento, taxa_conversao, status, referencia_pagamento)
      VALUES (${user.userId}, ${quantidade}, ${valorKwanza}, ${metodoPagamento}, ${taxaConversao}, 'processando', ${referenciaPagemento})
      RETURNING id, referencia_pagamento
    `

    // Simular aprovação automática (em produção seria integração real)
    setTimeout(async () => {
      try {
        // Atualizar status da compra
        await sql`
          UPDATE compras 
          SET status = 'concluida', completed_at = CURRENT_TIMESTAMP
          WHERE id = ${compra[0].id}
        `

        // Adicionar saldo ao usuário
        await sql`
          UPDATE usuarios 
          SET saldo = saldo + ${quantidade}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${user.userId}
        `

        // Registrar transação
        await sql`
          INSERT INTO transacoes (usuario_id, tipo, valor, metodo_pagamento, status)
          VALUES (${user.userId}, 'compra', ${quantidade}, ${metodoPagamento}, 'concluida')
        `

        console.log(`Compra ${compra[0].id} processada com sucesso`)
      } catch (error) {
        console.error("Erro ao processar compra:", error)
      }
    }, 3000) // Simular 3 segundos de processamento

    return NextResponse.json({
      success: true,
      compra: compra[0],
      valorKwanza,
      message: "Compra iniciada com sucesso. Processando pagamento...",
    })
  } catch (error) {
    console.error("Erro na compra:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
