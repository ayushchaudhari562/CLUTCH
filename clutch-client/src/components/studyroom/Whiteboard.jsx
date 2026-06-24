import React, { useState, useEffect, useRef } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import socket from '../../socket/socket';

const Whiteboard = ({ roomId }) => {
  const [excalidrawAPI, setExcalidraw] = useState(null);
  const isUpdatingFromSocket = useRef(false);
  const debounceTimer = useRef(null);
  ///..
  //..
  // this useEffect is for reciveing data from person B
  //..
  //..
  //..
  useEffect(() => {
    if (!excalidrawAPI) return; // Wait until Excalidraw is fully loaded

    const handleExcalidrawUpdate = (elements) => {
      isUpdatingFromSocket.current = true; // Mark update from network
      excalidrawAPI.updateScene({ elements });
    };

    socket.on("excalidraw-update", handleExcalidrawUpdate);

    return () => {
      socket.off("excalidraw-update", handleExcalidrawUpdate);
    };
  }, [excalidrawAPI]);

  const handleExcalidrawChange = (elements) => {
    // Stop the infinite loop! If the network just updated us, don't send it back.
    if (isUpdatingFromSocket.current) {
      isUpdatingFromSocket.current = false;
      return;
    }

    // Smooth Debouncing (Wait 30ms before sending to avoid crashing the server)
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      // Emit to the backend!
      socket.emit("excalidraw-update", { roomId, elements });
    }, 30);//ye imp hai for debugging
  };

  return (
    <div className="flex-1 bg-background rounded-[16px] border border-white/5 relative overflow-hidden flex flex-col shadow-none">
      <Excalidraw
        theme="dark"
        excalidrawAPI={(api) => setExcalidraw(api)}
        onChange={handleExcalidrawChange}
      />
    </div>
  );
};

export default Whiteboard;
