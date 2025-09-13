"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { registerUser } from '@/lib/api';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // Estado para a role
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) {
            toast({ title: "Selecione um tipo de conta", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        // Inclui a role nos dados enviados
        const userData = { name, email, cpf, password, role };

        try {
            await registerUser(userData);
            toast({
                title: "Cadastro realizado com sucesso!",
                description: "Você já pode fazer o login.",
            });
            router.push('/');
        } catch (error: any) {
            toast({
                title: "Erro no cadastro",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                        <CardDescription>
                            Preencha os campos para se registrar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            {/* CAMPO DE SELEÇÃO DE ROLE ADICIONADO */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Tipo de Conta</Label>
                                <Select onValueChange={setRole} value={role}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Selecione o tipo de conta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Aluno</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Registrando...' : 'Registrar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <div className="text-center mt-4">
                    <Link href="/">
                        <Button variant="link">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para o Login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}