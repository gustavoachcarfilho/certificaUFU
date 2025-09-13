"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
// Importa as funções da API
import { getAllOpportunities, applyToOpportunity } from '@/lib/api'; 

// Interface para os dados da Oportunidade
interface Opportunity {
    id: string;
    title: string;
    description: string;
    hours: number;
    status: 'OPEN' | 'CLOSED' | 'FINISHED';
    // Adicione outros campos que desejar exibir
}

export default function StudentOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState<string | null>(null); // Controla o loading por botão
    const { toast } = useToast();

    useEffect(() => {
      const fetchOpportunities = async () => {
        setIsLoading(true);
        try {
          // Busca apenas oportunidades com status 'OPEN'
          const data: Opportunity[] = await getAllOpportunities();
          setOpportunities(data.filter(opp => opp.status === 'OPEN'));
        } catch (error) {
          toast({ title: "Erro ao buscar oportunidades", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchOpportunities();
    }, [toast]);

    const handleApply = async (opportunityId: string) => {
        setIsApplying(opportunityId);
        try {
            await applyToOpportunity(opportunityId);
            toast({
                title: "Inscrição realizada com sucesso!",
                description: "Sua candidatura foi registrada.",
            });
        } catch (error) {
            toast({
                title: "Erro na inscrição",
                description: "Não foi possível processar sua candidatura.",
                variant: "destructive",
            });
        } finally {
            setIsApplying(null);
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
                            <h1 className="text-xl sm:text-2xl font-bold">Oportunidades Abertas</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Candidate-se a novas atividades complementares
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container-responsive py-6 sm:py-8">
                {isLoading ? (
                    <p>Carregando oportunidades...</p>
                ) : opportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opp) => (
                            <Card key={opp.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span>{opp.title}</span>
                                        <span className="text-sm font-semibold text-primary whitespace-nowrap">{opp.hours}h</span>
                                    </CardTitle>
                                    <CardDescription>{opp.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-end mt-4">
                                    <Button 
                                        className="w-full"
                                        onClick={() => handleApply(opp.id)}
                                        disabled={isApplying === opp.id}
                                    >
                                        {isApplying === opp.id ? (
                                            'Enviando...'
                                        ) : (
                                            <><Send className="w-4 h-4 mr-2" />Candidatar-se</>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <h2 className="text-xl font-semibold">Nenhuma oportunidade aberta no momento.</h2>
                        <p className="text-muted-foreground mt-2">Volte mais tarde para verificar novas vagas!</p>
                    </div>
                )}
            </main>
        </div>
    );
}