"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u: User) => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error("Invalid email or password")
    }

    setUser(foundUser)
    localStorage.setItem("currentUser", JSON.stringify(foundUser))
  }

  const signup = async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    if (users.find((u: User) => u.email === email)) {
      throw new Error("User with this email already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      location: "",
      skillsOffered: [],
      skillsWanted: [],
      availability: "",
      isPublic: true,
      profilePhoto: "",
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("users", JSON.stringify(users))
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
