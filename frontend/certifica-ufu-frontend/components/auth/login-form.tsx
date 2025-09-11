"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{email?: string, password?: string, role?: string}>({})
  
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: {email?: string, password?: string, role?: string} = {}
    
    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    if (!role) {
      newErrors.role = 'Selecione um tipo de usuário'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) como ${role}`,
      })
      
      // Redirect based on role
      if (role === 'student') {
        router.push('/student/dashboard')
      } else {
        router.push('/admin/dashboard')
      }
    }, 1500)
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        <CardDescription>
          Digite suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@ufu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione seu tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Estudante</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 h-11 text-base font-medium transition-all duration-200 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Entrando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
