import React, { useEffect, useRef, useState } from "react";
import { SWATCHES } from '@/constants';
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { url } from "inspector";

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface GeneratedResult {
    expression: string;
    answer: string;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);  //Using react hook(Refernceing) to the HTML Canvas element
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [result, setResult] = useState<GeneratedResult>();
    const [dictOfVars, setDictOfVars] = useState({});
    /*
        isDrawing - boolean state bariable to tract whether user is drawing or not
        setIsDrawing - setter function for updating the isDrawing state
        //useState - React hook used to manage state inside a functional component
    */

    useEffect( () => {
        if (reset) {
            resetCanvas();
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d'); // to get the drawing context on the canvas if it canvas and the context exits
            if (ctx) {
                canvas.width = window.innerWidth; //sets the width of the canvas element
                canvas.height = window.innerHeight - canvas.offsetTop; //sets the height of the canvas
                ctx.lineCap = 'round'; //makes the ends of the lines smooth adn rounded
                ctx.lineWidth = 3;// sets the thickness of the lines drawn on the cnavas

            }
        }
    }, []);

    const sendData = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const response = await axios({
                method: 'post',
                url: '${import.meta.env.VITE_AI_URL}/calculate',
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars,
                }
            });
            const resp = await response.data;
            console.log('Response: ', resp);
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0,0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current; //retrieves the reference to the actual canvas DOM element, allowing us to perform operations on it
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d'); // to get the drawing context on the canvas if it canvas and the context exits
            if (ctx) {
                ctx.beginPath(); //begins a new path in the canvas
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); //Is's like positiioning the pen before drawing on paper
                setIsDrawing(true); //set isDrawing to true indicating the drawing process has started
            }
        }
    }
    const stopDrawing = () => {
        setIsDrawing(false);  //sets the isDrawinf state to false 
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current; //retrieves the reference to the actual canvas DOM element, allowing us to perform operations on it
        if (canvas) {
            const ctx = canvas.getContext('2d');// to get the drawing context on the canvas if it canvas and the context exits
            if (ctx) {
                ctx.strokeStyle = color; //sets the stroke color to white
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); //draws a line to the mouse position
                ctx.stroke(); //actually renders the line on the canvas that was defined by the lineTo() 
            }
        }
    };

    return (
        <>
        <div className='grid grid-cols-3 gap-2'>
            <Button 
                onClick={() => setReset(true)}
                className='z-20 bg-black text-white'
                variant='default'
                color='black' 
            >
                Reset
            </Button>
            <Group className='z-20'>
                {SWATCHES.map((swatchColor) => (
                    <ColorSwatch
                        key={swatchColor}
                        color={swatchColor}
                        onClick={() => setColor(swatchColor)}
                    />
                ))}
            </Group>
            <Button 
                onClick={sendData}
                className='z-20 bg-black text-white'
                variant='default'
                color='black' 
            >
                Calculate
            </Button>
        </div>
        <canvas
            ref={canvasRef}
            id='canvas'
            className='absolute top-0 left-0 w-full h-full'
            onMouseDown={startDrawing}
            onMouseOut={stopDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
        />
        </>
    );
}