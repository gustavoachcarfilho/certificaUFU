"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getPendingCertificates, validateCertificate } from '@/lib/api';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

// Define a type for our certificate object
interface Certificate {
    id: string;
    title: string;
    createdBy: string;
    category: string;
    durationInHours: number;
    // Add other fields from your entity as needed
}

export default function AdminDashboardPage() {
    const [pendingCerts, setPendingCerts] = useState<Certificate[]>([]);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState<'APPROVED' | 'DENIED' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchPending = async () => {
        try {
            const data = await getPendingCertificates();
            setPendingCerts(data);
        } catch (error) {
            toast({ title: "Erro ao buscar documentos", variant: "destructive" });
        }
    };

    useEffect(() => {
        fetchPending();
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
            // Refresh list
            fetchPending();
        } catch (error) {
            toast({ title: "Erro ao processar validação.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard do Administrador</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Documentos Pendentes</CardTitle>
                    <CardDescription>
                        {pendingCerts.length} certificado(s) aguardando sua análise.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingCerts.map((cert) => (
                            <div key={cert.id} className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{cert.title}</p>
                                    <p className="text-sm text-muted-foreground">{cert.createdBy} • {cert.category} • {cert.durationInHours}h</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(cert, 'APPROVED')}>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Aprovar
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(cert, 'DENIED')}>
                                        <XCircle className="w-4 h-4 mr-2 text-red-600" /> Rejeitar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

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
                            {isLoading ? 'Processando...' : `Confirmar ${action === 'APPROVED' ? 'Aprovação' : 'Rejeição'}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}