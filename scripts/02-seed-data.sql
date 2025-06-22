-- Inserir dados de exemplo
INSERT INTO usuarios (nome, email, telefone, provincia, senha_hash, endereco_carteira, saldo, tokens_ganhos, nivel, is_beta_tester, aceitar_termos) VALUES
('João Silva', 'joao@email.com', '+244 923 456 789', 'luanda', '$2b$10$example_hash_1', 'KC1a2b3c4d5e6f7g8h9i0j', 125.50, 185.50, 'Beta Tester', TRUE, TRUE),
('Maria Santos', 'maria@email.com', '+244 924 567 890', 'benguela', '$2b$10$example_hash_2', 'KC2b3c4d5e6f7g8h9i0j1k', 89.25, 95.75, 'Iniciante', FALSE, TRUE),
('Pedro Costa', 'pedro@email.com', '+244 925 678 901', 'huambo', '$2b$10$example_hash_3', 'KC3c4d5e6f7g8h9i0j1k2l', 234.80, 156.30, 'Beta Tester', TRUE, TRUE);

-- Inserir transações de exemplo
INSERT INTO transacoes (usuario_id, tipo, valor, endereco_origem, endereco_destino, metodo_pagamento, status) VALUES
(1, 'recebido', 50.00, 'KC2b3c4d5e6f7g8h9i0j1k', 'KC1a2b3c4d5e6f7g8h9i0j', 'transferencia', 'concluida'),
(1, 'enviado', -25.00, 'KC1a2b3c4d5e6f7g8h9i0j', 'KC3c4d5e6f7g8h9i0j1k2l', 'transferencia', 'concluida'),
(1, 'compra', 100.00, NULL, 'KC1a2b3c4d5e6f7g8h9i0j', 'multicaixa', 'concluida');

-- Inserir recompensas de exemplo
INSERT INTO recompensas (usuario_id, tipo, titulo, descricao, tokens, status) VALUES
(1, 'bug_report', 'Bug crítico no sistema de pagamento', 'Reportou erro que impedia transações', 25.00, 'aprovado'),
(1, 'feedback', 'Sugestão de melhoria na interface', 'Proposta de redesign da tela de compra', 15.00, 'aprovado'),
(1, 'teste_recurso', 'Teste do novo sistema de notificações', 'Testou e validou novo recurso', 20.00, 'aprovado'),
(1, 'participacao', 'Participação em pesquisa de usuário', 'Entrevista sobre experiência do usuário', 30.00, 'aprovado'),
(1, 'feedback', 'Relatório de usabilidade', 'Análise da navegação mobile', 12.00, 'pendente');

-- Inserir metas de exemplo
INSERT INTO metas (usuario_id, titulo, descricao, progresso, meta_valor, recompensa_tokens, status) VALUES
(1, 'Reportar 10 bugs', 'Encontre e reporte 10 bugs diferentes', 8, 10, 50.00, 'ativa'),
(1, 'Enviar 20 feedbacks', 'Envie 20 feedbacks construtivos', 15, 20, 75.00, 'ativa'),
(1, 'Testar 15 recursos', 'Teste 15 recursos diferentes da plataforma', 12, 15, 60.00, 'ativa'),
(1, 'Primeira semana ativa', 'Complete 7 dias de atividade', 7, 7, 25.00, 'concluida');

-- Atualizar ranking dos usuários
UPDATE usuarios SET ranking_posicao = 3 WHERE id = 1;
UPDATE usuarios SET ranking_posicao = 15 WHERE id = 2;
UPDATE usuarios SET ranking_posicao = 8 WHERE id = 3;
