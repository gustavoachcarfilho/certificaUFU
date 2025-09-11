"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme-toggle'
import { useToast } from '@/hooks/use-toast'
import { FileText, Users, Clock, CheckCircle, XCircle, Calendar, Plus, Eye, LogOut, Bell, Settings } from 'lucide-react'
import Link from 'next/link'

interface PendingDocument {
  id: string
  title: string
  studentName: string
  category: string
  workloadHours: number
  submissionDate: string
  description: string
}

export function AdminDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<PendingDocument | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()

  const pendingDocuments: PendingDocument[] = [
    {
      id: '1',
      title: 'Certificado de Curso de React',
      studentName: 'João Santos',
      category: 'Ensino',
      workloadHours: 40,
      submissionDate: '2024-01-20',
      description: 'Curso completo de React com certificação da Udemy, incluindo hooks, context API e desenvolvimento de projetos práticos.'
    },
    {
      id: '2',
      title: 'Participação em Hackathon',
      studentName: 'Ana Costa',
      category: 'Pesquisa',
      workloadHours: 48,
      submissionDate: '2024-01-19',
      description: 'Participação no Hackathon UFU 2024, desenvolvendo solução para problemas urbanos com tecnologia.'
    },
    {
      id: '3',
      title: 'Projeto de Extensão - Inclusão Digital',
      studentName: 'Carlos Lima',
      category: 'Extensão',
      workloadHours: 60,
      submissionDate: '2024-01-18',
      description: 'Projeto de inclusão digital para idosos da comunidade, ensinando uso básico de computadores e internet.'
    }
  ]

  const stats = {
    totalPending: pendingDocuments.length,
    totalApproved: 45,
    totalRejected: 8,
    totalOpportunities: 12
  }

  const handleReviewDocument = (document: PendingDocument, action: 'approve' | 'reject') => {
    setSelectedDocument(document)
    setReviewAction(action)
    setIsReviewModalOpen(true)
    if (action === 'approve') {
      setRejectionReason('')
    }
  }

  const handleSubmitReview = async () => {
    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, forneça um motivo para a rejeição.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsReviewModalOpen(false)
      
      const actionText = reviewAction === 'approve' ? 'aprovado' : 'rejeitado'
      toast({
        title: `Documento ${actionText}!`,
        description: `O certificado de ${selectedDocument?.studentName} foi ${actionText} com sucesso.`,
      })
      
      setSelectedDocument(null)
      setReviewAction(null)
      setRejectionReason('')
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">C</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Certifica UFU
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Painel do Administrador
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalPending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aprovados</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalApproved}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rejeitados</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalRejected}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Oportunidades</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalOpportunities}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Documents */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Documentos Pendentes</span>
              </CardTitle>
              <CardDescription>
                Certificados aguardando sua análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {document.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {document.studentName} • {document.category} • {document.workloadHours}h
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Enviado em {formatDate(document.submissionDate)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 self-start">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewDocument(document, 'approve')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewDocument(document, 'reject')}
                        >
                          <XCircle className="w-4 h-4 mr-1 text-red-600" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manage Opportunities */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Gerenciar Oportunidades</span>
                </div>
                <Link href="/admin/opportunities/create">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nova
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Oportunidades de atividades complementares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Workshop de Inteligência Artificial', type: 'Ensino', status: 'Ativo' },
                  { title: 'Projeto de Pesquisa em IoT', type: 'Pesquisa', status: 'Ativo' },
                  { title: 'Extensão - Programação para Crianças', type: 'Extensão', status: 'Inativo' },
                  { title: 'Hackathon Universitário 2024', type: 'Pesquisa', status: 'Ativo' }
                ].map((opportunity, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {opportunity.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {opportunity.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={opportunity.status === 'Ativo' ? 'default' : 'secondary'}>
                        {opportunity.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Modal */}
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {reviewAction === 'approve' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span>
                  {reviewAction === 'approve' ? 'Aprovar' : 'Rejeitar'} Documento
                </span>
              </DialogTitle>
              <DialogDescription>
                {reviewAction === 'approve' 
                  ? 'Confirme a aprovação do documento'
                  : 'Forneça um motivo para a rejeição'
                }
              </DialogDescription>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedDocument.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Estudante: {selectedDocument.studentName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Categoria: {selectedDocument.category} • {selectedDocument.workloadHours}h
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {selectedDocument.description}
                  </p>
                </div>

                {reviewAction === 'reject' && (
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Motivo da Rejeição *</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Explique o motivo da rejeição para que o estudante possa corrigir..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsReviewModalOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    className={`flex-1 h-11 font-medium ${
                      reviewAction === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processando...</span>
                      </div>
                    ) : (
                      <span>
                        {reviewAction === 'approve' ? 'Aprovar' : 'Rejeitar'} Documento
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
