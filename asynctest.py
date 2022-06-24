import obd

obd.logger.setLevel(obd.logging.DEBUG)

connection = obd.Async(protocol="4",
                         baudrate=38400, fast=True) # same constructor as 'obd.OBD()'

connection.watch(obd.commands.RPM) # keep track of the RPM

connection.start() # start the async update loop

while True:
    print(connection.query(obd.commands.RPM)) # non-blocking, returns immediately
