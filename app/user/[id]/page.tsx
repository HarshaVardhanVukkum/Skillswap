"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useUsers } from "@/hooks/use-users"
import { useRouter } from "next/navigation"
import type { User } from "@/types"
import { SwapRequestModal } from "@/components/swap-request-modal"

interface UserDetailPageProps {
  params: { id: string }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { user: currentUser } = useAuth()
  const { users } = useUsers()
  const router = useRouter()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    const foundUser = users.find((u) => u.id === params.id)
    if (foundUser) {
      setProfileUser(foundUser)
    } else {
      router.push("/")
    }
  }, [params.id, users, router])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!currentUser) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/requests">
                <Button variant="ghost">Swap Requests</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.profilePhoto || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileUser.profilePhoto || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{profileUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{profileUser.name}</CardTitle>
                {profileUser.location && <p className="text-gray-600 mb-3">{profileUser.location}</p>}
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(profileUser.rating)}
                  <span className="text-lg font-medium ml-2">{profileUser.rating.toFixed(1)}/5</span>
                  <span className="text-gray-500">({profileUser.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-600">Available: {profileUser.availability}</p>
              </div>
              <Button onClick={() => setShowRequestModal(true)} size="lg" className="bg-teal-600 hover:bg-teal-700">
                Request Swap
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skills Offered */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.skillsOffered.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.skillsWanted.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-800 px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating and Feedback Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Rating and Feedback</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{profileUser.rating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">{renderStars(profileUser.rating)}</div>
                  <p className="text-gray-600">Based on {profileUser.reviewCount} reviews</p>
                </div>

                {profileUser.reviewCount > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Recent Reviews</h4>
                    <div className="space-y-3">
                      {/* Sample reviews - in a real app, these would come from the database */}
                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(5)}
                          <span className="text-sm text-gray-600">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Great teacher! Very patient and knowledgeable. Learned a lot about web development."
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(4)}
                          <span className="text-sm text-gray-600">1 month ago</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          "Excellent skill swap experience. Would definitely recommend!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Swap Request Modal */}
      {showRequestModal && (
        <SwapRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          targetUser={profileUser}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}
