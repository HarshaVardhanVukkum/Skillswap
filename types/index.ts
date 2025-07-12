export interface User {
  id: string
  email: string
  password: string
  name: string
  location?: string
  skillsOffered: string[]
  skillsWanted: string[]
  availability: string
  isPublic: boolean
  profilePhoto?: string
  rating: number
  reviewCount: number
  createdAt: string
}

export interface SwapRequest {
  id: string
  requesterId: string
  targetUserId: string
  offeredSkill: string
  wantedSkill: string
  message: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export interface Review {
  id: string
  reviewerId: string
  revieweeId: string
  swapRequestId: string
  rating: number
  comment: string
  createdAt: string
}
