import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContentTab from './content-tab'
import UsersTab from './user-tab'
import ActorsTab from '@/components/actors-tab'
import GenresList from '@/components/genres-tab'
import PlanesTab from "./plans-tab"

export default function TabNavigation() {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-gray-800">
        <TabsTrigger value="content" className="text-white data-[state=active]:bg-gray-700">Contenido</TabsTrigger>
        <TabsTrigger value="users" className="text-white data-[state=active]:bg-gray-700">Usuarios</TabsTrigger>
        <TabsTrigger value="actors" className="text-white data-[state=active]:bg-gray-700">Actores</TabsTrigger>
        <TabsTrigger value="genres" className="text-white data-[state=active]:bg-gray-700">Generos</TabsTrigger>
        <TabsTrigger value="plans" className="text-white data-[state=active]:bg-gray-700">Planes</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <ContentTab />
      </TabsContent>
      <TabsContent value="users">
        <UsersTab />
      </TabsContent>
      <TabsContent value="actors">
        <ActorsTab />
      </TabsContent>
      <TabsContent value="genres">
        <GenresList />
      </TabsContent>
      <TabsContent value="plans">
        <PlanesTab />
      </TabsContent>
    </Tabs>
  )
}