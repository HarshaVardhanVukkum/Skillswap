"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Star, Search, Check, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useSwapRequests } from "@/hooks/use-swap-requests"
import { useUsers } from "@/hooks/use-users"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 5

export default function RequestsPage() {
  const { user } = useAuth()
  const { requests, updateRequestStatus, deleteRequest } = useSwapRequests()
  const { users } = useUsers()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const userRequests = requests.filter((req) => req.requesterId === user.id || req.targetUserId === user.id)

  const filteredRequests = userRequests.filter((req) => {
    const otherUserId = req.requesterId === user.id ? req.targetUserId : req.requesterId
    const otherUser = users.find((u) => u.id === otherUserId)

    const matchesStatus = statusFilter === "all" || req.status === statusFilter
    const matchesSearch =
      searchTerm === "" ||
      otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.offeredSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.wantedSkill.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleAccept = (requestId: string) => {
    updateRequestStatus(requestId, "accepted")
  }

  const handleReject = (requestId: string) => {
    updateRequestStatus(requestId, "rejected")
  }

  const handleDelete = (requestId: string) => {
    deleteRequest(requestId)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Swap Requests</h1>
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profilePhoto || "/placeholder.svg"} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <div className="space-y-4 mb-8">
          {paginatedRequests.map((request) => {
            const isRequester = request.requesterId === user.id
            const otherUserId = isRequester ? request.targetUserId : request.requesterId
            const otherUser = users.find((u) => u.id === otherUserId)

            if (!otherUser) return null

            return (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={otherUser.profilePhoto || "/placeholder.svg"} />
                      <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{otherUser.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(otherUser.rating)}
                            <span className="text-sm text-gray-600 ml-1">{otherUser.rating.toFixed(1)}/5</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-green-700 mb-1">
                            {isRequester ? "You offer:" : "They offer:"}
                          </p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {request.offeredSkill}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">
                            {isRequester ? "You want:" : "They want:"}
                          </p>
                          <Badge variant="outline" className="border-blue-200 text-blue-800">
                            {request.wantedSkill}
                          </Badge>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{request.message}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {isRequester ? "Sent" : "Received"} on {new Date(request.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex gap-2">
                          {!isRequester && request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAccept(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {isRequester && request.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => handleDelete(request.id)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}

                          {request.status === "rejected" && (
                            <Button size="sm" variant="outline" onClick={() => handleDelete(request.id)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No swap requests found.</p>
            <Link href="/">
              <Button className="mt-4">Browse Users</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
