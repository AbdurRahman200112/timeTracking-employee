import React, { useEffect, useRef, useState } from "react";
import { Button } from "@material-tailwind/react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

export function TimeTrackingComponent() {
      const dispatch = useDispatch();
      const { elapsedTime, isRunning } = useSelector((state) => state.timer);
    
      // Distinguish between paused vs. fully stopped
      const [isPaused, setIsPaused] = useState(false);
    
      // Interval for the timer
      const intervalRef = useRef(null);
    
      // Table data from backend
      const [timeEntries, setTimeEntries] = useState([]);
    
      // Reverse-geocoded city name
      const [cityName, setCityName] = useState("");
    return (

        <div className="flex items-center space-x-4">
            <Button
                onClick={() => {
                    if (!isRunning && !isPaused) {
                        handleStartWithGeo();
                    } else {
                        handleStop();
                    }
                }}
                className={`${!isRunning && !isPaused ? "bg-orange-500" : "bg-red-500"
                    } w-64 py-3 text-white rounded-full text-lg`}
            >
                {!isRunning && !isPaused ? "Start" : "Stop"}
            </Button>

            {/* Pause/Resume Icon */}
            {(isRunning || isPaused) && (
                <>
                    {isPaused ? (
                        <FaPlayCircle
                            onClick={handleResume}
                            className="text-5xl cursor-pointer text-blue-500"
                        />
                    ) : (
                        <FaPauseCircle
                            onClick={handlePause}
                            className="text-5xl cursor-pointer text-blue-500"
                        />
                    )}
                </>
            )}
        </div>

    )


}

export default TimeTrackingComponent