"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Wallet,
  Send,
  Download,
  TrendingUp,
  History,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  Plus,
  Trophy,
  Star,
  Bug,
  MessageSquare,
  Gift,
  Target,
  Award,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [saldoVisivel, setSaldoVisivel] = useState(true)
  const [usuario] = useState({
    nome: "João Silva",
    email: "joao@email.com",
    saldo: 125.5,
    endereco: "KC1a2b3c4d5e6f7g8h9i0j",
    nivel: "Beta Tester",
    tokensGanhos: 185.5,
    proximoNivel: 250,
  })

  const [transacoes] = useState([
    { id: 1, tipo: "recebido", valor: 50, data: "2024-01-15", de: "Maria Santos" },
    { id: 2, tipo: "enviado", valor: -25, data: "2024-01-14", para: "Pedro Costa" },
    { id: 3, tipo: "compra", valor: 100, data: "2024-01-13", metodo: "Multicaixa" },
  ])

  const [recompensas] = useState([
    {
      id: 1,
      tipo: "bug_report",
      titulo: "Bug crítico no sistema de pagamento",
      tokens: 25,
      data: "2024-01-20",
      status: "aprovado",
      descricao: "Reportou erro que impedia transações",
    },
    {
      id: 2,
      tipo: "feedback",
      titulo: "Sugestão de melhoria na interface",
      tokens: 15,
      data: "2024-01-18",
      status: "aprovado",
      descricao: "Proposta de redesign da tela de compra",
    },
    {
      id: 3,
      tipo: "teste_recurso",
      titulo: "Teste do novo sistema de notificações",
      tokens: 20,
      data: "2024-01-16",
      status: "aprovado",
      descricao: "Testou e validou novo recurso",
    },
    {
      id: 4,
      tipo: "participacao",
      titulo: "Participação em pesquisa de usuário",
      tokens: 30,
      data: "2024-01-14",
      status: "aprovado",
      descricao: "Entrevista sobre experiência do usuário",
    },
    {
      id: 5,
      tipo: "feedback",
      titulo: "Relatório de usabilidade",
      tokens: 12,
      data: "2024-01-12",
      status: "pendente",
      descricao: "Análise da navegação mobile",
    },
  ])

  const [estatisticas] = useState({
    totalTokensGanhos: 185.5,
    bugsReportados: 8,
    feedbackEnviados: 15,
    testesRealizados: 12,
    rankingPosicao: 3,
    totalTestadores: 47,
  })

  const [metas] = useState([
    {
      id: 1,
      titulo: "Reportar 10 bugs",
      progresso: 8,
      meta: 10,
      recompensa: 50,
      status: "em_progresso",
    },
    {
      id: 2,
      titulo: "Enviar 20 feedbacks",
      progresso: 15,
      meta: 20,
      recompensa: 75,
      status: "em_progresso",
    },
    {
      id: 3,
      titulo: "Testar 15 recursos",
      progresso: 12,
      meta: 15,
      recompensa: 60,
      status: "em_progresso",
    },
    {
      id: 4,
      titulo: "Primeira semana ativa",
      progresso: 7,
      meta: 7,
      recompensa: 25,
      status: "concluida",
    },
  ])

  const copiarEndereco = () => {
    navigator.clipboard.writeText(usuario.endereco)
    // Mostrar toast de sucesso
  }

  const getIconeRecompensa = (tipo: string) => {
    switch (tipo) {
      case "bug_report":
        return <Bug className="h-4 w-4" />
      case "feedback":
        return <MessageSquare className="h-4 w-4" />
      case "teste_recurso":
        return <Star className="h-4 w-4" />
      case "participacao":
        return <Trophy className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getCorRecompensa = (tipo: string) => {
    switch (tipo) {
      case "bug_report":
        return "bg-red-600"
      case "feedback":
        return "bg-blue-600"
      case "teste_recurso":
        return "bg-yellow-600"
      case "participacao":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <header className="border-b bg-slate-900/95 backdrop-blur-sm border-red-500">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-500 to-red-400 rounded-full flex items-center justify-center border-2 border-red-500">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-400">Dashboard</h1>
              <p className="text-gray-300 text-sm">Bem-vindo, {usuario.nome}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-red-500 text-red-400">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-red-500 text-red-400">
              <Settings className="h-4 w-4" />
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
              >
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/90 border-2 border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Saldo Total</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSaldoVisivel(!saldoVisivel)}
                className="text-red-400 hover:text-red-300"
              >
                {saldoVisivel ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{saldoVisivel ? `${usuario.saldo} KC` : "••••••"}</div>
              <p className="text-xs text-gray-300">
                ≈ {saldoVisivel ? `${(usuario.saldo * 850).toLocaleString("pt-AO")} Kz` : "••••••"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-2 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Tokens Ganhos</CardTitle>
              <Trophy className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{usuario.tokensGanhos} KC</div>
              <p className="text-xs text-gray-300">Como testador beta</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-2 border-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-500">Status</CardTitle>
              <Badge className="bg-yellow-500 text-black">{usuario.nivel}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">Ativo</div>
              <p className="text-xs text-gray-300">Ranking #{estatisticas.rankingPosicao}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-2 border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Transações</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{transacoes.length}</div>
              <p className="text-xs text-gray-300">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="bg-slate-800/90 border-2 border-red-500 mb-8">
          <CardHeader>
            <CardTitle className="text-red-400">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/comprar">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                  <Plus className="mr-2 h-4 w-4" />
                  Comprar KC
                </Button>
              </Link>
              <Button className="w-full bg-slate-700 hover:bg-slate-600 text-gray-100">
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </Button>
              <Button className="w-full bg-black border border-red-400 text-red-400 hover:bg-red-500 hover:text-black">
                <Download className="mr-2 h-4 w-4" />
                Receber
              </Button>
              <Button className="w-full bg-black border border-red-600 text-red-600 hover:bg-red-600 hover:text-yellow-100">
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Principal */}
        <Tabs defaultValue="carteira" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/60 border border-red-400">
            <TabsTrigger value="carteira" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Wallet className="mr-2 h-4 w-4" />
              Carteira
            </TabsTrigger>
            <TabsTrigger value="historico" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <History className="mr-2 h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="recompensas" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Trophy className="mr-2 h-4 w-4" />
              Recompensas
            </TabsTrigger>
            <TabsTrigger value="beta" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Badge className="mr-2 bg-red-600 text-yellow-500 text-xs">BETA</Badge>
              Testes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carteira" className="space-y-6">
            <Card className="bg-slate-800/90 border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400">Minha Carteira</CardTitle>
                <CardDescription className="text-gray-300">Gerencie seus KwanzaCoin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    {saldoVisivel ? `${usuario.saldo} KC` : "••••••"}
                  </div>
                  <div className="text-black/80">Saldo Disponível</div>
                </div>

                <div className="space-y-2">
                  <label className="text-red-400 text-sm font-medium">Endereço da Carteira</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-black/40 border border-red-500 rounded px-3 py-2 text-yellow-100 text-sm font-mono">
                      {usuario.endereco}
                    </div>
                    <Button size="sm" onClick={copiarEndereco} className="bg-red-600 hover:bg-red-700 text-white">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <Card className="bg-slate-800/90 border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400">Histórico de Transações</CardTitle>
                <CardDescription className="text-gray-300">Suas últimas movimentações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transacoes.map((transacao) => (
                    <div
                      key={transacao.id}
                      className="flex items-center justify-between p-4 bg-black/40 border border-red-500 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transacao.tipo === "recebido"
                              ? "bg-green-600"
                              : transacao.tipo === "enviado"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                          }`}
                        >
                          {transacao.tipo === "recebido" ? (
                            <Download className="h-5 w-5 text-white" />
                          ) : transacao.tipo === "enviado" ? (
                            <Send className="h-5 w-5 text-white" />
                          ) : (
                            <Plus className="h-5 w-5 text-black" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-red-400">
                            {transacao.tipo === "recebido"
                              ? `Recebido de ${transacao.de}`
                              : transacao.tipo === "enviado"
                                ? `Enviado para ${transacao.para}`
                                : `Compra via ${transacao.metodo}`}
                          </div>
                          <div className="text-sm text-gray-300">{transacao.data}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${transacao.valor > 0 ? "text-green-500" : "text-red-500"}`}>
                        {transacao.valor > 0 ? "+" : ""}
                        {transacao.valor} KC
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recompensas" className="space-y-6">
            {/* Estatísticas de Recompensas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/90 border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Total Ganho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{estatisticas.totalTokensGanhos} KC</div>
                  <p className="text-gray-300 text-sm">Desde o início do programa</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Próximo Nível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Progresso</span>
                      <span className="text-blue-400">
                        {usuario.tokensGanhos}/{usuario.proximoNivel} KC
                      </span>
                    </div>
                    <Progress value={(usuario.tokensGanhos / usuario.proximoNivel) * 100} className="h-2" />
                    <p className="text-gray-300 text-xs">
                      Faltam {usuario.proximoNivel - usuario.tokensGanhos} KC para o próximo nível
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">#{estatisticas.rankingPosicao}</div>
                  <p className="text-gray-300 text-sm">de {estatisticas.totalTestadores} testadores</p>
                </CardContent>
              </Card>
            </div>

            {/* Metas e Objetivos */}
            <Card className="bg-slate-800/90 border-2 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Metas e Objetivos
                </CardTitle>
                <CardDescription className="text-gray-300">Complete metas para ganhar tokens extras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metas.map((meta) => (
                    <div key={meta.id} className="p-4 bg-black/40 border border-yellow-500 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-yellow-400">{meta.titulo}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              meta.status === "concluida"
                                ? "bg-green-600 text-white"
                                : meta.status === "em_progresso"
                                  ? "bg-yellow-600 text-black"
                                  : "bg-gray-600 text-white"
                            }
                          >
                            {meta.status === "concluida" ? "Concluída" : "Em Progresso"}
                          </Badge>
                          <span className="text-green-400 font-bold">+{meta.recompensa} KC</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Progresso</span>
                          <span className="text-yellow-400">
                            {meta.progresso}/{meta.meta}
                          </span>
                        </div>
                        <Progress value={(meta.progresso / meta.meta) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Recompensas */}
            <Card className="bg-slate-800/90 border-2 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Histórico de Recompensas
                </CardTitle>
                <CardDescription className="text-gray-300">Tokens ganhos por atividades de teste</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recompensas.map((recompensa) => (
                    <div
                      key={recompensa.id}
                      className="flex items-start justify-between p-4 bg-black/40 border border-red-500 rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getCorRecompensa(
                            recompensa.tipo,
                          )}`}
                        >
                          {getIconeRecompensa(recompensa.tipo)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-red-400">{recompensa.titulo}</div>
                          <p className="text-sm text-gray-300 mt-1">{recompensa.descricao}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-400 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {recompensa.data}
                            </span>
                            <Badge
                              className={
                                recompensa.status === "aprovado"
                                  ? "bg-green-600 text-white"
                                  : recompensa.status === "pendente"
                                    ? "bg-yellow-600 text-black"
                                    : "bg-red-600 text-white"
                              }
                            >
                              {recompensa.status === "aprovado"
                                ? "Aprovado"
                                : recompensa.status === "pendente"
                                  ? "Pendente"
                                  : "Rejeitado"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">+{recompensa.tokens} KC</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beta" className="space-y-6">
            <Card className="bg-slate-800/90 border-2 border-orange-500">
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center">
                  <Badge className="mr-2 bg-yellow-500 text-black">BETA</Badge>
                  Programa de Testes
                </CardTitle>
                <CardDescription className="text-gray-300">Recursos exclusivos para testadores beta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-500 mb-2">Status do Testador</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Nível:</span>
                      <Badge className="bg-red-600 text-yellow-500">Beta Tester Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Bugs reportados:</span>
                      <span className="text-red-400 font-bold">{estatisticas.bugsReportados}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Feedback enviados:</span>
                      <span className="text-red-400 font-bold">{estatisticas.feedbackEnviados}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Testes realizados:</span>
                      <span className="text-red-400 font-bold">{estatisticas.testesRealizados}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    <Bug className="mr-2 h-4 w-4" />
                    Reportar Bug
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Feedback
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                    <Star className="mr-2 h-4 w-4" />
                    Testar Recurso
                  </Button>
                </div>

                <div className="bg-black/40 border border-red-600 rounded-lg p-4">
                  <h4 className="font-bold text-red-600 mb-2">Próximos Recursos para Teste</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Transferências internacionais</li>
                    <li>• Integração com bancos angolanos</li>
                    <li>• App mobile nativo</li>
                    <li>• Sistema de cashback</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
