"use client"

export class ApiClient {
  private baseUrl = "" // evita erro TS de propriedade não inicializada
  private token: string | null

  constructor() {
    this.baseUrl = ""
    this.token = typeof window !== "undefined" ? localStorage.getItem("kwanzacoin_token") : null
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Dashboard
  async getDashboardData() {
    return this.request("/dashboard")
  }

  // Compras
  async comprarTokens(quantidade: number, metodoPagamento: string) {
    return this.request("/comprar", {
      method: "POST",
      body: JSON.stringify({ quantidade, metodoPagamento }),
    })
  }

  // Beta Testing
  async enviarCandidaturaBeta(dados: any) {
    return this.request("/beta/candidatura", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  }

  // Recompensas
  async enviarContribuicao(tipo: string, titulo: string, descricao: string) {
    return this.request("/recompensas", {
      method: "POST",
      body: JSON.stringify({ tipo, titulo, descricao }),
    })
  }

  // Transações
  async enviarTokens(endereco: string, quantidade: number) {
    return this.request("/transacoes/enviar", {
      method: "POST",
      body: JSON.stringify({ endereco, quantidade }),
    })
  }

  // Atualizar token
  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("kwanzacoin_token", token)
    }
  }
}

export const apiClient = new ApiClient()
