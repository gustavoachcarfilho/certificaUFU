"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getOpportunityById } from '@/lib/api';
import { ArrowLeft, Users, Clock } from 'lucide-react';
import Link from 'next/link';

// Interface para os dados da Oportunidade
interface Opportunity {
    id: string;
    title: string;
    description: string;
    hours: number;
    status: 'OPEN' | 'CLOSED' | 'FINISHED';
    applicants: string[]; // Lista de emails dos candidatos
}

export default function OpportunityDetailsPage() {
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchOpportunityDetails = async () => {
                setIsLoading(true);
                try {
                    const data = await getOpportunityById(id);
                    setOpportunity(data);
                } catch (error) {
                    toast({ title: "Erro ao buscar detalhes da oportunidade", variant: "destructive" });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOpportunityDetails();
        }
    }, [id, toast]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Carregando detalhes...</div>;
    }

    if (!opportunity) {
        return <div className="flex justify-center items-center h-screen">Oportunidade não encontrada.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="container-responsive py-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar ao Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container-responsive py-6 sm:py-8">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
                        <CardDescription>{opportunity.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {opportunity.hours} horas</div>
                            <div className="flex items-center"><Users className="w-4 h-4 mr-1" /> {opportunity.applicants.length} candidato(s)</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Candidatos Inscritos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {opportunity.applicants.length > 0 ? (
                            <ul className="space-y-2">
                                {opportunity.applicants.map((applicantEmail, index) => (
                                    <li key={index} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                                        {applicantEmail}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Ainda não há candidatos para esta oportunidade.</p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}