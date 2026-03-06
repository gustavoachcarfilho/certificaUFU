"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, FileText, Eye, Calendar, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getMyCertificates } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface Document {
  id: string;
  title: string;
  category: string;
  durationInHours: number;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  createdDate: string;
  validationTimestamp?: string;
  rejectionReason?: string;
}

export function MyDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchDocuments = async () => {
      try {
        const data = await getMyCertificates();
        setDocuments(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível buscar seus documentos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);
  
  if (!isClient) {
    return <p>Carregando seus documentos...</p>; 
  }

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Em análise</Badge>
      case 'DENIED':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  const totalApprovedHours = documents
    .filter(doc => doc.status === 'APPROVED')
    .reduce((sum, doc) => sum + doc.durationInHours, 0);

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
                        <h1 className="text-xl sm:text-2xl font-bold">Meus Documentos</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe o status dos seus certificados</p>
                    </div>
                </div>
            </div>
        </header>

        <main className="container-responsive py-6 sm:py-8 max-w-5xl mx-auto">
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <>
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {documents.map((document) => (
                                <div 
                                  key={document.id} 
                                  className={`flex flex-col p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${document.status === 'DENIED' ? 'border-red-200 dark:border-red-900/50' : ''}`} 
                                  onClick={() => handleViewDocument(document)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{document.title}</h3>
                                            <p className="text-sm text-muted-foreground">{document.category.replace(/_/g, ' ')} • {document.durationInHours}h • Enviado em {formatDate(document.createdDate)}</p>
                                        </div>
                                        {getStatusBadge(document.status)}
                                    </div>
                                    
                                    {document.status === 'DENIED' && document.rejectionReason && (
                                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/30 flex items-start animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-red-800 dark:text-red-300">
                                          <span className="font-semibold">Motivo da rejeição: </span>
                                          {document.rejectionReason}
                                        </div>
                                      </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              </>
            )}
        </main>
    </div>
  )
}