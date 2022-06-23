from random import random
import time
import json
import obd
import asyncio
import websockets

debug = True

logs = {
    'dtc': obd.commands.GET_DTC,
    'rpm': obd.commands.RPM,
    'speed': obd.commands.SPEED
}

def init():
    #obd.logger.removeHandler(obd.console_handler)
    ports = obd.scan_serial()
    return obd.OBD(portstr=ports[0], protocol="4", baudrate=38400, fast=False)
 
async def handler(websocket):
    print("Received incoming connection fron frontend...")
    while True:
        try:
            data = {}
            for item in logs:
                command = logs[item]
                if debug:
                    data[item] = random() * 1000
                else:
                    if connection.supports(command):
                        data[item] = connection.query(command).value
                        
            print("Sending: ", data)
            await websocket.send(json.dumps(data))
        except websockets.ConnectionClosedOK:
            break

async def main():
    async with websockets.serve(handler, "", 8000):
        await asyncio.Future()  # run forever
    
if not debug:
    print("Connecting to ECU...")
    connection = init()

print("Starting WebSocket Server...")
asyncio.run(main())