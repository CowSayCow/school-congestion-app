import  SchoolCongestionApp from "@/components/SchoolCongestionApp"

export default async function HomePage() {
  const res = await fetch("https://backendserver-rvp3.onrender.com/api/congestion", {
    cache: "no-store",
  })

  const data = await res.json()

  return <SchoolCongestionApp data={data} />
}