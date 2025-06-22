import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, senha } = body

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário
    const users = await sql`
      SELECT id, nome, email, senha_hash, endereco_carteira, saldo, tokens_ganhos, nivel, is_beta_tester
      FROM usuarios 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha_hash)
    if (!senhaValida) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "7d",
    })

    // Remover senha do retorno
    const { senha_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: "Login realizado com sucesso",
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
