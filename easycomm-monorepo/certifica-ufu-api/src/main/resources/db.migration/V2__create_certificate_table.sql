CREATE TYPE certificate_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TYPE certificate_category AS ENUM (
    'VISITA_TECNICA',
    'PALESTRAS_E_CURSOS',
    'PROJETOS_INSTITUCIONAIS',
    'CURSO_DE_LINGUAS',
    'CONGRESSOS',
    'PROGRAMA_EDUCACAO_TUTORIAL_PET',
    'EMPRESA_JUNIOR',
    'ESTAGIO_NAO_OBRIGATORIO',
    'ATIVIDADE_PROFISSIONAL',
    'INICIACAO_CIENTIFICA',
    'MONITORIA',
    'ATIVIDADE_A_DISTANCIA',
    'REPRESENTACAO_DISCENTE',
    'COMPETICOES',
    'APRESENTACAO_TRABALHO_CIENTIFICO',
    'PUBLICACAO_TRABALHO_CIENTIFICO',
    'ATIVIDADES_SOCIAIS_CULTURAIS_ARTISTICAS',
    'DISCIPLINA_FACULTATIVA',
    'NIVELAMENTO',
    'ATIVIDADES_HUMANISTICAS',
    'ORGANIZACAO_EVENTOS',
    'MINISTRANTE_DE_CURSO',
    'MARATONA_DE_PROGRAMACAO',
    'ESTUDOS_INDEPENDENTES',
    'LEITURAS',
    'OUTROS'
);


CREATE TABLE certificates (
                              id int8 PRIMARY KEY,
                              sender_id int8 NOT NULL,
                              validator_id int8,
                              title VARCHAR(255),
                              category certificate_category NOT NULL,
                              duration_in_hours INTEGER,
                              expiration_date DATE,
                              file_url VARCHAR(2048),
                              original_filename VARCHAR(255),
                              file_type VARCHAR(100),
                              status certificate_status NOT NULL,
                              upload_timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              validation_timestamp TIMESTAMP WITHOUT TIME ZONE,
                              rejection_reason varchar(255),

                              CONSTRAINT fk_certificates_sender
                                  FOREIGN KEY (sender_id)
                                      REFERENCES authuser (id)
                                      ON DELETE CASCADE,

                              CONSTRAINT fk_certificates_validator
                                  FOREIGN KEY (validator_id)
                                      REFERENCES authuser (id)
                                      ON DELETE SET NULL
);

CREATE INDEX idx_certificates_sender_id ON certificates (sender_id);
CREATE INDEX idx_certificates_status ON certificates (status);