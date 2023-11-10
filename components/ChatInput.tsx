"use client"

import { db } from "@/firebase";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react"

type Props = {
  chatId: string;
}

export default function ChatInput({ chatId }: Props) {
  const [prompt, setPrompt] = useState("")
  const { data: session } = useSession()

  // useSWR
  const model = "davinci"

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(!prompt) return

    const input = prompt.trim()
    setPrompt("")

    const message: Message = {
      text: input,
      createdAt: serverTimestamp,
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar: session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`
      }
    }

    await addDoc(
      collection(db, "users", session?.user?.email!, "chats", chatId, "messages"),
      message
    )

    // Notification

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: input, chatId, model, session
      })
    }).then(() => {
      // Notification
    })
  }

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form 
        className="p-5 space-x-5 flex"
        onSubmit={sendMessage}
      >
        <input
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          type="text"
          placeholder="Type someting here..."
        />
        <button
          disabled={!prompt || !session}
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="submit"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
        </button>
      </form>
      <div>
        {/* Model Selection */}
      </div>
    </div>
  )
}