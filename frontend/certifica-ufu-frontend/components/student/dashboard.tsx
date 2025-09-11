"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { FileText, BarChart3, Upload, Calendar, User, LogOut, Bell, Award } from 'lucide-react'
import Link from 'next/link'

export function StudentDashboard() {
  const studentName = "Maria Silva"
  const completedHours = 85
  const requiredHours = 200
  const progressPercentage = (completedHours / requiredHours) * 100

  const dashboardCards = [
    {
      title: "Enviar Documento",
      description: "Submeta um novo certificado",
      icon: Upload,
      href: "/student/submit-document",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Visão Geral",
      description: "Acompanhe seu progresso",
      icon: BarChart3,
      href: "/student/progress",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Meus Documentos",
      description: "Visualize status dos certificados",
      icon: FileText,
      href: "/student/documents",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Oportunidades",
      description: "Descubra novas atividades",
      icon: Calendar,
      href: "/student/opportunities",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Perfil",
      description: "Gerencie suas informações",
      icon: User,
      href: "/student/profile",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ]

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
                  Painel do Estudante
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
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
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Olá, {studentName}! 👋
                  </h2>
                  <p className="text-blue-100 text-base sm:text-lg">
                    Bem-vindo(a) de volta ao seu painel de atividades complementares
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Award className="w-16 h-16 sm:w-20 sm:h-20 text-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Progresso das Atividades</span>
              </CardTitle>
              <CardDescription>
                Acompanhe quantas horas você já completou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Horas Completadas
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {completedHours} / {requiredHours}h
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{progressPercentage.toFixed(1)}% concluído</span>
                  <span>{requiredHours - completedHours}h restantes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dashboardCards.map((card, index) => (
            <Link key={card.title} href={card.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer animate-fade-in group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${card.color} transition-colors duration-200`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Suas últimas submissões e atualizações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Certificado de Curso Online", status: "Aprovado", date: "2 dias atrás", hours: "20h" },
                  { title: "Participação em Evento", status: "Em análise", date: "5 dias atrás", hours: "8h" },
                  { title: "Projeto de Extensão", status: "Rejeitado", date: "1 semana atrás", hours: "40h" },
                ].map((activity, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.date} • {activity.hours}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-center ${
                      activity.status === 'Aprovado' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : activity.status === 'Em análise'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
