"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Upload, FileText, Send, X } from 'lucide-react'
import Link from 'next/link'
import { createCertificate } from '@/lib/api'

// Radix/Shadcn UI Dialog components for confirmation workflow
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function SubmitDocumentForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [durationInHours, setDurationInHours] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  // Controls the visibility of the confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Categories aligned with backend Enum values
  const categories = [
    'VISITA_TECNICA', 'PALESTRAS_E_CURSOS', 'PROJETOS_INSTITUCIONAIS', 'CURSO_DE_LINGUAS', 'CONGRESSOS',
    'PROGRAMA_EDUCACAO_TUTORIAL_PET', 'EMPRESA_JUNIOR', 'ESTAGIO_NAO_OBRIGATORIO', 'ATIVIDADE_PROFISSIONAL',
    'INICIACAO_CIENTIFICA', 'MONITORIA', 'ATIVIDADE_A_DISTANCIA', 'REPRESENTACAO_DISCENTE', 'COMPETICOES',
    'APRESENTACAO_TRABALHO_CIENTIFICO', 'PUBLICACAO_TRABALHO_CIENTIFICO', 'ATIVIDADES_SOCIAIS_CULTURAIS_ARTISTICAS',
    'DISCIPLINA_FACULTATIVA', 'NIVELAMENTO', 'ATIVIDADES_HUMANISTICAS', 'ORGANIZACAO_EVENTOS',
    'MINISTRANTE_DE_CURSO', 'MARATONA_DE_PROGRAMACAO', 'ESTUDOS_INDEPENDENTES', 'LEITURAS', 'OUTROS'
  ];

  // Basic form validation before showing the confirmation dialog
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) newErrors.title = 'Título é obrigatório'
    if (!category) newErrors.category = 'Categoria é obrigatória'
    if (!durationInHours) {
      newErrors.durationInHours = 'Carga horária é obrigatória'
    } else if (isNaN(Number(durationInHours)) || Number(durationInHours) <= 0) {
      newErrors.durationInHours = 'Carga horária deve ser um número positivo'
    }
    if (!file) newErrors.file = 'Arquivo é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle file input changes and apply constraints
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 15 * 1024 * 1024; // 15MB

      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, file: 'Apenas arquivos PDF, JPG e PNG são permitidos' }));
        return;
      }

      if (selectedFile.size > maxSize) {
        setErrors(prev => ({ ...prev, file: 'Arquivo deve ter no máximo 15MB' }));
        return;
      }

      setFile(selectedFile);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      })
    }
  }

  // Triggers the confirmation modal instead of immediate submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !file) return
    setIsConfirmOpen(true)
  }

  // Final submission logic called after user confirms in the Dialog
  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false)
    setIsLoading(true)

    const certificateData = {
      title,
      category,
      durationInHours: Number(durationInHours),
    };

    try {
      // API call with the binary file and JSON metadata
      await createCertificate(certificateData, file!);

      toast({
        title: "Documento enviado com sucesso!",
        description: "Seu certificado foi enviado para análise. Você receberá uma notificação quando for avaliado.",
      });
      router.push('/student/documents');

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao enviar documento",
        description: error.message || "Não foi possível processar o envio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container-responsive py-4 px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Enviar Documento
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-fade-in shadow-md">
            <CardHeader>
              <CardTitle>Informações do Documento</CardTitle>
              <CardDescription>
                Preencha os campos para enviar seu certificado para análise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Documento *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Certificado de Curso de Python"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? 'border-red-500 ring-red-200' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-500 font-medium">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className={errors.category ? 'border-red-500 ring-red-200' : ''}>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500 font-medium">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationInHours">Carga Horária (horas) *</Label>
                  <Input
                    id="durationInHours"
                    type="number"
                    min="1"
                    placeholder="Ex: 20"
                    value={durationInHours}
                    onChange={(e) => setDurationInHours(e.target.value)}
                    className={errors.durationInHours ? 'border-red-500 ring-red-200' : ''}
                  />
                  {errors.durationInHours && <p className="text-sm text-red-500 font-medium">{errors.durationInHours}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Arquivo do Certificado *</Label>
                  <div className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${errors.file ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'}`}>
                    
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className={`absolute inset-0 w-full h-full opacity-0 ${!file ? 'cursor-pointer z-10' : 'hidden'}`}
                    />

                    {!file ? (
                      <div className="flex flex-col items-center justify-center pointer-events-none text-center p-4">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-primary">Clique para enviar</span> ou arraste o arquivo
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PDF, JPG ou PNG (máx. 15MB)</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center px-4 w-full h-full relative z-20">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mb-2">
                          <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate max-w-full px-4 mb-1">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <div className="flex gap-3 mt-4">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-8"
                            onClick={() => window.open(URL.createObjectURL(file), '_blank')}
                          >
                            Pré-visualizar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8"
                            onClick={() => {
                              setFile(null);
                              const fileInput = document.getElementById('file') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.file && <p className="text-sm text-red-500 font-medium">{errors.file}</p>}
                </div>

                <div className="flex pt-4">
                  <Button type="submit" className="w-full text-base font-semibold py-6" disabled={isLoading}>
                    {isLoading ? 'A processar...' : 'Enviar para Análise'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog showing summarized data before submission */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirmar Envio</DialogTitle>
            <DialogDescription className="text-sm pt-2 text-gray-500">
              Por favor, confirme se as informações abaixo estão corretas antes de submeter o documento para análise da coordenação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-3 my-2 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Título</span>
              <span className="text-sm font-medium text-right max-w-[200px] truncate ml-4">{title}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Categoria</span>
              <span className="text-sm font-medium text-right ml-4">{category?.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Horas</span>
              <span className="text-sm font-medium text-right ml-4">{durationInHours}h</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Arquivo</span>
              <span className="text-sm font-medium text-right max-w-[200px] truncate ml-4 text-blue-600 dark:text-blue-400">{file?.name}</span>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmOpen(false)} 
              className="flex-1"
              disabled={isLoading}
            >
              Voltar e Editar
            </Button>
            <Button 
              onClick={handleConfirmSubmit} 
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 shadow-sm"
            >
              {isLoading ? 'Enviando...' : 'Confirmar Envio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}