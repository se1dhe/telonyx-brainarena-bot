package app.telonyx.brainarena.domain.ranked;

public class RankService {

    public String titleFor(int completedNodes, int stars) {
        if (stars >= 12) {
            return "Стратег";
        }
        if (completedNodes >= 3) {
            return "Знаток";
        }
        if (completedNodes >= 1) {
            return "Новиций";
        }
        return "Кандидат";
    }

    public String leagueFor(int skillScore) {
        if (skillScore >= 2200) {
            return "I";
        }
        if (skillScore >= 1800) {
            return "II";
        }
        if (skillScore >= 1400) {
            return "III";
        }
        return "IV";
    }

    public String winrateFor(int stars, int completedNodes) {
        if (completedNodes <= 0) {
            return "0%";
        }
        return Math.round((stars * 100.0) / (completedNodes * 3.0)) + "%";
    }

    public int calculateSkillScore(int stars, int completedNodes) {
        return 1000 + stars * 75 + completedNodes * 20;
    }
}
