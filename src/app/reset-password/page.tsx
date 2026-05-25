import ResetPasswordForm from "@/components/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Set New Password</h1>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
