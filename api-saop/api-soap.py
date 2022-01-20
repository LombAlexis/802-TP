from spyne import Application, rpc, ServiceBase, Iterable, Integer, Unicode
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

from car import *

class CarsService(ServiceBase):
    @rpc(Unicode, Integer, _returns=Iterable(Unicode))
    def say_hello(ctx, name, times):
        for i in range(times):
            yield u'Hello, %s' % name

    @rpc(Integer, Integer, _returns=Integer)
    def addition(ctx, a, b):
            result = int(a) + int(b)
            return result

    @rpc(_returns=Iterable(Unicode))
    def getCars(ctx):
        return Car.getCarsName()

application = Application([CarsService], 'spyne.cars.info',
                          in_protocol=Soap11(validator='lxml'),
                          out_protocol=Soap11())

wsgi_application = WsgiApplication(application)


if __name__ == '__main__':
    from wsgiref.simple_server import make_server

    server = make_server('127.0.0.1', 8080, wsgi_application)
    server.serve_forever()

    #http://127.0.0.1:8080/?wsdl