"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// Importaremos todas as funções de API necessárias
import { getAllOpportunities, getPendingCertificates, validateCertificate } from '@/lib/api'; 
import { PlusCircle, FileText, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

// Interfaces para nossos dados
interface Opportunity {
    id: string;
    title: string;
    description: string;
    hours: number;
    status: 'OPEN' | 'CLOSED' | 'FINISHED';
}

interface Certificate {
    id: string;
    title: string;
    createdBy: string;
    category: string;
    durationInHours: number;
}

export default function AdminDashboardPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [pendingCerts, setPendingCerts] = useState<Certificate[]>([]);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState<'APPROVED' | 'DENIED' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Função para buscar todos os dados iniciais do dashboard
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [opps, certs] = await Promise.all([
                getAllOpportunities(),
                getPendingCertificates()
            ]);
            setOpportunities(opps);
            setPendingCerts(certs);
        } catch (error) {
            toast({
                title: "Erro ao carregar dados do dashboard",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (cert: Certificate, certAction: 'APPROVED' | 'DENIED') => {
        setSelectedCert(cert);
        setAction(certAction);
        setIsModalOpen(true);
    };

    const handleValidation = async () => {
        if (!selectedCert || !action) return;

        if (action === 'DENIED' && !rejectionReason.trim()) {
            toast({ title: "O motivo da rejeição é obrigatório.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            await validateCertificate(selectedCert.id, action, rejectionReason);
            toast({ title: `Documento ${action === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso!` });
            setIsModalOpen(false);
            setRejectionReason('');
            fetchData(); // Recarrega os dados do dashboard
        } catch (error) {
            toast({ title: "Erro ao processar validação.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard do Administrador</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna de Certificados Pendentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Certificados Pendentes</CardTitle>
                        <CardDescription>
                            {pendingCerts.length} certificado(s) aguardando sua análise.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <p>Carregando...</p> : (
                            <div className="space-y-4">
                                {pendingCerts.length > 0 ? pendingCerts.map((cert) => (
                                    <div key={cert.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4">
                                        <div>
                                            <p className="font-semibold">{cert.title}</p>
                                            <p className="text-sm text-muted-foreground">{cert.createdBy} • {cert.durationInHours}h</p>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(cert, 'APPROVED')}>
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Aprovar
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(cert, 'DENIED')}>
                                                <XCircle className="w-4 h-4 mr-2 text-red-600" /> Rejeitar
                                            </Button>
                                        </div>
                                    </div>
                                )) : <p>Nenhum certificado pendente.</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Coluna de Oportunidades */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Oportunidades Cadastradas</CardTitle>
                            <CardDescription>
                                {opportunities.length} oportunidade(s) encontrada(s).
                            </CardDescription>
                        </div>
                        <Link href="/admin/opportunities/create">
                            <Button>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Criar
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <p>Carregando...</p> : (
                             <div className="space-y-4">
                                {opportunities.length > 0 ? opportunities.map((opp) => (
                                    <div key={opp.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <p className="font-semibold">{opp.title}</p>
                                            <p className="text-sm text-muted-foreground">{opp.status}</p>
                                        </div>
                                        <span className="font-bold text-primary">{opp.hours}h</span>
                                    </div>
                                )) : <p>Nenhuma oportunidade cadastrada.</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal de Validação (continua o mesmo) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Validar Certificado</DialogTitle>
                        <DialogDescription>
                            Você está prestes a {action === 'APPROVED' ? 'aprovar' : 'rejeitar'} o certificado: <span className="font-semibold">{selectedCert?.title}</span>
                        </DialogDescription>
                    </DialogHeader>
                    {action === 'DENIED' && (
                        <div className="grid gap-4 py-4">
                            <Label htmlFor="rejectionReason">Motivo da Rejeição</Label>
                            <Textarea 
                                id="rejectionReason" 
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Descreva o motivo para o aluno..."
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleValidation} disabled={isLoading}>
                            {isLoading ? 'Processando...' : `Confirmar`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}