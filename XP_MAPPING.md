# Mapeamento do Sistema de XP - RoutineMap

Este documento descreve as regras de pontuação e os pontos de integração para o novo sistema de XP.

## 1. Lógica de Nível (Leveling)
Atualmente o XP é apenas um número acumulado. Vamos implementar níveis:
- **XP por Nível**: `Nível * 100` (ex: Nível 1 precisa de 100 XP, Nível 2 de 200 XP, etc.) ou uma fórmula progressiva.
- **Fórmula sugerida**: `XP_Necessário = Nível * 100 * 1.2`

## 2. Regras de Pontuação (Gatilhos)

| Funcionalidade | Ação | XP Sugerido | Função no `app.js` |
| :--- | :--- | :--- | :--- |
| **Tarefas** | Completar tarefa | 10 XP | `toggleTask` |
| **Hábitos** | Marcar dia concluído | 15 XP | `toggleHabitDay` |
| **Foco** | Concluir sessão Pomodoro | 25 XP | `startTimer` (ao zerar) |
| **Metas** | Incrementar progresso | 5 XP | `incrementGoal` |
| **Metas** | Concluir meta | 100 XP | `incrementGoal` |
| **English Library** | Adicionar nova frase | 5 XP | `saveEnglishPhrase` |
| **Speaking** | Adicionar nova sessão | 20 XP | `addSpeakingSession` |
| **Roleplays** | Criar novo roleplay | 30 XP | `saveRoleplayItem` |
| **Palavras** | Adicionar nova palavra | 3 XP | `addWord` |
| **Checklist** | Marcar vídeo assistido | 10 XP | `toggleChecklistItem` |
| **Atividades Diárias** | Completar atividade | 5 XP | `toggleDailyTask` |

## 3. Feedback Visual
- **Notificação (Toast)**: "Você ganhou +10 XP!"
- **Barra de Progresso**: Adicionar uma barra de progresso de nível na sidebar ou dashboard.
- **Efeito de Level Up**: Modal ou animação quando o usuário sobe de nível.

## 4. Mudança na Persistência
- O XP não deve ser apenas calculado em tempo real, mas sim armazenado e incrementado para permitir "ganhos" históricos.
- Criar um objeto `userStats` no `localStorage`: `{ xp: 0, level: 1, totalXp: 0 }`.
