"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, AlertTriangle } from "lucide-react"
import { ColoredProgress } from "@/components/colored-progress"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface LocationData {
  location_name: string
  current: number
  capacity: number
  level: "low" | "medium" | "high"
}

export default function SchoolCongestionApp({ data }: { data: LocationData[] }) {
  const [selectedTab, setSelectedTab] = useState("congestion")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh() // サーバーコンポーネントを再フェッチ
    }, 60000) // 1分ごと
    
    setLastUpdated(new Date().toLocaleTimeString("ja-JP"))
    return () => clearInterval(interval)
  }, [router])

  const getCongestionBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">空いている</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">やや混雑</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">混雑</Badge>
      default:
        return <Badge>不明</Badge>
    }
 }

  const getCongestionColor = (level: string) => {
   switch (level) {
     case "low":
       return "hsl(210, 100%, 50%)" // 青色
     case "medium":
       return "hsl(45, 100%, 50%)" // 黄色
     case "high":
       return "hsl(0, 100%, 50%)" // 赤色
     default:
       return "hsl(0, 0%, 50%)" // グレー
   }
 }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">学校混雑状況モニター</h1>
          <p className="text-gray-600 text-lg">リアルタイムで校内の混雑状況を確認できます</p>
        </div>

        {/* タブナビゲーション */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="congestion" className="text-base py-3">
              <Users className="w-4 h-4 mr-2" />
              混雑状況
            </TabsTrigger>
            <TabsTrigger value="map" className="text-base py-3">
              <MapPin className="w-4 h-4 mr-2" />
              校内マップ
            </TabsTrigger>
          </TabsList>

          {/* 混雑状況タブ */}
          <TabsContent value="congestion" className="space-y-6">
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {data.map((location, index) => {
                const percentage = Math.round((location.current / location.capacity) * 100)

                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">{location.location_name}</CardTitle>
                        {getCongestionBadge(location.level)}
                      </div>
                      <CardDescription className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        リアルタイム更新
                      </CardDescription>
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
                            level={location.level as "low" | "medium" | "high"}
                            className="h-3"
                          />
                          <style jsx>{`
                            .progress-bar {
                              background-color: ${getCongestionColor(location.level)};
                            }
                          `}</style>
                        </div>
                        <div className="text-right text-sm text-gray-600">{percentage}% 利用中</div>
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
              })}
            </div>

            {/* 凡例 */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">混雑レベルについて</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(210, 100%, 50%)" }}></div>
                    <div>
                      <div className="font-medium">空いている</div>
                      <div className="text-sm text-gray-600">利用率 0-50%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(45, 100%, 50%)" }}></div>
                    <div>
                      <div className="font-medium">やや混雑</div>
                      <div className="text-sm text-gray-600">利用率 51-80%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(0, 100%, 50%)" }}></div>
                    <div>
                      <div className="font-medium">混雑</div>
                      <div className="text-sm text-gray-600">利用率 81-100%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 校内マップタブ */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">校内マップ</CardTitle>
                <CardDescription>各施設の場所と現在の混雑状況を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 rounded-lg p-8 min-h-[500px] md:min-h-[600px]">
                  {/* マップのプレースホルダー */}
                  <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">学内マップ</h3>
                      <p className="text-gray-500">オープンキャンパス</p>
                    </div>
                  </div>

                  {/* マップ上の施設マーカー（サンプル） */}
                  <div className="absolute top-20 left-20">
                    <div className="bg-green-500 w-4 h-4 rounded-full animate-pulse"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">図書館</div>
                  </div>

                  <div className="absolute top-32 right-32">
                    <div className="bg-red-500 w-4 h-4 rounded-full animate-pulse"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">食堂</div>
                  </div>

                  <div className="absolute bottom-32 left-32">
                    <div className="bg-green-500 w-4 h-4 rounded-full animate-pulse"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">体育館</div>
                  </div>

                  <div className="absolute bottom-20 right-20">
                    <div className="bg-yellow-500 w-4 h-4 rounded-full animate-pulse"></div>
                    <div className="text-xs mt-1 bg-white px-2 py-1 rounded shadow">駐車場</div>
                  </div>
                </div>

                {/* マップ凡例 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">マップ凡例</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>空いている施設</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>やや混雑している施設</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>混雑している施設</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* フッター */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          {lastUpdated && (
            <p>データは自動的に更新されます • 最終更新: {lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  )
}
