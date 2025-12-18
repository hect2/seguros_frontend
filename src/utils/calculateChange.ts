interface ChangeResult {
    value: number;
    formatted: string;
    isPositive: boolean;
    today: number;
    yesterday: number;
}

export function calculateChange(today: number, yesterday: number): ChangeResult {
    // Caso sin datos
    if (today === 0 && yesterday === 0) {
        return {
            value: 0,
            formatted: '—',
            isPositive: true,
            today,
            yesterday,
        };
    }

    // Caso: ayer = 0 y hoy > 0 (nuevo crecimiento)
    if (yesterday === 0 && today > 0) {
        return {
            value: 100,
            formatted: '+100%',
            isPositive: true,
            today,
            yesterday,
        };
    }

    // Caso: hoy = 0 y ayer > 0 (caída total)
    if (today === 0 && yesterday > 0) {
        return {
            value: -100,
            formatted: '-100%',
            isPositive: false,
            today,
            yesterday,
        };
    }

    const value = ((today - yesterday) / yesterday) * 100;

    return {
        value,
        formatted: `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
        isPositive: value >= 0,
        today,
        yesterday,
    };
}
