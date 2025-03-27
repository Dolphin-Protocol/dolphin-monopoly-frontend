/**
 * Enhance @mysten/sui/utils `formatAmount` with start and end.
 *
 * @param address
 * @param start Number of characters to keep from the beginning of the string.
 * @param end Number of characters to keep from the end of the string.
 * @returns Formatted address.
 */
export const shortenAddress = (address: string, start = 5, end = 3) => {
	return `${address.slice(0, start)}...${address.slice(-end)}`;
};
