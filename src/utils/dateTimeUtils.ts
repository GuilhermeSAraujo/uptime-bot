const formatTime = (minutes: number): string => {
	if (minutes <= 0) return "menos de 1 minuto";

	const days = Math.floor(minutes / 1440);
	const hours = Math.floor(minutes / 60);
	minutes -= hours * 60; // 60 = minutes in an hour

	let result = '';
	if (days) result += `${days} ${days <= 1 ? "dia" : "dias"} `;
	if (hours) result += `${hours} ${hours <= 1 ? "hora" : "horas"} `;
	if (minutes) result += `${minutes} ${minutes <= 1 ? "minuto" : "minutos"}`;

	return result.trim();
};

export { formatTime }