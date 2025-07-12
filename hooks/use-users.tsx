"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"

interface UsersContextType {
  users: User[]
  loading: boolean
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize with sample data if no users exist
    const savedUsers = localStorage.getItem("users")
    if (!savedUsers) {
      const sampleUsers: User[] = [
        {
          id: "1",
          email: "marc@example.com",
          password: "password123",
          name: "Marc Demo",
          location: "New York, NY",
          skillsOffered: ["Java Script", "Python"],
          skillsWanted: ["Python", "Graphic design"],
          availability: "weekends",
          isPublic: true,
          profilePhoto: "",
          rating: 3.4,
          reviewCount: 12,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "michell@example.com",
          password: "password123",
          name: "Michell",
          location: "San Francisco, CA",
          skillsOffered: ["Java Script", "Python"],
          skillsWanted: ["Python", "Graphic design"],
          availability: "evenings",
          isPublic: true,
          profilePhoto: "",
          rating: 2.5,
          reviewCount: 8,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          email: "joe@example.com",
          password: "password123",
          name: "Joe Wills",
          location: "Austin, TX",
          skillsOffered: ["Java Script", "Python"],
          skillsWanted: ["Python", "Graphic design"],
          availability: "flexible",
          isPublic: true,
          profilePhoto: "",
          rating: 4.0,
          reviewCount: 15,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem("users", JSON.stringify(sampleUsers))
      setUsers(sampleUsers)
    } else {
      setUsers(JSON.parse(savedUsers))
    }
    setLoading(false)
  }, [])

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUsers = localStorage.getItem("users")
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return <UsersContext.Provider value={{ users, loading }}>{children}</UsersContext.Provider>
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}
