"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { login } from '@/lib/api'
import Link from 'next/link';

// Função auxiliar para decodificar o token JWT de forma segura
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    if (!email) newErrors.email = 'Email é obrigatório';
    if (!password) newErrors.password = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      // 1. Faz o login e obtém o token
      const data = await login(email, password);
      localStorage.setItem('authToken', data.token);

      // 2. Decodifica o token para ler as informações ("claims")
      const tokenPayload = parseJwt(data.token);
      const userRole = tokenPayload?.role; // Pega a role que o backend inseriu

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) como ${userRole || 'usuário'}.`,
      });
      
      // 3. Lógica de redirecionamento baseada na role
      if (userRole === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }

    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas ou erro no servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // O JSX do formulário continua o mesmo
    <Card className="w-full shadow-xl">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>
                Digite suas credenciais para acessar
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu.email@ufu.br" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : <><LogIn className="w-4 h-4 mr-2" />Entrar</>}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
          Não tem uma conta?{' '}
          <Link href="/register" className="underline">
            Registre-se
          </Link>
        </div>
        </CardContent>
    </Card>
  )
}