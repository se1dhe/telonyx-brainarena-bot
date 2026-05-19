package app.telonyx.brainarena.persistence.user;

import app.telonyx.brainarena.security.telegram.TelegramUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserIdentityService {
    private final EntityManager entityManager;

    public UserIdentityService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    public TelegramAccountEntity upsertTelegramUser(TelegramUser telegramUser) {
        TelegramAccountEntity account = findTelegramAccount(telegramUser.id());

        if (account == null) {
            UserEntity user = new UserEntity(displayName(telegramUser));
            entityManager.persist(user);

            account = new TelegramAccountEntity(telegramUser.id(), user);
            applyTelegramData(account, telegramUser);
            entityManager.persist(account);
            return account;
        }

        account.getUser().setDisplayName(displayName(telegramUser));
        applyTelegramData(account, telegramUser);
        return account;
    }

    private TelegramAccountEntity findTelegramAccount(long telegramId) {
        try {
            return entityManager
                .createQuery(
                    "select account from TelegramAccountEntity account join fetch account.user where account.telegramId = :telegramId",
                    TelegramAccountEntity.class
                )
                .setParameter("telegramId", telegramId)
                .getSingleResult();
        } catch (NoResultException ignored) {
            return null;
        }
    }

    private void applyTelegramData(TelegramAccountEntity account, TelegramUser telegramUser) {
        account.setUsername(telegramUser.username());
        account.setFirstName(telegramUser.firstName());
        account.setLastName(telegramUser.lastName());
        account.setPhotoUrl(telegramUser.photoUrl());
    }

    private String displayName(TelegramUser telegramUser) {
        String fullName = String.join(" ", nonNull(telegramUser.firstName()), nonNull(telegramUser.lastName())).trim();
        if (!fullName.isBlank()) {
            return fullName;
        }

        if (telegramUser.username() != null && !telegramUser.username().isBlank()) {
            return telegramUser.username();
        }

        return "Интеллектор";
    }

    private String nonNull(String value) {
        return value == null ? "" : value;
    }
}
