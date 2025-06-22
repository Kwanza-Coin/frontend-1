"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface User {
  id: number
  nome: string
  email: string
  endereco_carteira: string
  saldo: number
  tokens_ganhos: number
  nivel: string
  ranking_posicao: number
  is_beta_tester: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, senha: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar token salvo no localStorage
    const savedToken = localStorage.getItem("kwanzacoin_token")
    const savedUser = localStorage.getItem("kwanzacoin_user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("kwanzacoin_token", data.token)
        localStorage.setItem("kwanzacoin_user", JSON.stringify(data.user))
        return true
      }
      return false
    } catch (error) {
      console.error("Erro no login:", error)
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error("Erro no registro:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("kwanzacoin_token")
    localStorage.removeItem("kwanzacoin_user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
