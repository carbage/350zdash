from random import random
import time
import json
import obd
import asyncio
import websockets

from obd import Unit

debug = False

logs = {
    'dtc': [obd.commands.GET_DTC, 0, 0],
    'rpm': [obd.commands.RPM, 0, 8000],
    'speed': [obd.commands.SPEED, 0, 180],
    'temp': [obd.commands.COOLANT_TEMP, 0, 140],
    'fuel': [obd.commands.COOLANT_TEMP, 0, 100]
}

def init():
    obd.logger.removeHandler(obd.console_handler)
    ports = obd.scan_serial()
    return obd.OBD(portstr=ports[0], protocol="4", baudrate=38400, fast=False)
 
async def handler(websocket):
    print("Received incoming connection fron frontend...")
    percent = 0
    while True:
        try:
            if percent >= 100:
                percent = 0
            else:
                percent += 5
            data = {}
            for item in logs:
                command = logs[item][0]
                if debug:
                    data[item] = int((percent/100) * logs[item][2])
                else:
                    # data[item] = str(connection.query(command).value)
                    if connection.supports(command):
                        res = connection.query(command).value
                        if isinstance(res, Unit.Quantity):
                            data[item] = res.magnitude
                        else:
                            data[item] = str(res)
                    else:
                        data[item] = str(0)

            if debug:
                print("Sending: ", data)
            await websocket.send(json.dumps(data))
            if debug:
                await asyncio.sleep(0.25)
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