import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useCollection } from "react-firebase-hooks/firestore"
import { useState, useEffect } from "react"
import { collection, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/firebase"

type Props = {
  id: string;
}

export default function ChatRow({ id }: Props) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [messages] = useCollection(
    collection(db, "users", session?.user?.email!, "chars", id, "messages"))

  useEffect(() => {
    if(!pathname) return

    setActive(pathname.includes(id))
  }, [id, pathname])

  const deleteChat = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id))
    router.replace("/")
  }

  return (
    <Link
      href={`/chat/${id}`}
      className={`chatRow justify-center cursor-pointer ${active && "bg-gray-700/50"}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
      <p className="flex-1 hidden md:inline-flex truncate">
        {messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"}
      </p>
      <TrashIcon onClick={deleteChat} className="h-5 w-5 text-gray-700 hover:text-red-700" />
    </Link>
  )
}
