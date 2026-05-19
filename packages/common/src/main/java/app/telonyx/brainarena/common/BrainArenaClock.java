package app.telonyx.brainarena.common;

import java.time.Clock;

public final class BrainArenaClock {
    private BrainArenaClock() {
    }

    public static Clock system() {
        return Clock.systemUTC();
    }
}
