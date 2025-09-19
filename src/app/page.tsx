import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to notes page (new home)
  redirect('/notes')
}
