import React, { useEffect } from "react";
import Phaser from "phaser";

export const GameComponent = ({ config }) => {
  useEffect(() => {
    //create new phaser game upon component mount
    const game = new Phaser.Game(config);

    //destroy game upon component unmount
    return () => game.destroy(true);
  });

  return <div id="phaser-container" />;
};
