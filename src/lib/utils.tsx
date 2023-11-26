export const formatTimestamp = (timestamp: number) => {
	const date: Date = new Date(timestamp);

	const yearNum: number = date.getUTCFullYear();
	const monthNum: number = date.getUTCMonth() + 1;
	const dayNum: number = date.getUTCDate();


	const monthStr: string = monthNum < 10 ? '0' + monthNum : monthNum.toString();
	const dayStr: string = dayNum < 10 ? '0' + dayNum : dayNum.toString();

	const formattedDate: string = yearNum + '-' + monthStr + '-' + dayStr;

	return(formattedDate);
}