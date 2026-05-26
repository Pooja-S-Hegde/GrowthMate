import { AuthCard } from "@/components/auth/AuthCard"
import { SignupForm } from "@/components/auth/SignupForm"

export default function SignupPage() {
    return (
        <AuthCard
            title="Create account"
            description="Start your journey with GrowthMate AI today"
        >
            <SignupForm />
        </AuthCard>
    )
}
