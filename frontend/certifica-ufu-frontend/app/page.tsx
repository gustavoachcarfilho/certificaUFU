import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certifica UFU</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistema de Certificação de Atividades Complementares
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
