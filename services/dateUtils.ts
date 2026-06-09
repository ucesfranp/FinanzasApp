// Utilities for handling dates as strings throughout the application

export function formatDateString(dateString: string, format: 'date' | 'datetime' | 'datelocale' = 'date'): string {
    if (!dateString) return '';
    
    try {
        const fecha = new Date(dateString);
        
        if (format === 'date') {
            return dateString.split('T')[0];
        } else if (format === 'datetime') {
            return fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (format === 'datelocale') {
            return fecha.toLocaleDateString('es-ES');
        }
    } catch (error) {
        console.warn('Error formatting date:', dateString, error);
    }
    
    return dateString;
}

export function getCurrentDateString(): string {
    return new Date().toISOString();
}

export function getMonthFromDateString(dateString: string): number {
    return new Date(dateString).getMonth();
}

export function getYearFromDateString(dateString: string): number {
    return new Date(dateString).getFullYear();
}
