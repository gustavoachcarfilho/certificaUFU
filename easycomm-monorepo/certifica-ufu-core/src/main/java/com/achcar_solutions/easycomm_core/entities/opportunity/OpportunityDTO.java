package com.achcar_solutions.easycomm_core.entities.opportunity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OpportunityDTO(
        @Schema(description = "Title of the opportunity.", example = "Monitoria de Cálculo I")
        @NotBlank(message = "Title is required.")
        String title,

        @Schema(description = "Detailed description of the opportunity.", example = "Vaga para monitor da disciplina de Cálculo I, auxiliando alunos com dúvidas e na correção de listas.")
        @NotBlank(message = "Description is required.")
        String description,

        @Schema(description = "Number of complementary hours awarded.", example = "60")
        @NotNull(message = "Hours are required.")
        Integer hours
) {
}
