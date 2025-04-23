"use client";

import React, { useRef, useState } from "react";
import { PlayerState } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Coins, MapPin, Dice5 } from "lucide-react";
import Dice from "react-dice-roll";
import { useRollDice } from "@/hooks/game/useRollDice";
interface GamepadProps {
  playerState: PlayerState;
  onRollDice: (value: number) => void;
  isTurn: boolean;
}

const Gamepad: React.FC<GamepadProps> = ({
  playerState,
  onRollDice,
  isTurn,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const diceRef = useRef<any>(null);
  const { rollDice } = useRollDice();

  const handleRollClick = () => {
    setIsRolling(true);
    rollDice();
    if (diceRef.current) {
      diceRef.current.rollDice();
    }
  };

  const handleDiceRollComplete = (value: number) => {
    setIsRolling(false);
    onRollDice(value);
  };

  return (
    <Card className="absolute top-4 right-4 w-72 overflow-hidden transition-all hover:shadow-lg border-primary bg-background/95 backdrop-blur shadow-xl rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

      <CardHeader className="pb-3 space-y-1 relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Game Control</CardTitle>
          <Badge variant="secondary" className="uppercase text-xs">
            Player {playerState.playerIndex}
          </Badge>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Coins className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Assets</span>
          </div>
          <Badge variant="outline" className="bg-background/80 font-mono">
            {playerState.assets}
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Position</span>
          </div>
          <Badge variant="outline" className="bg-background/80 font-mono">
            {playerState.position.x}, {playerState.position.y}
          </Badge>
        </div>

        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Home className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Houses</span>
          </div>
          <Badge variant="outline" className="bg-background/80 font-mono">
            {playerState.ownedHouses.length}
          </Badge>
        </div>

        <div className="flex justify-center py-3 bg-gradient-to-r from-background via-muted/20 to-background rounded-xl my-2">
          <Dice
            ref={diceRef}
            size={60}
            onRoll={handleDiceRollComplete}
            rollingTime={1500}
            cheatValue={6}
            faces={[
              "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-one.svg",
              "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-two.svg",
              "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-three.svg",
              "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-four.svg",
              "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-five.svg",
              "https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-six.svg",
            ]}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleRollClick}
          variant="default"
          size="lg"
          className="w-full relative overflow-hidden group"
          // disabled={isRolling || !isTurn}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out -z-10" />
          <Dice5 className="mr-2 h-5 w-5" />
          {isRolling ? "Rolling Dice..." : "Roll Dice"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Gamepad;
