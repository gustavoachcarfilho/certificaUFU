"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, PlusCircle, Calendar as CalendarIcon, Clock } from 'lucide-react'
import Link from 'next/link'
import { createOpportunity } from '@/lib/api'

// Componentes do Dialog (Shadcn UI) para o fluxo de confirmação
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CreateOpportunityPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  
  // Novos estados para os campos de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  // Validação básica antes de abrir o modal de confirmação
  const validateForm = () => {
    if (!title.trim() || !description.trim() || !hours || !startDate || !endDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do formulário.",
        variant: "destructive",
      });
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Erro no cronograma",
        description: "A data de início não pode ser posterior à data de término.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Intercepta o envio para mostrar o modal
  const handleSubmitTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsConfirmOpen(true);
  };

  // Função que realiza a chamada real à API
  const handleConfirmSubmit = async () => {
    setIsConfirmOpen(false);
    setIsLoading(true);

    const opportunityData = {
      title,
      description,
      hours: Number(hours),
      startDate, // Formato string YYYY-MM-DD aceito pelo LocalDate do Spring
      endDate,   // Formato string YYYY-MM-DD aceito pelo LocalDate do Spring
    };

    try {
      await createOpportunity(opportunityData);
      toast({
        title: "Oportunidade Criada!",
        description: "A nova oportunidade já está disponível para os alunos.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao criar oportunidade",
        description: error.message || "Não foi possível salvar a oportunidade. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto py-4 px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Criar Nova Oportunidade
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle>Detalhes da Oportunidade</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para publicar uma nova atividade complementar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTrigger} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Oportunidade *</Label>
                  <Input 
                    id="title" 
                    placeholder="Ex: Monitoria de Introdução à Programação"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Detalhes sobre a vaga, requisitos e atividades..."
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="min-h-[120px]"
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Carga Horária *</Label>
                    <Input 
                      id="hours" 
                      type="number" 
                      placeholder="Ex: 40"
                      value={hours} 
                      onChange={(e) => setHours(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início *</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término *</Label>
                    <Input 
                      id="endDate" 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="flex pt-4">
                  <Button type="submit" className="w-full text-base font-semibold py-6" disabled={isLoading}>
                    {isLoading ? 'A processar...' : 'Criar Oportunidade'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Confirmação de Cadastro */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirmar Criação</DialogTitle>
            <DialogDescription className="text-sm pt-2">
              Verifique os detalhes da oportunidade antes de publicá-la para os alunos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-3 my-2 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col border-b border-gray-200 dark:border-gray-800 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Título</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Carga Horária</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{hours} horas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cronograma</span>
                <div className="flex flex-col text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  <span>De: {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : ''}</span>
                  <span>Até: {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : ''}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmOpen(false)} 
              className="flex-1"
              disabled={isLoading}
            >
              Revisar
            </Button>
            <Button 
              onClick={handleConfirmSubmit} 
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 shadow-sm"
            >
              {isLoading ? 'A criar...' : 'Confirmar e Publicar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}