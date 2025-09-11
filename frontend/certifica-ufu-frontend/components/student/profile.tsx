"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, User, Save, Edit } from 'lucide-react'
import Link from 'next/link'

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Maria Silva',
    email: 'maria.silva@ufu.br',
    course: 'Ciência da Computação',
    registration: '11911BCC001',
    phone: '(34) 99999-9999',
    period: '8º período'
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const { toast } = useToast()

  const courses = [
    'Ciência da Computação',
    'Engenharia de Software',
    'Sistemas de Informação',
    'Engenharia Elétrica',
    'Engenharia Mecânica',
    'Administração',
    'Direito',
    'Medicina',
    'Outros'
  ]

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.course) newErrors.course = 'Curso é obrigatório'
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Meu Perfil
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie suas informações pessoais
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="hidden sm:flex">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Informações Pessoais</span>
              </CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Edite suas informações e clique em salvar'
                  : 'Visualize e gerencie seus dados pessoais'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {formData.name}
                      </p>
                    )}
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration">Matrícula</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-400">
                      {formData.registration}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {formData.email}
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso *</Label>
                    {isEditing ? (
                      <Select 
                        value={formData.course} 
                        onValueChange={(value) => handleInputChange('course', value)}
                      >
                        <SelectTrigger className={errors.course ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione seu curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {formData.course}
                      </p>
                    )}
                    {errors.course && (
                      <p className="text-sm text-red-500">{errors.course}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">Período</Label>
                    {isEditing ? (
                      <Input
                        id="period"
                        value={formData.period}
                        onChange={(e) => handleInputChange('period', e.target.value)}
                      />
                    ) : (
                      <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {formData.period}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {formData.phone}
                    </p>
                  )}
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSave}
                        className="flex-1 h-11 font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Salvando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="w-4 h-4" />
                            <span>Salvar Alterações</span>
                          </div>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      className="w-full sm:hidden h-11 font-medium"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
