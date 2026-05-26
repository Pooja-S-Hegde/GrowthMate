import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
    return (
        <AuthCard
            title="Welcome back"
            description="Enter your credentials to access your account"
        >
            <LoginForm />
        </AuthCard>
    )
}
