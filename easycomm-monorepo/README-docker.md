# 🐳 Guia de Execução com Docker

## Pré-requisitos
- Docker e Docker Compose instalados
- Credenciais AWS configuradas

## 🚀 Como Executar

### 1. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais reais:
- `AWS_ACCESS_KEY_ID` - Sua chave de acesso AWS
- `AWS_SECRET_ACCESS_KEY` - Sua chave secreta AWS
- `AWS_S3_BUCKET_NAME` - Nome do bucket S3
- `API_SECURITY_TOKEN_SECRET` - Token secreto da API
- `GEMINI_API_KEY` - Chave da API Gemini (opcional)

### 2. Execute os Containers

```bash
# Inicie todos os serviços
docker-compose up -d

# Ou para ver os logs em tempo real
docker-compose up
```

### 3. Verifique os Serviços

```bash
# Visualize os containers rodando
docker-compose ps

# Visualize os logs
docker-compose logs -f certifica-ufu-api

# Verifique as variáveis de ambiente (teste)
docker-compose exec certifica-ufu-api env | grep AWS
```

### 4. Acesse a Aplicação

- **API**: http://localhost:8080
- **Processor (OCR + IA)**: http://localhost:8081
- **MongoDB**: localhost:27017
- **Kafka**: localhost:9092
- **Zookeeper**: localhost:2181

## 📦 Serviços Incluídos

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| certifica-ufu-api | 8080 | API REST principal |
| certifica-ufu-processor | 8081 | Processamento OCR e IA |
| mongodb | 27017 | Banco de dados NoSQL |
| kafka | 9092/9093 | Message broker |
| zookeeper | 2181 | Coordenador do Kafka |

## 🛠️ Comandos Úteis

```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild da imagem
docker-compose build --no-cache

# Restart de um serviço específico
docker-compose restart certifica-ufu-api
docker-compose restart certifica-ufu-processor

# Executar comando dentro do container
docker-compose exec certifica-ufu-api bash
docker-compose exec certifica-ufu-processor bash
```

## 🔍 Troubleshooting

### Container não inicia
```bash
# Veja os logs detalhados
docker-compose logs certifica-ufu-api
docker-compose logs certifica-ufu-processor

# Verifique se as portas estão em uso
netstat -ano | findstr "8080"
netstat -ano | findstr "8081"
```

### Erro de credenciais AWS
```bash
# Verifique se o .env está sendo carregado
docker-compose config

# Verifique as variáveis no container
docker-compose exec certifica-ufu-api env | grep AWS
```

### Kafka não conecta
```bash
# Verifique o health check
docker-compose ps

# Aguarde os serviços ficarem healthy
docker-compose logs kafka
```

### Processor OCR não funciona
```bash
# Verifique se o Tesseract foi instalado
docker-compose exec certifica-ufu-processor tesseract --version

# Veja logs de processamento
docker-compose logs -f certifica-ufu-processor | grep -i "ocr\|tesseract"
```

### IA (Gemini) retorna erro
```bash
# Verifique se a API Key está configurada
docker-compose exec certifica-ufu-processor env | grep GEMINI

# Veja os logs de erro da IA
docker-compose logs certifica-ufu-processor | grep -i "gemini\|error"
```

## ⚠️ Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ⚠️ O arquivo `.env` está protegido pelo `.gitignore`
- ⚠️ Use `.env.example` como referência
- ⚠️ Em produção, use secrets managers (AWS Secrets Manager, Azure Key Vault, etc.)

## 📋 Checklist de Deploy

- [ ] Copiar `.env.example` para `.env`
- [ ] Preencher credenciais AWS no `.env`
- [ ] Preencher API Key do Gemini no `.env`
- [ ] Verificar que `.env` está no `.gitignore`
- [ ] Executar `docker-compose up`
- [ ] Aguardar serviços ficarem healthy
- [ ] Testar endpoint da API (porta 8080)
- [ ] Testar endpoint do Processor (porta 8081)
- [ ] Verificar que Kafka está conectado
- [ ] Testar upload de documento para OCR
