"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { createOpportunity } from '@/lib/api'

export default function CreateOpportunityPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const opportunityData = {
      title,
      description,
      hours: Number(hours),
    };

    try {
      await createOpportunity(opportunityData);
      toast({
        title: "Oportunidade Criada!",
        description: "A nova oportunidade já está disponível para os alunos.",
      });
      router.push('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Erro ao criar oportunidade",
        description: "Não foi possível salvar a oportunidade. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Criar Nova Oportunidade</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Oportunidade</CardTitle>
              <CardDescription>Preencha as informações para criar uma nova oportunidade.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hours">Horas Complementares</Label>
                    <Input id="hours" type="number" value={hours} onChange={(e) => setHours(e.target.value)} required />
                </div>
                <div className="flex pt-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Criando...' : 'Criar Oportunidade'}
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}