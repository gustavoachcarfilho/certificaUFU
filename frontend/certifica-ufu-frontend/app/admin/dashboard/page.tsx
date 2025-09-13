"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAllOpportunities, getPendingCertificates, validateCertificate, getCertificateViewUrl } from '@/lib/api';
import { PlusCircle, FileText, CheckCircle, XCircle, LogOut, Eye, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

// Interfaces
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
    durationInHours: number;
}

export default function AdminDashboardPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [pendingCerts, setPendingCerts] = useState<Certificate[]>([]);
    const [stats, setStats] = useState({ pending: 0, opportunities: 0 });
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [viewUrl, setViewUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [opps, certs] = await Promise.all([
                getAllOpportunities(),
                getPendingCertificates()
            ]);
            setOpportunities(opps);
            setPendingCerts(certs);
            setStats({ pending: certs.length, opportunities: opps.length });
        } catch (error) {
            toast({ title: "Erro ao carregar dados", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenReviewModal = async (cert: Certificate) => {
        setSelectedCert(cert);
        setIsModalOpen(true);
        setViewUrl(null);
        try {
            const url = await getCertificateViewUrl(cert.id);
            setViewUrl(url);
        } catch (error) {
            toast({ title: "Não foi possível carregar o documento.", variant: "destructive" });
        }
    };

    const handleValidation = async (action: 'APPROVED' | 'DENIED') => {
        if (!selectedCert) return;

        if (action === 'DENIED' && !rejectionReason.trim()) {
            toast({ title: "O motivo da rejeição é obrigatório.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await validateCertificate(selectedCert.id, action, rejectionReason);
            toast({ title: `Documento ${action === 'APPROVED' ? 'aprovado' : 'rejeitado'}!` });
            setIsModalOpen(false);
            setRejectionReason('');
            fetchData();
        } catch (error) {
            toast({ title: "Erro ao processar validação.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/');
        toast({ title: "Você saiu da sua conta." });
    };

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
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Olá, Administrador! 👋</h2>
                    <p className="text-muted-foreground">Bem-vindo(a) de volta ao seu painel.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coluna de Certificados Pendentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Certificados Pendentes</CardTitle>
                            <CardDescription>{pendingCerts.length} certificado(s) aguardando sua análise.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <p>Carregando...</p> : (
                                <div className="space-y-4">
                                    {pendingCerts.length > 0 ? pendingCerts.map((cert) => (
                                        <div key={cert.id} className="flex justify-between items-center p-4 border rounded-lg">
                                            <div>
                                                <p className="font-semibold">{cert.title}</p>
                                                <p className="text-sm text-muted-foreground">{cert.createdBy} • {cert.durationInHours}h</p>
                                            </div>
                                            <Button variant="secondary" onClick={() => handleOpenReviewModal(cert)}>
                                                Analisar
                                            </Button>
                                        </div>
                                    )) : <p>Nenhum certificado pendente.</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Coluna de Oportunidades */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Oportunidades</CardTitle>
                            <Link href="/admin/opportunities/create"><Button><PlusCircle className="w-4 h-4 mr-2" />Criar</Button></Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <p>Carregando...</p> : (
                                <div className="space-y-4">
                                    {opportunities.length > 0 ? opportunities.map((opp) => (
                                        <Link href={`/admin/opportunities/${opp.id}`} key={opp.id}>
                                            <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                                <div>
                                                    <p className="font-semibold">{opp.title}</p>
                                                    <p className="text-sm text-muted-foreground">{opp.status}</p>
                                                </div>
                                                <span className="font-bold text-primary">{opp.hours}h</span>
                                            </div>
                                        </Link>
                                    )) : <p>Nenhuma oportunidade cadastrada.</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Modal de Análise */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Analisar Certificado</DialogTitle>
                            <DialogDescription>{selectedCert?.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <a href={viewUrl || '#'} target="_blank" rel="noopener noreferrer" className={!viewUrl ? 'pointer-events-none' : ''}>
                                <Button variant="secondary" className="w-full" disabled={!viewUrl}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    {viewUrl ? 'Visualizar Documento' : 'Carregando...'}
                                </Button>
                            </a>
                            <div>
                                <Label htmlFor="rejectionReason">Motivo da Rejeição (se aplicável)</Label>
                                <Textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between">
                            <Button variant="destructive" onClick={() => handleValidation('DENIED')} disabled={isSubmitting}>
                                {isSubmitting ? 'Rejeitando...' : 'Rejeitar'}
                            </Button>
                            <div className="flex space-x-2">
                                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                                <Button onClick={() => handleValidation('APPROVED')} disabled={isSubmitting}>
                                    {isSubmitting ? 'Aprovando...' : 'Aprovar'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}