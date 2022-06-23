import time
import json
import obd
import asyncio
import websockets

def init():
    obd.logger.removeHandler(obd.console_handler)
    ports = obd.scan_serial()
    return obd.OBD(portstr=ports[0], protocol="4", baudrate=38400, fast=False)
 
async def handler(websocket, path):
    while True:
        rpm = connection.query(obd.commands.RPM).value
        speed = connection.query(obd.commands.SPEED).value

        data = {
        'rpm': rpm,
        'speed': speed
        }
        await websocket.send(json.dumps(data))
        time.sleep(3)

connection = init()

start_server = websockets.serve(handler, "localhost", 8000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()