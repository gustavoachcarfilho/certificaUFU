"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Send } from 'lucide-react';
import Link from 'next/link';
// Importa a função da API
import { applyToOpportunity } from '@/lib/api'; 
// Assumindo que você terá uma função para buscar as oportunidades
// import { getOpportunities } from '@/lib/services/api';

// Mock de dados por enquanto
const mockOpportunities = [
    { id: '1', title: 'Workshop de Inteligência Artificial', description: 'Workshop prático sobre IA e Machine Learning.', hours: 20 },
    { id: '2', title: 'Projeto de Pesquisa em IoT', description: 'Participe de um projeto de pesquisa inovador.', hours: 40 },
    { id: '3', title: 'Monitoria de Cálculo I', description: 'Auxilie alunos com dúvidas e correção de listas.', hours: 60 },
];


export default function StudentOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState(mockOpportunities);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { toast } = useToast();

    // No futuro, você pode buscar as oportunidades da API aqui:
    // useEffect(() => {
    //   const fetchOpportunities = async () => {
    //     try {
    //       const data = await getOpportunities();
    //       setOpportunities(data);
    //     } catch (error) {
    //       toast({ title: "Erro ao buscar oportunidades", variant: "destructive" });
    //     }
    //   };
    //   fetchOpportunities();
    // }, []);

    const handleApply = async (opportunityId: string) => {
        setIsLoading(opportunityId);
        try {
            await applyToOpportunity(opportunityId);
            toast({
                title: "Inscrição realizada com sucesso!",
                description: "Você se candidatou à oportunidade.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Erro na inscrição",
                description: "Não foi possível processar sua candidatura. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="container-responsive py-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/student/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Oportunidades
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Candidate-se a novas atividades complementares
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container-responsive py-6 sm:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp) => (
                        <Card key={opp.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between">
                                    <span>{opp.title}</span>
                                    <span className="text-sm font-semibold text-primary">{opp.hours}h</span>
                                </CardTitle>
                                <CardDescription>{opp.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-end">
                                <Button 
                                    className="w-full"
                                    onClick={() => handleApply(opp.id)}
                                    disabled={isLoading === opp.id}
                                >
                                    {isLoading === opp.id ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Aplicando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Send className="w-4 h-4" />
                                            <span>Candidatar-se</span>
                                        </div>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}