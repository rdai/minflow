import AcceptInviteForm from "@/components/auth/AcceptInviteForm"

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome!</h1>
          <p className="text-stone-500 text-sm">Set a password to complete your account.</p>
        </div>
        <AcceptInviteForm />
      </div>
    </div>
  )
}
