"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { SwapRequest } from "@/types"

interface SwapRequestsContextType {
  requests: SwapRequest[]
  createRequest: (requestData: Omit<SwapRequest, "id" | "status" | "createdAt">) => void
  updateRequestStatus: (requestId: string, status: "accepted" | "rejected") => void
  deleteRequest: (requestId: string) => void
}

const SwapRequestsContext = createContext<SwapRequestsContextType | undefined>(undefined)

export function SwapRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SwapRequest[]>([])

  useEffect(() => {
    // Load requests from localStorage
    const savedRequests = localStorage.getItem("swapRequests")
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }
  }, [])

  const createRequest = (requestData: Omit<SwapRequest, "id" | "status" | "createdAt">) => {
    const newRequest: SwapRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const updatedRequests = [...requests, newRequest]
    setRequests(updatedRequests)
    localStorage.setItem("swapRequests", JSON.stringify(updatedRequests))
  }

  const updateRequestStatus = (requestId: string, status: "accepted" | "rejected") => {
    const updatedRequests = requests.map((req) => (req.id === requestId ? { ...req, status } : req))
    setRequests(updatedRequests)
    localStorage.setItem("swapRequests", JSON.stringify(updatedRequests))
  }

  const deleteRequest = (requestId: string) => {
    const updatedRequests = requests.filter((req) => req.id !== requestId)
    setRequests(updatedRequests)
    localStorage.setItem("swapRequests", JSON.stringify(updatedRequests))
  }

  return (
    <SwapRequestsContext.Provider value={{ requests, createRequest, updateRequestStatus, deleteRequest }}>
      {children}
    </SwapRequestsContext.Provider>
  )
}

export function useSwapRequests() {
  const context = useContext(SwapRequestsContext)
  if (context === undefined) {
    throw new Error("useSwapRequests must be used within a SwapRequestsProvider")
  }
  return context
}
