"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Users, Clock, ChevronDown, Trophy, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"

// Mock room data
const MOCK_ROOMS = [
  {
    id: 1,
    name: "Quick Match Room",
    host: "Player123",
    players: 2,
    maxPlayers: 4,
    status: "Waiting",
    gameType: "Classic",
    createdAt: "5 mins ago",
  },
  {
    id: 2,
    name: "Pro Players Only",
    host: "ChampionPlayer",
    players: 3,
    maxPlayers: 4,
    status: "Waiting",
    gameType: "Competitive",
    createdAt: "10 mins ago",
  },
  {
    id: 3,
    name: "Beginner Friendly",
    host: "Coach",
    players: 1,
    maxPlayers: 4,
    status: "Waiting",
    gameType: "Casual",
    createdAt: "15 mins ago",
  },
  {
    id: 4,
    name: "Team Battle",
    host: "TeamCaptain",
    players: 4,
    maxPlayers: 4,
    status: "Full",
    gameType: "Team",
    createdAt: "20 mins ago",
  },
  {
    id: 5,
    name: "Fun & Casual Room",
    host: "CasualGamer",
    players: 2,
    maxPlayers: 6,
    status: "Waiting",
    gameType: "Party",
    createdAt: "25 mins ago",
  },
  {
    id: 6,
    name: "Tournament Qualifier",
    host: "TournamentOfficial",
    players: 6,
    maxPlayers: 8,
    status: "Waiting",
    gameType: "Tournament",
    createdAt: "30 mins ago",
  },
]

export default function GameLobby() {
  const [rooms, setRooms] = useState(MOCK_ROOMS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("All")

  // Filter and search rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.host.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "All" || room.gameType === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80 w-full">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="flex h-16 items-center justify-between py-4 w-full px-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Monopoly Game Lobby</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User Avatar" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">Username</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 w-full px-4">
        <div className="flex flex-col gap-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rooms or hosts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto justify-between">
                    {filter}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["All", "Classic", "Competitive", "Casual", "Team", "Party", "Tournament"].map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setFilter(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </div>
          </div>

          {/* Room List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <Badge variant={room.status === "Full" ? "secondary" : "default"}>{room.status}</Badge>
                    </div>
                    <CardDescription>Host: {room.host}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {room.players}/{room.maxPlayers} Players
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {room.createdAt}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Badge variant="outline">{room.gameType}</Badge>
                    <Button variant="secondary" size="sm" disabled={room.status === "Full"}>
                      Join
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center h-40 text-muted-foreground">
                No rooms found matching your criteria
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

