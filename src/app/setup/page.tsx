// app/setup/page.tsx
import { Suspense } from 'react'
import UsernameSetup from './UsernameSetup' // Move your current code to UsernameSetup.tsx

export default function SetupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsernameSetup />
    </Suspense>
  )
}