# 🔍 Script de Diagnóstico - Kafka e Processamento

Write-Host "=== DIAGNÓSTICO DO SISTEMA CERTIFICA UFU ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se todos os containers estão rodando
Write-Host "1️⃣  Verificando status dos containers..." -ForegroundColor Yellow
docker-compose ps
Write-Host ""

# 2. Verificar tópicos do Kafka
Write-Host "2️⃣  Listando tópicos do Kafka..." -ForegroundColor Yellow
docker exec certifica-kafka kafka-topics.sh --list --bootstrap-server localhost:9092
Write-Host ""

# 3. Verificar mensagens no tópico certificates-to-process
Write-Host "3️⃣  Verificando mensagens no tópico 'certificates-to-process'..." -ForegroundColor Yellow
Write-Host "(Aguarde 5 segundos...)" -ForegroundColor Gray
docker exec certifica-kafka kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic certificates-to-process --from-beginning --timeout-ms 5000
Write-Host ""

# 4. Verificar logs recentes da API
Write-Host "4️⃣  Últimas 30 linhas de log da API (procurando por 'Kafka')..." -ForegroundColor Yellow
docker logs certifica-ufu-api --tail 30 | Select-String -Pattern "kafka|Kafka|KAFKA|send|Message"
Write-Host ""

# 5. Verificar logs recentes do Processor
Write-Host "5️⃣  Últimas 30 linhas de log do Processor (procurando por 'recebida|consumer')..." -ForegroundColor Yellow
docker logs certifica-ufu-processor --tail 30 | Select-String -Pattern "recebida|consumer|Consumer|Mensagem|PROCESSADOR"
Write-Host ""

# 6. Verificar configurações de Kafka no Processor
Write-Host "6️⃣  Verificando variáveis de ambiente do Processor..." -ForegroundColor Yellow
docker exec certifica-ufu-processor env | Select-String -Pattern "KAFKA|SPRING_KAFKA"
Write-Host ""

Write-Host "=== FIM DO DIAGNÓSTICO ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Green
Write-Host "- Se não houver mensagens no tópico, a API não está enviando"
Write-Host "- Se houver mensagens mas o Processor não consome, há problema de deserialização"
Write-Host "- Verifique os logs acima para mensagens de erro"
