-- Criar tabelas para o sistema KwanzaCoin
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    provincia VARCHAR(100),
    senha_hash VARCHAR(255) NOT NULL,
    endereco_carteira VARCHAR(255) UNIQUE,
    saldo DECIMAL(15,8) DEFAULT 0,
    tokens_ganhos DECIMAL(15,8) DEFAULT 0,
    nivel VARCHAR(50) DEFAULT 'Iniciante',
    ranking_posicao INTEGER DEFAULT 0,
    is_beta_tester BOOLEAN DEFAULT FALSE,
    aceitar_termos BOOLEAN DEFAULT FALSE,
    receber_noticias BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(50) NOT NULL, -- 'enviado', 'recebido', 'compra'
    valor DECIMAL(15,8) NOT NULL,
    endereco_destino VARCHAR(255),
    endereco_origem VARCHAR(255),
    metodo_pagamento VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pendente',
    hash_transacao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recompensas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(50) NOT NULL, -- 'bug_report', 'feedback', 'teste_recurso', 'participacao'
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tokens DECIMAL(15,8) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    progresso INTEGER DEFAULT 0,
    meta_valor INTEGER NOT NULL,
    recompensa_tokens DECIMAL(15,8) NOT NULL,
    status VARCHAR(50) DEFAULT 'ativa', -- 'ativa', 'concluida', 'expirada'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidaturas_beta (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    experiencia VARCHAR(50),
    disponibilidade VARCHAR(50),
    dispositivos TEXT[], -- Array de dispositivos
    motivacao TEXT,
    status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compras (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    quantidade DECIMAL(15,8) NOT NULL,
    valor_kwanza DECIMAL(15,2) NOT NULL,
    metodo_pagamento VARCHAR(100) NOT NULL,
    taxa_conversao DECIMAL(15,8) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    referencia_pagamento VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_transacoes_usuario ON transacoes(usuario_id);
CREATE INDEX idx_recompensas_usuario ON recompensas(usuario_id);
CREATE INDEX idx_metas_usuario ON metas(usuario_id);
