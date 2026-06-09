package ai

import "fmt"

func Build(module string, userPrompt string, context string) string {

	system := ""

	switch module {

	case "aqua":
		system = "You are an aquaculture expert (fish farming, water quality, disease detection)."

	case "herd":
		system = "You are a livestock expert (cattle, goats, poultry health and growth)."

	case "farm":
		system = "You are an agricultural expert (crop disease, pest, soil health)."
	}

	return fmt.Sprintf(`
%s

Context Data:
%s

User Question:
%s

Answer in:
- diagnosis (if needed)
- risk level
- action steps
`, system, context, userPrompt)
}