"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getMyCertificates } from '@/lib/api';
import { LogOut, Award, Upload, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

// Função para decodificar o token
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

interface Certificate {
    status: 'APPROVED' | 'PENDING' | 'DENIED';
    durationInHours: number;
}

interface User {
    name: string;
}

export function StudentDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [approvedHours, setApprovedHours] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    const REQUIRED_HOURS = 200;

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const tokenPayload = parseJwt(token);
            setUser({ name: tokenPayload?.name || 'Aluno(a)' });
        } else {
            router.push('/');
        }

        const fetchProgress = async () => {
            setIsLoading(true);
            try {
                const certificates: Certificate[] = await getMyCertificates();
                
                // *** CORREÇÃO APLICADA AQUI ***
                // Garantimos que 'durationInHours' seja um número antes de somar.
                const totalApproved = certificates
                    .filter(cert => cert.status === 'APPROVED')
                    .reduce((sum, cert) => sum + Number(cert.durationInHours || 0), 0);
                
                setApprovedHours(totalApproved);
            } catch (error) {
                toast({ title: "Erro ao buscar progresso", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [router, toast]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/');
        toast({ title: "Você saiu da sua conta." });
    };

    const progressPercentage = (approvedHours / REQUIRED_HOURS) * 100;

    if (isLoading || !user) {
        return <div className="flex justify-center items-center h-screen">Carregando dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="container-responsive py-4 flex justify-between items-center">
                    <h1 className="text-xl sm:text-2xl font-bold">Certifica UFU</h1>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </header>

            <main className="container-responsive py-6 sm:py-8 space-y-8">
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                                    Olá, {user.name}! 👋
                                </h2>
                                <p className="text-blue-100">Bem-vindo(a) de volta ao seu painel.</p>
                            </div>
                            <Award className="w-16 h-16 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Progresso das Atividades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Horas Completadas</span>
                                <span className="text-2xl font-bold text-primary">
                                    {approvedHours} / {REQUIRED_HOURS}h
                                </span>
                            </div>
                            <Progress value={progressPercentage} className="h-3" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{progressPercentage.toFixed(1)}% concluído</span>
                                <span>{Math.max(0, REQUIRED_HOURS - approvedHours)}h restantes</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/student/submit-document">
                        <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform">
                            <CardHeader className="flex-row items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-100"><Upload className="w-6 h-6 text-blue-600" /></div>
                                <div><CardTitle>Enviar Documento</CardTitle></div>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/student/documents">
                         <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform">
                            <CardHeader className="flex-row items-center gap-4">
                                <div className="p-3 rounded-lg bg-purple-100"><FileText className="w-6 h-6 text-purple-600" /></div>
                                <div><CardTitle>Meus Documentos</CardTitle></div>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/student/opportunities">
                         <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-transform">
                            <CardHeader className="flex-row items-center gap-4">
                                <div className="p-3 rounded-lg bg-orange-100"><Calendar className="w-6 h-6 text-orange-600" /></div>
                                <div><CardTitle>Oportunidades</CardTitle></div>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </main>
        </div>
    );
}