import ContributorWorkflowForm from '@/components/dashboard/ContributorWorkflowForm'

export default function NewWorkflowPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">New Workflow</h1>
      <ContributorWorkflowForm />
    </div>
  )
}
