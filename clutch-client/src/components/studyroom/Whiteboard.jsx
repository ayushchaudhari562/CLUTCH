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

    const handleExcalidrawUpdate = (incomingElements) => {
      isUpdatingFromSocket.current = true; 
      
      // Get the elements currently on this user's screen
      const localElements = excalidrawAPI.getSceneElements();
      
      // Create a map to combine them by ID
      const elementMap = {};
      
      // 1. Add all local elements
      localElements.forEach(el => {
        elementMap[el.id] = el;
      });
      
      // 2. Add incoming elements, keeping whoever has the higher version
      incomingElements.forEach(el => {
        const localEl = elementMap[el.id];
        if (!localEl || el.version > localEl.version) {
          elementMap[el.id] = el;
        }
      });
      
      // 3. Convert back to array and update the scene!
      const mergedElements = Object.values(elementMap);
      excalidrawAPI.updateScene({ elements: mergedElements });
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
      console.log("Emitted excalidraw-update to room:", roomId, "with elements:", elements);
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
