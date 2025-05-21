"use client";

import { Trophy } from "lucide-react";
import { ConnectionStatus } from "./ConnectionStatus";
import ProfilePopover from "./ProfilePopover";
import { useCustomWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LobbyHeaderProps {
	isConnecting: boolean;
	isConnected: boolean;
	suiBalance: string | null;
}

export function LobbyHeader({
	isConnecting,
	isConnected,
	suiBalance,
}: LobbyHeaderProps) {
	const { address, isConnected: walletConnected } = useCustomWallet();

	const handleFaucet = async () => {
		if (!address) return;
		try {
			const res = await fetch("https://faucet.testnet.sui.io/v1/gas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					FixedAmountRequest: { recipient: address },
				}),
			});
			if (!res.ok) throw new Error("Faucet request failed");
			toast.success("SUI Faucet received, please wait for balance update!");
		} catch (e) {
			toast.error("SUI Faucet failed: " + (e as Error).message);
		}
	};

	return (
		<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
			<div className="flex h-16 items-center justify-between py-4 w-full px-4">
				<div className="flex items-center gap-2">
					<Trophy className="h-6 w-6 text-primary" />
					<h1 className="text-xl font-bold">Monopoly Game Lobby</h1>
					<ConnectionStatus
						isConnecting={isConnecting}
						isConnected={isConnected}
					/>
				</div>

				<div className="flex items-center gap-4">
					<ProfilePopover suiBalance={suiBalance} />
					{walletConnected && (
						<Button
							size="sm"
							variant="outline"
							onClick={handleFaucet}
						>
							Get SUI Faucet
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
