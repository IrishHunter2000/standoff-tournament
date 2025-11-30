import type { GamePlayerInput, ValidationResult } from "../types/types";

export const validateForm = (formData: GamePlayerInput[]): ValidationResult => {
    const errors: string[] = [];

    formData.forEach((entry, index) => {
        const rowNum = index + 1;

        if (!entry.player_id) {
            errors.push(`Row ${rowNum}: Player must be selected.`);
        }

        if (!entry.team_id) {
            errors.push(`Row ${rowNum}: Team must be selected.`);
        }

        if (
            entry.health === null ||
            entry.health < 0 ||
            entry.health > 20
        ) {
            errors.push(
                `Row ${rowNum}: Health must be between 0 and 20.`
            );
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
};
