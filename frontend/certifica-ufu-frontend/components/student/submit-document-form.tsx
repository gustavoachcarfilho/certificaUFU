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
import { ArrowLeft, Upload, FileText, Send } from 'lucide-react'
import Link from 'next/link'
import { createCertificate } from '@/lib/api'

export function SubmitDocumentForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [durationInHours, setDurationInHours] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const router = useRouter()
  const { toast } = useToast()

  // Use the categories from your backend enum
  const categories = [
    'VISITA_TECNICA', 'PALESTRAS_E_CURSOS', 'PROJETOS_INSTITUCIONAIS', 'CURSO_DE_LINGUAS', 'CONGRESSOS',
    'PROGRAMA_EDUCACAO_TUTORIAL_PET', 'EMPRESA_JUNIOR', 'ESTAGIO_NAO_OBRIGATORIO', 'ATIVIDADE_PROFISSIONAL',
    'INICIACAO_CIENTIFICA', 'MONITORIA', 'ATIVIDADE_A_DISTANCIA', 'REPRESENTACAO_DISCENTE', 'COMPETICOES',
    'APRESENTACAO_TRABALHO_CIENTIFICO', 'PUBLICACAO_TRABALHO_CIENTIFICO', 'ATIVIDADES_SOCIAIS_CULTURAIS_ARTISTICAS',
    'DISCIPLINA_FACULTATIVA', 'NIVELAMENTO', 'ATIVIDADES_HUMANISTICAS', 'ORGANIZACAO_EVENTOS',
    'MINISTRANTE_DE_CURSO', 'MARATONA_DE_PROGRAMACAO', 'ESTUDOS_INDEPENDENTES', 'LEITURAS', 'OUTROS'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 15 * 1024 * 1024; // 15MB
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({...prev, file: 'Apenas arquivos PDF, JPG e PNG são permitidos'}));
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setErrors(prev => ({...prev, file: 'Arquivo deve ter no máximo 15MB'}));
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.file;
        return newErrors;
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !file) return
    
    setIsLoading(true)
    
    // The createdBy field will be extracted from the token on the backend
    const certificateData = {
      title,
      category,
      durationInHours: Number(durationInHours),
      // expirationDate can be added here if needed
    };

    try {
      await createCertificate(certificateData, file);

      toast({
        title: "Documento enviado com sucesso!",
        description: "Seu certificado foi enviado para análise. Você receberá uma notificação quando for avaliado.",
      });
      // Redirect to the "My Documents" page
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
                Enviar Documento
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-fade-in">
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
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
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
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
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
                    className={errors.durationInHours ? 'border-red-500' : ''}
                  />
                  {errors.durationInHours && <p className="text-sm text-red-500">{errors.durationInHours}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo do Certificado *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className={errors.file ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500">PDF, JPG ou PNG (máx. 15MB)</p>
                  {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                </div>

                <div className="flex pt-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Documento'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}