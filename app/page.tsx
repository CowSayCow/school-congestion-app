import  SchoolCongestionApp from "@/components/SchoolCongestionApp"

export default async function HomePage() {
  const res = await fetch("http://localhost:8000/api/congestion", {
    cache: "no-store",
  })

  const data = await res.json()

  return <SchoolCongestionApp data={data} />
}