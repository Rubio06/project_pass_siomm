export class FormUtils {
    static formatDate(dateStr: string | Date | null | undefined): string {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    static convertToISO(dateString: string): string {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }

}
