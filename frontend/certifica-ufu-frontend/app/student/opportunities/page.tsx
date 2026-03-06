"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Calendar, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { getAllOpportunities, applyToOpportunity } from '@/lib/api'; 

// Updated interface to match backend changes
interface Opportunity {
    id: string;
    title: string;
    description: string;
    hours: number;
    status: 'OPEN' | 'CLOSED' | 'FINISHED';
    startDate: string; 
    endDate: string;   
    applicants: string[]; // List of user emails who applied
}

export default function StudentOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState<string | null>(null);
    const { toast } = useToast();

    // TO DO: Replace this with your actual auth logic to get the logged-in user's email
    // Example: const { user } = useAuth();
    const currentUserEmail = "aluno@exemplo.com"; 

    useEffect(() => {
        const fetchOpportunities = async () => {
            setIsLoading(true);
            try {
                const data: Opportunity[] = await getAllOpportunities();
                // Filter only open opportunities
                setOpportunities(data.filter(opp => opp.status === 'OPEN'));
            } catch (error) {
                toast({ title: "Erro ao procurar oportunidades", variant: "destructive" });
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
            
            // Optimistic update: add current user to the applicants list locally
            setOpportunities(prev => prev.map(opp => 
                opp.id === opportunityId 
                    ? { ...opp, applicants: [...(opp.applicants || []), currentUserEmail] }
                    : opp
            ));

            toast({
                title: "Candidatura realizada!",
                description: "A sua inscrição foi registada com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro na candidatura",
                description: "Não foi possível processar o seu pedido.",
                variant: "destructive",
            });
        } finally {
            setIsApplying(null);
        }
    };

    // Helper to format ISO dates to locale string
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '--/--/----';
        return new Date(dateStr).toLocaleDateString('pt-PT');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="container mx-auto py-4 px-4 sm:px-6">
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

            <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <p className="text-gray-500 animate-pulse">A carregar oportunidades...</p>
                    </div>
                ) : opportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opp) => {
                            // Check if the current user email is in the applicants list
                            const hasApplied = opp.applicants?.includes(currentUserEmail);
                            
                            return (
                                <Card 
                                    key={opp.id} 
                                    className={`flex flex-col transition-all duration-300 ${
                                        hasApplied 
                                        ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10' 
                                        : 'hover:shadow-md'
                                    }`}
                                >
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <CardTitle className="text-lg font-bold leading-tight">
                                                {opp.title}
                                            </CardTitle>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {opp.hours}h
                                            </Badge>
                                        </div>
                                        <CardDescription className="line-clamp-3 text-sm">
                                            {opp.description}
                                        </CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent className="flex-grow space-y-4">
                                        {/* Date details section */}
                                        <div className="grid grid-cols-1 gap-2 py-3 border-y border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                                                <span className="font-medium mr-1">Início:</span> 
                                                {formatDate(opp.startDate)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4 mr-2 text-primary/70" />
                                                <span className="font-medium mr-1">Fim:</span> 
                                                {formatDate(opp.endDate)}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button 
                                            className={`w-full transition-all ${
                                                hasApplied 
                                                ? 'bg-green-600 hover:bg-green-600 cursor-default' 
                                                : ''
                                            }`}
                                            variant={hasApplied ? "default" : "default"}
                                            onClick={() => !hasApplied && handleApply(opp.id)}
                                            disabled={isApplying === opp.id || hasApplied}
                                        >
                                            {isApplying === opp.id ? (
                                                'A enviar...'
                                            ) : hasApplied ? (
                                                <span className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Já Candidatado
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Candidatar-me
                                                </span>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border shadow-sm">
                        <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Sem oportunidades disponíveis.</h2>
                        <p className="text-gray-500 mt-2">Fique atento! Novas vagas surgirão em breve.</p>
                    </div>
                )}
            </main>
        </div>
    );
}