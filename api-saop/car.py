class Car:
    def __init__(self, name, autonomy):
        self.name = name
        self.autonomy = autonomy

    def __str__(self):
     return str(self.name) + " " + str(self.autonomy)

    @staticmethod
    def getCarsName():
        names = []
        cars = Car.loadCars()
        for car in cars:
            names.append(car.name)
        return names;

    @staticmethod
    def getCarInfo(pName):
        cars = Car.loadCars()
        for car in cars:
            if (car.name == pName):
                #Pour l'instant renvoie que le string mais plus tard on y séparera avec tout les attributs
                yield str(car.name)
                yield str(car.autonomy)
                return
        yield "No cars found, check the name of the car"
        return

    @staticmethod
    def loadCars():
        cars = []
        cars.append(Car("Voiture", 400))
        
        return cars;