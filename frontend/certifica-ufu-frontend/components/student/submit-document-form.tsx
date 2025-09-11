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

export function SubmitDocumentForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [workloadHours, setWorkloadHours] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const router = useRouter()
  const { toast } = useToast()

  const categories = [
    'Ensino',
    'Pesquisa',
    'Extensão',
    'Monitoria',
    'Estágio não obrigatório',
    'Atividades culturais',
    'Atividades esportivas',
    'Representação estudantil',
    'Outros'
  ]

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!title.trim()) newErrors.title = 'Título é obrigatório'
    if (!category) newErrors.category = 'Categoria é obrigatória'
    if (!workloadHours) {
      newErrors.workloadHours = 'Carga horária é obrigatória'
    } else if (isNaN(Number(workloadHours)) || Number(workloadHours) <= 0) {
      newErrors.workloadHours = 'Carga horária deve ser um número positivo'
    }
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória'
    if (!file) newErrors.file = 'Arquivo é obrigatório'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({...prev, file: 'Apenas arquivos PDF, JPG e PNG são permitidos'}))
        return
      }
      
      if (selectedFile.size > maxSize) {
        setErrors(prev => ({...prev, file: 'Arquivo deve ter no máximo 5MB'}))
        return
      }
      
      setFile(selectedFile)
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors.file
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Documento enviado com sucesso!",
        description: "Seu certificado foi enviado para análise. Você receberá uma notificação quando for avaliado.",
      })
      router.push('/student/documents')
    }, 2000)
  }

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
                Enviar Documento
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Submeta um novo certificado para análise
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Informações do Documento</span>
              </CardTitle>
              <CardDescription>
                Preencha todos os campos obrigatórios para enviar seu certificado
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
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a categoria da atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workloadHours">Carga Horária (horas) *</Label>
                  <Input
                    id="workloadHours"
                    type="number"
                    min="1"
                    placeholder="Ex: 20"
                    value={workloadHours}
                    onChange={(e) => setWorkloadHours(e.target.value)}
                    className={errors.workloadHours ? 'border-red-500' : ''}
                  />
                  {errors.workloadHours && (
                    <p className="text-sm text-red-500">{errors.workloadHours}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Atividade *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente a atividade realizada..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo do Certificado *</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    <input
                      id="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="file"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {file ? (
                          <span className="text-primary font-medium">{file.name}</span>
                        ) : (
                          <>
                            <span className="font-medium text-primary">Clique para enviar</span>
                            <span className="block">ou arraste e solte aqui</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG ou PNG (máx. 5MB)
                      </p>
                    </Label>
                  </div>
                  {errors.file && (
                    <p className="text-sm text-red-500">{errors.file}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/student/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Enviar Documento</span>
                      </div>
                    )}
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
