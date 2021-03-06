from spyne import Application, rpc, ServiceBase, Iterable, Integer, Unicode
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

from car import *

class CarsService(ServiceBase):
    #Retourne le nom des véhicules
    #retourne un tableau de string
    @rpc(_returns=Iterable(Unicode))
    def getCars(ctx):
        return Car.getCarsName()

    #Retourne les caractéristique d'un véhicule passé en paramètre
    #retourne un tableau de int
    @rpc(Unicode, _returns=Iterable(Unicode))
    def getInfo(ctx, name):
        return Car.getCarInfo(name)

application = Application([CarsService], 'spyne.cars.info',
                          in_protocol=Soap11(validator='lxml'),
                          out_protocol=Soap11())

wsgi_application = WsgiApplication(application)


if __name__ == '__main__':
    from wsgiref.simple_server import make_server

    server = make_server('127.0.0.1', 8080, wsgi_application)
    server.serve_forever()

    #http://127.0.0.1:8080/?wsdl