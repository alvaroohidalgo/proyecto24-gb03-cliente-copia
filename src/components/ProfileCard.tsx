import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link  from "next/link"

export default function ProfileCard({apodo, imagen_avatar}:{apodo?:string, imagen_avatar?:string}) {
  return (
    <Card className="flex border-0  bg-gray-800 text-white dark:bg-gray-800">
    <Link href="/profiles" className="flex items-center justify-between py-1 px-3 h-fit space-x-3 ">
    <span className="text-xs font-bold">{apodo || ''}</span>
    <Avatar>
      <AvatarImage src={imagen_avatar} alt="Avatar"
      className="rounded-md object-cover  "/>
      
      <AvatarFallback>Avatar</AvatarFallback>
    </Avatar>
    </Link>
  </Card>
  )
}
