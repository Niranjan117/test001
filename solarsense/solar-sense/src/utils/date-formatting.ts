export const formatDate = (data: string): string => {
    const date = new Date(data);

    // const formattedDate = date.toLocaleDateString('pl-PL'); // "DD.MM.YYYY"
    const formattedTime = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }); // "HH:mm"

    return ` ${formattedTime}`;
    // return `${formattedDate} ${formattedTime}`;
};