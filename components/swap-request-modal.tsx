"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@/types"
import { useSwapRequests } from "@/hooks/use-swap-requests"

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  targetUser: User
  currentUser: User
}

export function SwapRequestModal({ isOpen, onClose, targetUser, currentUser }: SwapRequestModalProps) {
  const [offeredSkill, setOfferedSkill] = useState("")
  const [wantedSkill, setWantedSkill] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const { createRequest } = useSwapRequests()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!offeredSkill) {
      setError("Please select a skill you want to offer")
      return
    }

    if (!wantedSkill) {
      setError("Please select a skill you want to learn")
      return
    }

    if (!message.trim()) {
      setError("Please include a message")
      return
    }

    createRequest({
      requesterId: currentUser.id,
      targetUserId: targetUser.id,
      offeredSkill,
      wantedSkill,
      message: message.trim(),
    })

    // Reset form and close modal
    setOfferedSkill("")
    setWantedSkill("")
    setMessage("")
    setError("")
    onClose()
  }

  const handleClose = () => {
    setOfferedSkill("")
    setWantedSkill("")
    setMessage("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Skill Swap with {targetUser.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offered-skill">Choose one of your offered skills</Label>
            <Select value={offeredSkill} onValueChange={setOfferedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you can teach" />
              </SelectTrigger>
              <SelectContent>
                {currentUser.skillsOffered.map((skill, index) => (
                  <SelectItem key={index} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wanted-skill">Choose one of their wanted skills</Label>
            <Select value={wantedSkill} onValueChange={setWantedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you want to learn" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsWanted.map((skill, index) => (
                  <SelectItem key={index} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              rows={4}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Submit Request
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
