from random import random
import time
import json
import obd
import asyncio
import websockets

from obd import Unit

debug = True
simulate = True

logs = {
    'dtc': [obd.commands.GET_DTC, 0, 0],
    'rpm': [obd.commands.RPM, 0, 8000],
    'speed': [obd.commands.SPEED, 0, 180],
    'temp': [obd.commands.COOLANT_TEMP, 0, 280],
    'fuel': [obd.commands.FUEL_LEVEL, 0, 100]
}


def init():
    obd.logger.removeHandler(obd.console_handler)
    ports = obd.scan_serial()
    conn = obd.Async(portstr=ports[0], protocol="4",
                     baudrate=38400, fast=False)
    for log in logs:
        cmd = log[0]
        conn.watch(cmd)
    conn.start()
    return conn


async def handler(websocket):
    print("Received incoming connection fron frontend...")
    percent = 0
    while True:
        try:
            if percent >= 100:
                percent = 0
            else:
                percent += 1
            data = {}
            for item in logs:
                command = logs[item][0]
                if simulate:
                    data[item] = int((percent/100) * logs[item][2])
                else:
                    if connection.supports(command):
                        data[item] = sanitize(connection.query(command).value)
                    else:
                        data[item] = 0

            if debug:
                print("Sending: ", data)
            await websocket.send(json.dumps(data))
            if simulate:
                await asyncio.sleep(0.1)
        except websockets.ConnectionClosedOK:
            break

def sanitize(x):
    if isinstance(res, Unit.Quantity):
        return res.magnitude
    try:
        res = json.dumps(x)
        return res
    except (TypeError, OverflowError):
        return str(x)

async def main():
    async with websockets.serve(handler, "", 8000):
        await asyncio.Future()  # run forever

if not simulate:
    print("Connecting to ECU...")
    connection = init()

print("Starting WebSocket Server...")
asyncio.run(main())
