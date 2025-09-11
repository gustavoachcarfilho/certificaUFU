"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, FileText, Eye, Calendar, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  title: string
  category: string
  workloadHours: number
  status: 'pending' | 'approved' | 'rejected'
  submissionDate: string
  reviewDate?: string
  rejectionReason?: string
}

export function MyDocuments() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const documents: Document[] = [
    {
      id: '1',
      title: 'Certificado de Curso de Python',
      category: 'Ensino',
      workloadHours: 40,
      status: 'approved',
      submissionDate: '2024-01-15',
      reviewDate: '2024-01-18'
    },
    {
      id: '2',
      title: 'Participação em Congresso de Tecnologia',
      category: 'Pesquisa',
      workloadHours: 20,
      status: 'pending',
      submissionDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Projeto de Extensão Comunitária',
      category: 'Extensão',
      workloadHours: 60,
      status: 'rejected',
      submissionDate: '2024-01-10',
      reviewDate: '2024-01-12',
      rejectionReason: 'Documento não apresenta carga horária válida. Por favor, envie um certificado com a carga horária especificada claramente.'
    },
    {
      id: '4',
      title: 'Monitoria de Algoritmos',
      category: 'Monitoria',
      workloadHours: 80,
      status: 'approved',
      submissionDate: '2024-01-05',
      reviewDate: '2024-01-08'
    },
    {
      id: '5',
      title: 'Curso de Design UX/UI',
      category: 'Ensino',
      workloadHours: 30,
      status: 'pending',
      submissionDate: '2024-01-22'
    }
  ]

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aprovado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Em análise</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejeitado</Badge>
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const totalApprovedHours = documents
    .filter(doc => doc.status === 'approved')
    .reduce((sum, doc) => sum + doc.workloadHours, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
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
                Meus Documentos
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acompanhe o status dos seus certificados
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {documents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aprovados</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {documents.filter(d => d.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Em análise</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {documents.filter(d => d.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Horas Aprovadas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalApprovedHours}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Lista de Documentos</CardTitle>
            <CardDescription>
              Clique em um documento para ver mais detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewDocument(document)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {document.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>{document.category}</span>
                          <span>•</span>
                          <span>{document.workloadHours}h</span>
                          <span>•</span>
                          <span>Enviado em {formatDate(document.submissionDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 self-start sm:self-center">
                    {getStatusBadge(document.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Detalhes do Documento</span>
              </DialogTitle>
              <DialogDescription>
                Informações completas sobre o documento selecionado
              </DialogDescription>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Título
                    </Label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedDocument.title}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedDocument.status)}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categoria
                    </Label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedDocument.category}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Carga Horária
                    </Label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {selectedDocument.workloadHours} horas
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data de Envio
                    </Label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {formatDate(selectedDocument.submissionDate)}
                    </p>
                  </div>
                  
                  {selectedDocument.reviewDate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Data de Avaliação
                      </Label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {formatDate(selectedDocument.reviewDate)}
                      </p>
                    </div>
                  )}
                </div>
                
                {selectedDocument.status === 'rejected' && selectedDocument.rejectionReason && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">
                          Motivo da Rejeição
                        </h4>
                        <p className="mt-1 text-red-700 dark:text-red-300">
                          {selectedDocument.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
