"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Plus, Upload } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: "",
    isPublic: true,
    profilePhoto: "",
  })
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setFormData({
      name: user.name,
      location: user.location || "",
      skillsOffered: [...user.skillsOffered],
      skillsWanted: [...user.skillsWanted],
      availability: user.availability,
      isPublic: user.isPublic,
      profilePhoto: user.profilePhoto || "",
    })
  }, [user, router])

  const handleAddSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }))
      setNewSkillOffered("")
    }
  }

  const handleAddSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }))
      setNewSkillWanted("")
    }
  }

  const handleRemoveSkillOffered = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }))
  }

  const handleRemoveSkillWanted = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setMessage("Name is required")
      return
    }

    if (formData.skillsOffered.length === 0) {
      setMessage("Please add at least one skill you can offer")
      return
    }

    if (formData.skillsWanted.length === 0) {
      setMessage("Please add at least one skill you want to learn")
      return
    }

    if (!formData.availability) {
      setMessage("Please select your availability")
      return
    }

    updateUser(formData)
    setMessage("Profile updated successfully!")
    setTimeout(() => setMessage(""), 3000)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
            <div className="flex items-center gap-4">
              <Link href="/requests">
                <Button variant="ghost">Swap Requests</Button>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.profilePhoto || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Upload className="w-4 h-4" />
                      Add/Edit Photo
                    </div>
                  </Label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload a profile photo</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>

              {/* Skills Offered */}
              <div className="space-y-3">
                <Label>Skills Offered *</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you can teach"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkillOffered())}
                  />
                  <Button type="button" onClick={handleAddSkillOffered}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillOffered(skill)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="space-y-3">
                <Label>Skills Wanted *</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkillWanted())}
                  />
                  <Button type="button" onClick={handleAddSkillWanted}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-blue-200 text-blue-800">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillWanted(skill)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="evenings">Evenings</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Profile Visibility */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
                />
              </div>

              {message && (
                <Alert className={message.includes("successfully") ? "border-green-200 bg-green-50" : ""}>
                  <AlertDescription className={message.includes("successfully") ? "text-green-800" : ""}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button type="submit">Save Profile</Button>
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
