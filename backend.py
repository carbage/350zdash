from random import random
from sqlite3 import connect
import time
import json
import obd
import asyncio
import websockets

from obd import Unit

debug = True
simulate = True

connection = None

pids = {
    'dtc': [obd.commands.GET_DTC, 0, 0],
    'rpm': [obd.commands.RPM, 0, 8000],
    'speed': [obd.commands.SPEED, 0, 180],
    'temp': [obd.commands.COOLANT_TEMP, 0, 280],
    'fuel': [obd.commands.FUEL_LEVEL, 0, 100]
}

def init():
    if not debug:
        obd.logger.removeHandler(obd.console_handler)
    ports = obd.scan_serial()
    if debug:
        print(ports)
    if len(ports) > 0:
        conn = obd.Async(protocol="4",
                         baudrate=38400, fast=False)
        if conn.is_connected:
            for pid in pids:
                cmd = pid[0]
                conn.watch(cmd)
            conn.start()
            return conn
    else:
        print("No OBD device found!")
    exit()


async def handler(websocket):
    print("Received incoming connection fron frontend...")
    global connection
    percent = 0
    while True:
        # Connect to ECU and retry if unavailable
        if not simulate and (connection == None or not connection.is_connected):
            print("No connection to ECU, attempting to connect...")
            connection = init()

        try:
            # Increment/reset percentage to use in data simulation
            if percent >= 100:
                percent = 0
            else:
                percent += 1
            data = {}
            for pid in pids:
                command = pids[pid][0]
                if simulate:
                    # Populate data with percentage of max value
                    data[pid] = int((percent/100) * pids[pid][2])
                else:
                    # Confirm command is supported before sanitizing and storing in payload
                    if connection.supports(command):
                        data[pid] = sanitize(connection.query(command).value)
                    else:
                        # Populate payload with null placeholder
                        data[pid] = None

            if debug:
                print("Sending: ", data)
            # Send data payload to frontend websocket
            await websocket.send(json.dumps(data))
            # Add a short delay to conserve resources
            await asyncio.sleep(0.1)
        except:
            break


def sanitize(x):
    # Return magnitude if data is Quantity
    if isinstance(x, Unit.Quantity):
        return x.magnitude
    try:
        # Attempt to serialize data
        x = json.dumps(x)
        return x
    except (TypeError, OverflowError):
        # Return string value of data if not serializable
        return str(x)


async def main():
    async with websockets.serve(handler, "", 8000):
        await asyncio.Future()  # Run forever

print("Starting WebSocket Server...")
asyncio.run(main())
