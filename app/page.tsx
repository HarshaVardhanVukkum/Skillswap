"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useUsers } from "@/hooks/use-users"

const ITEMS_PER_PAGE = 6

export default function HomePage() {
  const { user, logout } = useAuth()
  const { users, loading } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredUsers = users.filter((u) => {
    if (u.id === user?.id) return false
    if (!u.isPublic) return false

    const matchesSearch =
      searchTerm === "" ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesAvailability = availabilityFilter === "all" || u.availability === availabilityFilter

    return matchesSearch && matchesAvailability
  })

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Skill Swap Platform</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost">Profile</Button>
                  </Link>
                  <Link href="/requests">
                    <Button variant="ghost">Swap Requests</Button>
                  </Link>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profilePhoto || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
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
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="weekends">Weekends</SelectItem>
              <SelectItem value="evenings">Evenings</SelectItem>
              <SelectItem value="weekdays">Weekdays</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedUsers.map((profileUser) => (
            <Card key={profileUser.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profileUser.profilePhoto || "/placeholder.svg"} />
                    <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{profileUser.name}</h3>
                    {profileUser.location && <p className="text-sm text-gray-600">{profileUser.location}</p>}
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(profileUser.rating)}
                      <span className="text-sm text-gray-600 ml-1">{profileUser.rating.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Skills Offered:</p>
                    <div className="flex flex-wrap gap-1">
                      {profileUser.skillsOffered.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                      {profileUser.skillsOffered.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profileUser.skillsOffered.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Skills Wanted:</p>
                    <div className="flex flex-wrap gap-1">
                      {profileUser.skillsWanted.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                      {profileUser.skillsWanted.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profileUser.skillsWanted.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available: {profileUser.availability}</span>
                  {user ? (
                    <Link href={`/user/${profileUser.id}`}>
                      <Button size="sm">Request</Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button size="sm">Login to Request</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
