import RequestAccessForm from '@/components/auth/RequestAccessForm'

export default function RequestAccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Request Access</h1>
          <p className="text-stone-500 text-sm">
            Tell us about yourself and your ministry context. We'll send you an invite link.
          </p>
        </div>
        <RequestAccessForm />
      </div>
    </div>
  )
}
