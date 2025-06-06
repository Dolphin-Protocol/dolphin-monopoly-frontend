"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCustomWallet } from "@/contexts/WalletContext";

interface ConnectionStatusProps {
	isConnecting: boolean;
	isConnected: boolean;
}

export function ConnectionStatus({
	isConnecting,
	isConnected,
}: ConnectionStatusProps) {
	const { isConnected: isWalletConnected } = useCustomWallet();

	if (!isWalletConnected) {
		return null;
	}

	if (isConnecting) {
		return (
			<div className="flex items-center text-yellow-500">
				<Loader2 className="h-4 w-4 mr-2 animate-spin" />
				<span className="text-xs">Connecting...</span>
			</div>
		);
	}

	if (!isConnected) {
		return (
			<div className="flex items-center text-red-500">
				<AlertCircle className="h-4 w-4 mr-2" />
				<span className="text-xs">Offline (Using Mock Data)</span>
			</div>
		);
	}

	return (
		<div className="flex items-center text-green-500">
			<Badge variant="outline" className="text-xs">
				Connected
			</Badge>
		</div>
	);
}
