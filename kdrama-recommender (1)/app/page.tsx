"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Heart, Star, Play, Sparkles, Calendar, Tv, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Drama {
  title: string
  synopsis: string
  genres: string
  rating?: number
  year?: number
  episodes?: string
  network?: string
  similarity_score?: number
}

interface RecommendationResponse {
  input_drama: Drama
  recommendations: Drama[]
  total_found: number
}

interface Stats {
  total_dramas: number
  unique_genres: number
  year_range: {
    min: number
    max: number
  }
  avg_rating: number
}

// Fallback sample data when backend is not available
const SAMPLE_DRAMAS: Drama[] = [
  { title: "Crash Landing on You", synopsis: "A South Korean heiress crash lands in North Korea and falls in love with a North Korean officer who decides to help her hide. Out of love, he helps her return to South Korea.", genres: "Romance, Drama, Comedy", rating: 8.7, year: 2019, episodes: "16", network: "tvN" },
    { title: "Goblin", synopsis: "A goblin needs a human bride to end his immortal life, but falls in love with her instead. A story about an immortal goblin and his bride.", genres: "Fantasy, Romance, Drama", rating: 8.6, year: 2016, episodes: "16", network: "tvN" },
    { title: "Descendants of the Sun", synopsis: "A love story between a soldier and a doctor, set against the backdrop of a fictional war-torn country.", genres: "Romance, Drama, Action", rating: 8.2, year: 2016, episodes: "16", network: "KBS2" },
    { title: "It's Okay to Not Be Okay", synopsis: "A psychiatric ward caregiver and a children's book author heal each other's emotional wounds.", genres: "Romance, Drama, Psychological", rating: 8.9, year: 2020, episodes: "16", network: "tvN" },
    { title: "Vincenzo", synopsis: "An Italian lawyer-mafia consigliere seeks revenge in South Korea with the help of a sharp-tongued lawyer.", genres: "Crime, Drama, Comedy", rating: 8.4, year: 2021, episodes: "20", network: "tvN" },
    { title: "Hotel del Luna", synopsis: "The CEO of Hotel del Luna, which caters to ghosts, meets a hotelier and they work together.", genres: "Fantasy, Romance, Horror", rating: 8.1, year: 2019, episodes: "16", network: "tvN" },
    { title: "Kingdom", synopsis: "A crown prince investigates a mysterious plague that turns people into zombies in medieval Korea.", genres: "Horror, Thriller, Historical", rating: 8.3, year: 2019, episodes: "12", network: "Netflix" },
    { title: "Boys Over Flowers", synopsis: "A poor girl attends an elite school and gets involved with four rich boys known as F4.", genres: "Romance, Drama, Comedy", rating: 7.8, year: 2009, episodes: "25", network: "KBS2" },
    { title: "My Love from the Star", synopsis: "An alien who has been living on Earth for 400 years falls in love with a famous actress.", genres: "Romance, Sci-Fi, Comedy", rating: 8.2, year: 2013, episodes: "21", network: "SBS" },
    { title: "Reply 1988", synopsis: "The story of five families living in the same neighborhood in 1988 Seoul.", genres: "Family, Drama, Comedy", rating: 9.0, year: 2015, episodes: "20", network: "tvN" },
    // --- Additional Sample Dramas (repeating/varying for quantity) ---
    { title: "Weightlifting Fairy Kim Bok-joo", synopsis: "A coming-of-age story about a group of college athletes, focusing on a weightlifter who falls in love.", genres: "Romance, Comedy, Sport", rating: 8.5, year: 2016, episodes: "16", network: "MBC" },
    { title: "Strong Woman Do Bong-soon", synopsis: "A young woman with superhuman strength is hired as a bodyguard for a quirky CEO.", genres: "Romance, Comedy, Action, Fantasy", rating: 8.7, year: 2017, episodes: "16", network: "JTBC" },
    { title: "Descendants of the Sun (Alt)", synopsis: "Doctors and soldiers fall in love while deployed in a disaster-stricken zone.", genres: "Romance, Action, Medical", rating: 8.2, year: 2016, episodes: "16", network: "KBS2" },
    { title: "Goblin (Alt)", synopsis: "An immortal goblin searches for his human bride to end his cursed life.", genres: "Fantasy, Romance, Drama", rating: 8.6, year: 2016, episodes: "16", network: "tvN" },
    { title: "Crash Landing on You (Alt)", synopsis: "A paragliding accident leads to an unexpected romance across borders.", genres: "Romance, Comedy, Drama", rating: 8.7, year: 2019, episodes: "16", network: "tvN" },
    { title: "The King: Eternal Monarch", synopsis: "A modern-day emperor crosses into an alternate reality where he meets a detective.", genres: "Fantasy, Romance, Drama", rating: 7.9, year: 2020, episodes: "16", network: "SBS" },
    { title: "Itaewon Class", synopsis: "A young man fights injustice and strives for success by opening a restaurant in Itaewon.", genres: "Drama, Business, Revenge", rating: 8.5, year: 2020, episodes: "16", network: "JTBC" },
    { title: "Start-Up", synopsis: "Young entrepreneurs compete to build successful startups in South Korea's fictional Silicon Valley.", genres: "Romance, Drama, Business", rating: 8.0, year: 2020, episodes: "16", network: "tvN" },
    { title: "Hospital Playlist", synopsis: "Five doctors and friends navigate their professional and personal lives at the hospital.", genres: "Medical, Slice of Life, Comedy", rating: 9.1, year: 2020, episodes: "12", network: "tvN" },
    { title: "Hometown Cha-Cha-Cha", synopsis: "A dentist moves to a seaside village and meets a charming jack-of-all-trades.", genres: "Romance, Comedy, Slice of Life", rating: 8.8, year: 2021, episodes: "16", network: "tvN" },
    { title: "Squid Game", synopsis: "A deadly game of survival offers a huge cash prize to desperate participants.", genres: "Thriller, Drama, Action", rating: 7.9, year: 2021, episodes: "9", network: "Netflix" },
    { title: "Vincenzo (Alt)", synopsis: "A former mafia lawyer seeks justice by unconventional means.", genres: "Crime, Drama, Dark Comedy", rating: 8.4, year: 2021, episodes: "20", network: "tvN" },
    { title: "Extraordinary Attorney Woo", synopsis: "A brilliant young lawyer on the autism spectrum tackles challenging cases.", genres: "Legal, Drama, Slice of Life", rating: 9.0, year: 2022, episodes: "16", network: "ENA" },
    { title: "Twenty-Five Twenty-One", synopsis: "The dreams and romance of five young people in the late 1990s.", genres: "Romance, Youth, Drama", rating: 8.7, year: 2022, episodes: "16", network: "tvN" },
    { title: "Business Proposal", synopsis: "A woman disguises herself as her friend on a blind date, only to find her boss is the suitor.", genres: "Romance, Comedy, Business", rating: 8.2, year: 2022, episodes: "12", network: "SBS" },
    { title: "Our Beloved Summer", synopsis: "A refreshing romantic comedy about a former couple who are forced to reunite for a documentary.", genres: "Romance, Comedy, Youth", rating: 8.1, year: 2021, episodes: "16", network: "SBS" },
    { title: "Doom at Your Service", synopsis: "A supernatural being makes a contract with a terminally ill woman.", genres: "Fantasy, Romance, Drama", rating: 7.8, year: 2021, episodes: "16", network: "tvN" },
    { title: "True Beauty", synopsis: "A high school girl uses makeup to hide her bare face and struggles with her self-image.", genres: "Romance, Comedy, Youth", rating: 8.5, year: 2020, episodes: "16", network: "tvN" },
    { title: "Sweet Home", synopsis: "A group of residents fight to survive as humans turn into monsters.", genres: "Horror, Thriller, Sci-Fi", rating: 7.4, year: 2020, episodes: "10", network: "Netflix" },
    { title: "Vagabond", synopsis: "A stuntman uncovers a vast conspiracy after a plane crash.", genres: "Action, Thriller, Mystery", rating: 8.0, year: 2019, episodes: "16", network: "SBS" },
    { title: "What's Wrong with Secretary Kim", synopsis: "A narcissistic vice-chairman is shocked when his highly capable secretary announces her resignation.", genres: "Romance, Comedy, Office", rating: 8.6, year: 2018, episodes: "16", network: "tvN" },
    { title: "Reply 1994", synopsis: "A group of students from different provinces live together in a boarding house in Seoul.", genres: "Family, Drama, Comedy", rating: 8.0, year: 2013, episodes: "21", network: "tvN" },
    { title: "Fight for My Way", synopsis: "Four friends with big dreams struggle to make ends meet in a realistic portrayal of youth.", genres: "Romance, Comedy, Youth", rating: 8.4, year: 2017, episodes: "16", network: "KBS2" },
    { title: "My ID Is Gangnam Beauty", synopsis: "A girl undergoes plastic surgery to gain confidence but faces unexpected challenges.", genres: "Romance, Comedy, Youth", rating: 7.7, year: 2018, episodes: "16", network: "JTBC" },
    { title: "Mr. Sunshine", synopsis: "A Korean-born American Marine Corps officer returns to Korea during the late 1800s.", genres: "Historical, Romance, Drama", rating: 8.8, year: 2018, episodes: "24", network: "tvN" },
    { title: "Descendants of the Sun (Re-run)", synopsis: "The love story of a military captain and a surgeon in a fictional war-torn country.", genres: "Romance, Action, Medical", rating: 8.2, year: 2016, episodes: "16", network: "KBS2" },
    { title: "Goblin (Re-run)", synopsis: "An immortal guardian searches for his human bride to end his cursed life.", genres: "Fantasy, Romance, Drama", rating: 8.6, year: 2016, episodes: "16", network: "tvN" },
    { title: "Crash Landing on You (Re-run)", synopsis: "A South Korean heiress crash lands in North Korea and falls in love with a North Korean officer.", genres: "Romance, Comedy, Drama", rating: 8.7, year: 2019, episodes: "16", network: "tvN" },
    { title: "The Red Sleeve", synopsis: "A historical drama about a crown prince and a court lady.", genres: "Historical, Romance, Drama", rating: 8.7, year: 2021, episodes: "17", network: "MBC" },
    { title: "Alchemy of Souls", synopsis: "A powerful sorceress's soul accidentally gets trapped in a blind woman's body.", genres: "Fantasy, Romance, Historical", rating: 8.9, year: 2022, episodes: "30", network: "tvN" },
    { title: "Signal", synopsis: "A cold case profiler and a detective from the past communicate through a mysterious walkie-talkie.", genres: "Crime, Thriller, Fantasy", rating: 9.0, year: 2016, episodes: "16", network: "tvN" },
    { title: "My Mister", synopsis: "A man in his 40s and a woman in her 20s, both enduring hardships, find solace in each other.", genres: "Drama, Slice of Life", rating: 9.1, year: 2018, episodes: "16", network: "tvN" },
    { title: "Pinocchio", synopsis: "A young journalist suffers from 'Pinocchio Syndrome' and cannot lie without hiccuping.", genres: "Romance, Drama, News", rating: 8.1, year: 2014, episodes: "20", network: "SBS" },
    { title: "W: Two Worlds Apart", synopsis: "A doctor gets pulled into the world of a webtoon and falls in love with the main character.", genres: "Fantasy, Romance, Sci-Fi", rating: 7.9, year: 2016, episodes: "16", network: "MBC" },
    { title: "Moon Lovers: Scarlet Heart Ryeo", synopsis: "A modern woman travels back in time to the Goryeo Dynasty and gets entangled in palace politics.", genres: "Historical, Romance, Fantasy", rating: 8.5, year: 2016, episodes: "20", network: "SBS" },
    { title: "Healer", synopsis: "A mysterious night courier becomes entangled with a second-rate reporter.", genres: "Action, Romance, Thriller", rating: 8.7, year: 2014, episodes: "20", network: "KBS2" },
    { title: "Because This Is My First Life", synopsis: "A witty romantic comedy about a house-sharing arrangement between a 'home-owner' and a 'tenant'.", genres: "Romance, Comedy, Slice of Life", rating: 8.3, year: 2017, episodes: "16", network: "tvN" },
    { title: "Weightlifting Fairy Kim Bok-joo (Alt)", synopsis: "A female weightlifter falls in love with a charming swimmer.", genres: "Romance, Comedy, Sport", rating: 8.5, year: 2016, episodes: "16", network: "MBC" },
    { title: "Strong Woman Do Bong-soon (Alt)", synopsis: "A super-strong girl uses her powers to protect others.", genres: "Romance, Comedy, Action", rating: 8.7, year: 2017, episodes: "16", network: "JTBC" },
    { title: "The King: Eternal Monarch (Alt)", synopsis: "A parallel universe story involving an emperor and a detective.", genres: "Fantasy, Romance, Drama", rating: 7.9, year: 2020, episodes: "16", network: "SBS" },
    { title: "Itaewon Class (Alt)", synopsis: "A young man's journey to achieve his dreams against all odds in Itaewon.", genres: "Drama, Business, Revenge", rating: 8.5, year: 2020, episodes: "16", network: "JTBC" },
    { title: "Start-Up (Alt)", synopsis: "The struggles and triumphs of young entrepreneurs in the tech industry.", genres: "Romance, Drama, Business", rating: 8.0, year: 2020, episodes: "16", network: "tvN" },
    { title: "Hospital Playlist (Alt)", synopsis: "The everyday lives of five doctors who have been friends since medical school.", genres: "Medical, Slice of Life, Comedy", rating: 9.1, year: 2020, episodes: "12", network: "tvN" },
    { title: "Hometown Cha-Cha-Cha (Alt)", synopsis: "A city dentist finds love and community in a charming seaside town.", genres: "Romance, Comedy, Slice of Life", rating: 8.8, year: 2021, episodes: "16", network: "tvN" },
    { title: "Squid Game (Alt)", synopsis: "Desperate individuals compete in deadly children's games for a massive cash prize.", genres: "Thriller, Drama, Survival", rating: 7.9, year: 2021, episodes: "9", network: "Netflix" },
    { title: "Extraordinary Attorney Woo (Alt)", synopsis: "A brilliant and endearing lawyer with autism excels in her field.", genres: "Legal, Drama, Slice of Life", rating: 9.0, year: 2022, episodes: "16", network: "ENA" },
    { title: "Twenty-Five Twenty-One (Alt)", synopsis: "A nostalgic story of first love and dreams amidst economic crisis.", genres: "Romance, Youth, Drama", rating: 8.7, year: 2022, episodes: "16", network: "tvN" },
    { title: "Business Proposal (Alt)", synopsis: "A thrilling office romance disguised as a blind date.", genres: "Romance, Comedy, Office", rating: 8.2, year: 2022, episodes: "12", network: "SBS" },
    { title: "Our Beloved Summer (Alt)", synopsis: "The bittersweet reunion of a former couple who filmed a documentary in high school.", genres: "Romance, Comedy, Youth", rating: 8.1, year: 2021, episodes: "16", network: "SBS" },
    { title: "Doom at Your Service (Alt)", synopsis: "A fantasy romance between a god of destruction and a human woman.", genres: "Fantasy, Romance, Drama", rating: 7.8, year: 2021, episodes: "16", network: "tvN" },
    { title: "True Beauty (Alt)", synopsis: "A popular girl hides her bare face behind makeup.", genres: "Romance, Comedy, Youth", rating: 8.5, year: 2020, episodes: "16", network: "tvN" },
    { title: "Sweet Home (Alt)", synopsis: "Residents battle horrifying monsters and their inner demons.", genres: "Horror, Thriller, Sci-Fi", rating: 7.4, year: 2020, episodes: "10", network: "Netflix" },
    { title: "Vagabond (Alt)", synopsis: "A man uncovers a massive corruption scandal after a mysterious plane crash.", genres: "Action, Thriller, Espionage", rating: 8.0, year: 2019, episodes: "16", network: "SBS" },
    { title: "What's Wrong with Secretary Kim (Alt)", synopsis: "A charismatic CEO and his indispensable secretary navigate their complex relationship.", genres: "Romance, Comedy, Office", rating: 8.6, year: 2018, episodes: "16", network: "tvN" },
    { title: "Reply 1994 (Alt)", synopsis: "A nostalgic look at the lives of college students living in a boarding house.", genres: "Family, Drama, Comedy", rating: 8.0, year: 2013, episodes: "21", network: "tvN" },
    { title: "Fight for My Way (Alt)", synopsis: "Four friends chase their dreams despite societal expectations and personal struggles.", genres: "Romance, Comedy, Youth", rating: 8.4, year: 2017, episodes: "16", network: "KBS2" },
    { title: "My ID Is Gangnam Beauty (Alt)", synopsis: "A young woman navigates life after extensive plastic surgery.", genres: "Romance, Comedy, Youth", rating: 7.7, year: 2018, episodes: "16", network: "JTBC" },
    { title: "Mr. Sunshine (Alt)", synopsis: "A love story set during the turbulent late 19th century in Korea.", genres: "Historical, Romance, Drama", rating: 8.8, year: 2018, episodes: "24", network: "tvN" },
    { title: "The Red Sleeve (Alt)", synopsis: "A poignant royal romance between a King and a court lady.", genres: "Historical, Romance, Drama", rating: 8.7, year: 2021, episodes: "17", network: "MBC" },
    { title: "Alchemy of Souls (Alt)", synopsis: "A fantastical tale of mages, forbidden spells, and changing destinies.", genres: "Fantasy, Romance, Historical", rating: 8.9, year: 2022, episodes: "30", network: "tvN" },
    { title: "Signal (Alt)", synopsis: "Detectives from different timelines work together to solve crimes.", genres: "Crime, Thriller, Sci-Fi", rating: 9.0, year: 2016, episodes: "16", network: "tvN" },
    { title: "My Mister (Alt)", synopsis: "Two individuals from different walks of life find comfort and understanding in each other.", genres: "Drama, Slice of Life, Healing", rating: 9.1, year: 2018, episodes: "16", network: "tvN" },
    { title: "Pinocchio (Alt)", synopsis: "A journalist whose honesty is forced by a unique condition.", genres: "Romance, Drama, News", rating: 8.1, year: 2014, episodes: "20", network: "SBS" },
    { title: "W: Two Worlds Apart (Alt)", synopsis: "A cross-dimensional romance between a real-world doctor and a webtoon character.", genres: "Fantasy, Romance, Thriller", rating: 7.9, year: 2016, episodes: "16", network: "MBC" },
    { title: "Moon Lovers: Scarlet Heart Ryeo (Alt)", synopsis: "A woman travels back to the Goryeo Dynasty and becomes involved with royal princes.", genres: "Historical, Romance, Fantasy", rating: 8.5, year: 2016, episodes: "20", network: "SBS" },
    { title: "Healer (Alt)", synopsis: "A mysterious 'night courier' and a reporter uncover a past conspiracy.", genres: "Action, Romance, Thriller", rating: 8.7, year: 2014, episodes: "20", network: "KBS2" },
    { title: "Because This Is My First Life (Alt)", synopsis: "A unique romance blossoms between a non-romantic homeowner and a homeless tenant.", genres: "Romance, Comedy, Slice of Life", rating: 8.3, year: 2017, episodes: "16", network: "tvN" },

]

const SAMPLE_STATS: Stats = {
  total_dramas: 250,
  unique_genres: 15,
  year_range: { min: 2005, max: 2024 },
  avg_rating: 8.1,
}

export default function KDramaRecommender() {
  const [dramas, setDramas] = useState<Drama[]>(SAMPLE_DRAMAS)
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null)
  const [recommendations, setRecommendations] = useState<Drama[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState<Stats>(SAMPLE_STATS)
  const [backendConnected, setBackendConnected] = useState(false)
  const [usingFallback, setUsingFallback] = useState(true)

  // Load initial data on component mount
  useEffect(() => {
    checkBackendConnection()
  }, [])

  // Search dramas when search term changes
  useEffect(() => {
    if (backendConnected) {
      if (searchTerm.length > 2) {
        searchDramas(searchTerm)
      } else if (searchTerm.length === 0) {
        loadInitialDramas()
      }
    } else {
      // Use local filtering for sample data
      const filtered = SAMPLE_DRAMAS.filter((drama) => drama.title.toLowerCase().includes(searchTerm.toLowerCase()))
      setDramas(filtered)
    }
  }, [searchTerm, backendConnected])

  const checkBackendConnection = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const response = await fetch("http://localhost:5000/api/stats", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
        setBackendConnected(true)
        setUsingFallback(false)
        loadInitialDramas()
      }
    } catch (err) {
      console.log("Backend not available, using sample data")
      setBackendConnected(false)
      setUsingFallback(true)
      // Keep using sample data
    }
  }

  const loadInitialDramas = async () => {
    if (!backendConnected) return

    try {
      const response = await fetch("http://localhost:5000/api/dramas")
      if (response.ok) {
        const data = await response.json()
        setDramas(data.slice(0, 50))
        setUsingFallback(false)
      }
    } catch (err) {
      console.error("Failed to fetch dramas:", err)
      setUsingFallback(true)
    }
  }

  const searchDramas = async (query: string) => {
    if (!backendConnected) return

    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setDramas(data)
      }
    } catch (err) {
      console.error("Search failed:", err)
    }
  }

  const getRecommendations = async (title: string) => {
    setLoading(true)
    setError("")

    if (!backendConnected) {
      // Simulate recommendations with sample data
      setTimeout(() => {
        const currentDrama = dramas.find((d) => d.title === title)
        if (currentDrama) {
          setSelectedDrama(currentDrama)
          // Simple genre-based recommendations for demo
          const sampleRecs = SAMPLE_DRAMAS.filter((d) => d.title !== title)
            .filter((d) => {
              const currentGenres = currentDrama.genres.toLowerCase()
              const dramaGenres = d.genres.toLowerCase()
              return currentGenres.split(",").some((genre) => dramaGenres.includes(genre.trim()))
            })
            .slice(0, 5)
            .map((drama, index) => ({
              ...drama,
              similarity_score: 0.9 - index * 0.05, // Mock similarity scores
            }))

          setRecommendations(sampleRecs)
        }
        setLoading(false)
      }, 1000)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        const data: RecommendationResponse = await response.json()
        setRecommendations(data.recommendations)
        setSelectedDrama(data.input_drama)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to get recommendations")
        if (errorData.suggestions && errorData.suggestions.length > 0) {
          setError(`${errorData.error}. Did you mean: ${errorData.suggestions.slice(0, 3).join(", ")}?`)
        }
        setRecommendations([])
      }
    } catch (err) {
      setError("Failed to connect to backend. Using sample recommendations.")
      // Fallback to sample recommendations
      const currentDrama = dramas.find((d) => d.title === title)
      if (currentDrama) {
        setSelectedDrama(currentDrama)
        const sampleRecs = SAMPLE_DRAMAS.filter((d) => d.title !== title)
          .slice(0, 10)
          .map((drama, index) => ({
            ...drama,
            similarity_score: 0.8 - index * 0.05,
          }))
        setRecommendations(sampleRecs)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatRating = (rating: number | undefined) => {
    if (!rating) return "N/A"
    return rating.toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  K-Drama Finder
                </h1>
                <p className="text-sm text-gray-600">
                  {stats ? `${stats.total_dramas} dramas available` : "Loading..."}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="text-sm text-gray-600">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      {stats && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-pink-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Tv className="w-4 h-4" />
                <span>{stats.total_dramas} Dramas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {stats.year_range.min} - {stats.year_range.max}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Avg Rating: {stats.avg_rating}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Find Your Perfect
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block">
                K-Drama Match
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing Korean dramas similar to the ones you already love. Our AI analyzes{" "}
              {stats?.total_dramas || "hundreds of"} dramas to find the perfect match for your taste!
            </p>

            {/* Hero Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/kdrama-collage.png" alt="K-Drama Collection" fill className="object-cover" />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/kdrama-grid.png" alt="Popular K-Dramas" fill className="object-cover" />
              </div>
              <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/kdrama-posters.png" alt="K-Drama Posters" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Drama Selection */}
          <Card className="bg-white/70 backdrop-blur-sm border-pink-100 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Choose Your Favorite Drama</span>
              </CardTitle>
              <CardDescription className="text-pink-100">
                Search and select a K-drama you love to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search for a K-drama... (e.g., Crash Landing on You)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-pink-200 focus:border-pink-400"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {dramas.length === 0 && searchTerm.length > 0 ? (
                    <div className="text-center py-8 text-gray-500">No dramas found matching "{searchTerm}"</div>
                  ) : (
                    dramas.map((drama) => (
                      <div
                        key={drama.title}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedDrama?.title === drama.title
                            ? "border-pink-400 bg-pink-50"
                            : "border-gray-200 hover:border-pink-300 hover:bg-pink-25"
                        }`}
                        onClick={() => getRecommendations(drama.title)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-800">{drama.title}</h3>
                              {drama.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600">{formatRating(drama.rating)}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{drama.synopsis}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                {drama.genres}
                              </Badge>
                              {drama.year && (
                                <Badge variant="outline" className="text-xs">
                                  {drama.year}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Play className="w-5 h-5 text-pink-500 ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/70 backdrop-blur-sm border-purple-100 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Recommended For You</span>
              </CardTitle>
              <CardDescription className="text-purple-100">
                {selectedDrama ? `Based on "${selectedDrama.title}"` : "Select a drama to see recommendations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <span className="ml-3 text-gray-600">Finding perfect matches...</span>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((drama, index) => (
                    <div
                      key={drama.title}
                      className="p-4 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-25 to-indigo-25 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-800">{drama.title}</h3>
                            <div className="flex items-center space-x-2">
                              {drama.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-600">{formatRating(drama.rating)}</span>
                                </div>
                              )}
                              {drama.similarity_score && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(drama.similarity_score * 100)}% match
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{drama.synopsis}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                              {drama.genres}
                            </Badge>
                            {drama.year && (
                              <Badge variant="outline" className="text-xs">
                                {drama.year}
                              </Badge>
                            )}
                            {drama.network && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                {drama.network}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Select a K-drama to discover similar shows!</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Our AI analyzes plot, genre, cast, and themes to find perfect matches
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card id="instructions" className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                    1
                  </div>
                  <p>Search or browse through {stats?.total_dramas || "available"} K-dramas</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                    2
                  </div>
                  <p>Click on a drama you've watched and enjoyed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                    3
                  </div>
                  <p>Get AI-powered recommendations with similarity scores!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-pink-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Made with <Heart className="w-4 h-4 text-pink-500 inline mx-1" /> for K-drama lovers
          </p>
          <p className="text-sm text-gray-500 mt-2">
            AI-powered recommendations • {stats?.total_dramas || "Many"} dramas analyzed
          </p>
        </div>
      </footer>
    </div>
  )
}
