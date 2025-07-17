"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { ColoredProgress } from "@/components/colored-progress"
import Image from "next/image"

export interface LocationData {
  location_name: string
  current: number
  capacity: number
  level: "low" | "medium" | "high"
  camera_id?: string
}

interface Props {
  location: LocationData
}

export function LocationCard({ location }: Props) {
  const [imgExists, setImgExists] = useState<boolean | null>(null)

  useEffect(() => {
    if (!location.camera_id) {
      setImgExists(false)
      return
    }

    const imagePath = `/${encodeURIComponent(location.camera_id)}.jpg`

    fetch(imagePath, { method: "HEAD" })
      .then((res) => setImgExists(res.ok))
      .catch(() => setImgExists(false))
  }, [location.camera_id])

  const percentage = Math.round((location.current / location.capacity) * 100)

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "hsl(210, 100%, 50%)" // 青
      case "medium":
        return "hsl(45, 100%, 50%)" // 黄
      case "high":
        return "hsl(0, 100%, 50%)" // 赤
      default:
        return "hsl(0, 0%, 50%)" // グレー
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-lg font-semibold whitespace-nowrap">
            {location.location_name}
          </CardTitle>
          <div className="flex items-center">
            {imgExists && location.camera_id && (
              <Image
                src={`/${encodeURIComponent(location.camera_id)}.jpg`}
                alt={location.location_name}
                width={140}
                height={96}
                className="rounded object-cover shadow mr-2"
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>現在の利用者数</span>
            <span className="font-semibold">
              {location.current} / {location.capacity}人
            </span>
          </div>
          <div className="relative">
            <ColoredProgress
              value={percentage}
              level={location.level}
              className="h-3"
            />
            <style jsx>{`
              .progress-bar {
                background-color: ${getCongestionColor(location.level)};
              }
            `}</style>
          </div>
          <div className="text-right text-sm text-gray-600">
            {percentage}% 利用中
          </div>
        </div>

        {location.level === "high" && (
          <div className="flex items-center text-red-600 text-sm bg-red-50 p-2 rounded">
            <AlertTriangle className="w-4 h-4 mr-2" />
            混雑しています
          </div>
        )}
      </CardContent>
    </Card>
  )
}
