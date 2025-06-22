import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, telefone, provincia, senha, aceitarTermos } = body

    // Validar dados obrigatórios
    if (!nome || !email || !senha || !aceitarTermos) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Verificar se email já existe
    const existingUser = await sql`
      SELECT id FROM usuarios WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)

    // Gerar endereço de carteira único
    const enderecoCarteira = `KC${Math.random().toString(36).substring(2, 15)}`

    // Inserir usuário
    const result = await sql`
      INSERT INTO usuarios (nome, email, telefone, provincia, senha_hash, endereco_carteira, aceitar_termos)
      VALUES (${nome}, ${email}, ${telefone}, ${provincia}, ${senhaHash}, ${enderecoCarteira}, ${aceitarTermos})
      RETURNING id, nome, email, endereco_carteira
    `

    // Criar metas iniciais para o novo usuário
    const userId = result[0].id
    await sql`
      INSERT INTO metas (usuario_id, titulo, descricao, progresso, meta_valor, recompensa_tokens, status)
      VALUES 
        (${userId}, 'Primeira semana ativa', 'Complete 7 dias de atividade na plataforma', 0, 7, 25.00, 'ativa'),
        (${userId}, 'Primeiro feedback', 'Envie seu primeiro feedback sobre a plataforma', 0, 1, 10.00, 'ativa'),
        (${userId}, 'Explorar recursos', 'Teste 5 recursos diferentes da plataforma', 0, 5, 30.00, 'ativa')
    `

    return NextResponse.json({
      success: true,
      user: result[0],
      message: "Usuário criado com sucesso",
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
