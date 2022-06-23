import obd

ports = obd.scan_serial()
connection = obd.OBD(portstr=ports[0], protocol="4", baudrate=38400, fast=False)