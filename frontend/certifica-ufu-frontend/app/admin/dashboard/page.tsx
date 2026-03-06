"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  FileText, 
  LogOut, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  AlertTriangle,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Mail,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { 
  getAllOpportunities, 
  deleteOpportunity, 
  updateOpportunity,
  getPendingCertificates, 
  validateCertificate, 
  getCertificateViewUrl, 
  getCertificateAiData 
} from '@/lib/api';

// --- Interfaces ---

/**
 * Interface representing a complementary hour opportunity
 */
interface Opportunity {
  id: string;
  title: string;
  description: string;
  hours: number;
  status: 'OPEN' | 'CLOSED' | 'FINISHED';
  startDate: string;
  endDate: string;
  applicants: string[];
}

/**
 * Interface for certificates pending analysis
 */
interface Certificate {
  id: string;
  title: string;
  createdBy: string;
  durationInHours: number;
}

/**
 * Data extracted by AI from the certificate document
 */
interface AiData {
  participantName: string | null;
  institution: string | null;
  eventDate: string | null;
  detectedWorkload: number | null;
  userWorkload: number | null;
  workloadMismatch: boolean | null;
  confidenceScore: number | null;
  processedAt: string | null;
  errorMessage: string | null;
}

export default function AdminDashboardPage() {
  // --- Dashboard Data States ---
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pendingCerts, setPendingCerts] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Certificate Review States ---
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [aiData, setAiData] = useState<AiData | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- Opportunity Management States (Applicants List) ---
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);

  // --- Edit Opportunity States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOppId, setEditingOppId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editHours, setEditHours] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // --- Delete Opportunity States ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  /**
   * Loads certificates and opportunities from the API
   */
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
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Certificate Logic ---

  /**
   * Opens the review modal and fetches document URL and AI analysis
   */
  const handleOpenReviewModal = async (cert: Certificate) => {
    setSelectedCert(cert);
    setViewUrl(null);
    setAiData(null);
    setIsCertModalOpen(true);
    
    try {
      const url = await getCertificateViewUrl(cert.id);
      setViewUrl(url);
    } catch (error) {
      toast({ title: "Erro ao carregar URL do documento", variant: "destructive" });
    }
    
    try {
      const aiInfo = await getCertificateAiData(cert.id);
      setAiData(aiInfo);
    } catch (error) {
      console.log("AI data not available for this certificate.");
    }
  };

  /**
   * Approves or denies a certificate
   */
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
      setIsCertModalOpen(false);
      setRejectionReason('');
      fetchData();
    } catch (error) {
      toast({ title: "Erro ao processar validação.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Opportunity Management Logic ---

  /**
   * Opens the delete confirmation modal
   */
  const handleOpenDeleteModal = (opp: Opportunity) => {
    setOpportunityToDelete(opp);
    setIsDeleteModalOpen(true);
  };

  /**
   * Executes the deletion via API
   */
  const handleConfirmDelete = async () => {
    if (!opportunityToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteOpportunity(opportunityToDelete.id);
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunityToDelete.id));
      toast({ title: "Oportunidade removida com sucesso!" });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({ title: "Falha ao excluir registro", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setOpportunityToDelete(null);
    }
  };

  /**
   * Opens applicants modal
   */
  const handleViewApplicants = (opportunity: Opportunity) => {
    setSelectedOpp(opportunity);
    setIsOppModalOpen(true);
  };

  /**
   * Populates and opens the edit modal
   */
  const handleOpenEditModal = (opp: Opportunity) => {
    setEditingOppId(opp.id);
    setEditTitle(opp.title);
    setEditDescription(opp.description);
    setEditHours(opp.hours.toString());
    setEditStartDate(opp.startDate || '');
    setEditEndDate(opp.endDate || '');
    setIsEditModalOpen(true);
  };

  /**
   * Updates opportunity details via API
   */
  const handleUpdateOpportunity = async () => {
    if (!editingOppId) return;
    if (!editTitle || !editDescription || !editHours || !editStartDate || !editEndDate) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        title: editTitle,
        description: editDescription,
        hours: Number(editHours),
        startDate: editStartDate,
        endDate: editEndDate
      };
      await updateOpportunity(editingOppId, updatedData);
      toast({ title: "Oportunidade atualizada!" });
      setIsEditModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro na atualização", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
    toast({ title: "Sessão encerrada." });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Certifica UFU</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-500">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Olá, Administrador! 👋</h2>
            <p className="text-muted-foreground">Gestão de certificados e vagas do sistema.</p>
          </div>
          <Link href="/admin/opportunities/create">
            <Button className="font-bold shadow-md">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Oportunidade
            </Button>
          </Link>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Certificates Column */}
          <Card className="lg:col-span-2 shadow-sm border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Certificados Pendentes</CardTitle>
                <CardDescription>Aguardando validação manual.</CardDescription>
              </div>
              <Badge variant="outline" className="ml-2 font-mono">
                {pendingCerts.length} total
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
              ) : (
                <div className="space-y-3">
                  {pendingCerts.length > 0 ? pendingCerts.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-center p-4 border rounded-xl bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{cert.title}</p>
                          <p className="text-xs text-muted-foreground">{cert.createdBy} • {cert.durationInHours}h</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleOpenReviewModal(cert)}>
                        Analisar
                      </Button>
                    </div>
                  )) : (
                    <p className="text-center py-10 text-sm text-muted-foreground italic">Tudo limpo por aqui!</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Metrics Column */}
          <div className="space-y-6">
            <Card className="shadow-sm border-none bg-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Métricas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/10 rounded-lg text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold">{pendingCerts.length}</p>
                  <p className="text-[10px] uppercase font-bold opacity-80">Pendentes</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold">{opportunities.length}</p>
                  <p className="text-[10px] uppercase font-bold opacity-80">Vagas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Opportunity List Table */}
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle>Gestão de Vagas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3 text-center">Inscritos</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{opp.title}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge 
                            variant="secondary" 
                            className="cursor-pointer font-mono px-3 py-1"
                            onClick={() => handleViewApplicants(opp)}
                          >
                            <Users className="w-3 h-3 mr-1.5" />
                            {opp.applicants?.length || 0}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={opp.status === 'OPEN' ? 'default' : 'outline'}>
                            {opp.status === 'OPEN' ? 'Aberta' : opp.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenEditModal(opp)}>
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-red-50"
                            onClick={() => handleOpenDeleteModal(opp)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* --- ALL MODALS --- */}

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="py-2">
              Tens a certeza de que desejas excluir permanentemente a oportunidade: <br />
              <span className="font-bold text-gray-900 dark:text-gray-100">"{opportunityToDelete?.title}"</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900 text-[13px] text-amber-800 dark:text-amber-400">
            Aviso: Esta ação não pode ser desfeita e todos os dados de inscritos serão removidos.
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              className="flex-1" 
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar Oportunidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Descrição</Label>
              <Textarea id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="min-h-[100px] resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Horas</Label>
                <Input type="number" value={editHours} onChange={(e) => setEditHours(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Início</Label>
                <Input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button onClick={handleUpdateOpportunity} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CERTIFICATE REVIEW MODAL */}
      <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Análise de Certificado</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <Button variant="secondary" className="w-full h-24 border-2 border-dashed" onClick={() => window.open(viewUrl || '', '_blank')} disabled={!viewUrl}>
                <Eye className="w-6 h-6 mr-2" /> {viewUrl ? 'Ver Documento' : 'A carregar...'}
              </Button>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Motivo da Rejeição</Label>
                <Textarea placeholder="Opcional se aprovado..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
              <h3 className="text-xs font-bold uppercase text-blue-600 mb-3 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> IA Análise</h3>
              {aiData ? (
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Nome:</span> {aiData.participantName || 'N/A'}</p>
                  <p><span className="text-muted-foreground">Carga:</span> <span className={aiData.workloadMismatch ? 'text-red-500 font-bold' : ''}>{aiData.detectedWorkload}h</span></p>
                  {aiData.workloadMismatch && <p className="text-[10px] text-red-500 italic">Divergência: Aluno informou {aiData.userWorkload}h</p>}
                </div>
              ) : <p className="text-xs italic text-muted-foreground">A processar dados...</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={() => handleValidation('DENIED')} disabled={isSubmitting}>Rejeitar</Button>
            <Button onClick={() => handleValidation('APPROVED')} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">Aprovar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPLICANTS MODAL */}
      <Dialog open={isOppModalOpen} onOpenChange={setIsOppModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Inscritos</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {selectedOpp?.applicants?.length ? selectedOpp.applicants.map((email, i) => (
              <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <Mail className="w-4 h-4 mr-3 text-blue-500" />
                <span className="text-sm truncate">{email}</span>
              </div>
            )) : <p className="text-center py-6 text-sm text-muted-foreground italic">Sem inscrições ainda.</p>}
          </div>
          <DialogFooter><Button onClick={() => setIsOppModalOpen(false)} className="w-full">Fechar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}