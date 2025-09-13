package com.achcar_solutions.easycomm_core.entities.certificate;

import lombok.Getter;

@Getter
public enum CertificateCategory {

    VISITA_TECNICA("ATCO0725", "Participação em visitas técnicas orientadas"),
    PALESTRAS_E_CURSOS("ATCO0439", "Participação como ouvinte em minicursos, cursos de extensão, oficinas, colóquios, palestras e outros"),
    PROJETOS_INSTITUCIONAIS("ATCO0706", "Participação em projetos institucionais (ex: FACOM Techweek)"),
    CURSO_DE_LINGUAS("ATCO0199", "Curso de línguas"),
    CONGRESSOS("ATC00506", "Participação em congressos"),
    PROGRAMA_EDUCACAO_TUTORIAL_PET("ATCO0753", "Participação no Programa de Educação Tutorial (PET)"),
    EMPRESA_JUNIOR("ATC00523", "Participação em empresa júnior"),
    ESTAGIO_NAO_OBRIGATORIO("ATCO0002", "Estágio não obrigatório"),
    ATIVIDADE_PROFISSIONAL("ATCO0473", "Participação em atividades profissionais"),
    INICIACAO_CIENTIFICA("ATCO0661", "Participação em Projeto de Iniciação Científica"),
    MONITORIA("ATC00077", "Atividade de monitoria em disciplinas de graduação"),
    ATIVIDADE_A_DISTANCIA("ATC00083", "Atividades Acadêmicas à Distância"),
    REPRESENTACAO_DISCENTE("ATCO1007", "Representação discente em órgãos colegiados da UFU"),
    COMPETICOES("ATCO0490", "Participação em competições culturais, artísticas ou esportivas"),
    APRESENTACAO_TRABALHO_CIENTIFICO("ATCO0043", "Apresentação de trabalhos em eventos científicos"),
    PUBLICACAO_TRABALHO_CIENTIFICO("ATCO0974", "Publicação em eventos científicos"),
    ATIVIDADES_SOCIAIS_CULTURAIS_ARTISTICAS("ATCO0120", "Atividades de natureza social, cultural e artística e em áreas afins"),
    DISCIPLINA_FACULTATIVA("ATCO0240", "Disciplina Facultativa cursada com aproveitamento"),
    NIVELAMENTO("ATCO0364", "Nivelamento (matemática e outros aprovados pelo colegiado)"),
    ATIVIDADES_HUMANISTICAS("ATCO0128", "Atividades humanísticas"),
    ORGANIZACAO_EVENTOS("ATCO0372", "Organização de Eventos Científicos, Cursos, Palestras, etc"),
    MINISTRANTE_DE_CURSO("ATC00335", "Ministrante de curso, mini curso, palestra ou oficina"),
    MARATONA_DE_PROGRAMACAO("ATCO1090", "Participação em Maratonas de Programação"),
    ESTUDOS_INDEPENDENTES("ATCO0271", "Estudos independentes"),
    LEITURAS("ATCO0304", "Leituras (acompanhada de resenha e/ou exposição oral)"),
    OUTROS("OUTROS", "Outras atividades não listadas, a critério do Colegiado");

    private final String code;
    private final String description;

    CertificateCategory(String code, String description) {
        this.code = code;
        this.description = description;
    }
}
